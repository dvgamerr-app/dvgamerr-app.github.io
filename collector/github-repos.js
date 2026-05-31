import dayjs from 'dayjs'
import pino from 'pino'

import { mergeJsonResponse } from './helper.js'

const logger = pino({ level: 'trace' })
const API = 'https://api.github.com'
const TOKEN = process.env.GH_TOKEN || ''
let warned = false

async function gh(method, path, extraHeaders = {}) {
  if (!TOKEN && !warned) {
    warned = true
    logger.warn('GH_TOKEN missing: unauthenticated requests (rate limited)')
  }
  let tries = 4
  while (tries > 0) {
    const res = await fetch(`${API}${path}`, {
      headers: { Accept: 'application/vnd.github.v3+json', ...(TOKEN ? { Authorization: `token ${TOKEN}` } : {}), ...extraHeaders },
      method,
    })
    if (res.status <= 204) {
      try {
        return { data: await res.json(), status: res.status }
      } catch {
        return { data: null, status: res.status }
      }
    }
    if (res.status === 403 || res.status === 404) {
      logger.warn({ path, status: res.status })
      return { data: null, status: res.status }
    }
    tries--
    if (!tries) {
      let payload = null
      try {
        payload = await res.json()
      } catch {
        /* ignore */
      }
      logger.warn({ path, status: res.status, unauthenticated: !TOKEN })
      return { data: payload, status: res.status }
    }
    await Bun.sleep(1000)
  }
  return { data: null, status: 0 }
}

const getLanguages = (o, r) => gh('GET', `/repos/${o}/${r}/languages`)
const getOrgRepos = (o, p) => gh('GET', `/orgs/${o}/repos?page=${p}&per_page=100`)
const getUserRepos = (p) => gh('GET', `/user/repos?type=owner&page=${p}&per_page=100`)

async function buildSummary(allRepos) {
  const summary = {
    commits: 0,
    languages: [],
    loc: 0,
    private: 53,
    public: allRepos.filter((r) => !r.private).length,
    total: 0,
    updated: dayjs().toISOString(),
  }
  summary.total = allRepos.length + summary.private
  const langBytes = {}

  const CONCURRENCY = 10
  logger.info(`detail tasks: ${allRepos.length} (concurrency: ${CONCURRENCY})`)
  for (let i = 0; i < allRepos.length; i += CONCURRENCY) {
    const batch = allRepos.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async (r) => {
        if (!r.owner) return
        const { data: langs, status: sl } = await getLanguages(r.owner.login, r.name)
        if (sl === 200 && langs) {
          for (const k in langs) langBytes[k] = (langBytes[k] || 0) + langs[k]
          summary.languages = Array.from(new Set([...Object.keys(langs), ...summary.languages])).sort()
        }
      }),
    )
  }

  return { langBytes, summary }
}

async function fetchLocFromGraphQL(allRepos) {
  const GH_EMAIL = 'info.dvgamer@gmail.com'
  const BATCH = 10
  let loc = 0

  for (let i = 0; i < allRepos.length; i += BATCH) {
    const batch = allRepos.slice(i, i + BATCH).filter((r) => r.owner)
    if (!batch.length) continue

    const aliases = batch
      .map(
        (r, idx) => `r${idx}: repository(owner: "${r.owner.login}", name: "${r.name}") {
        defaultBranchRef { target { ... on Commit { history(author: {emails: ["${GH_EMAIL}"]}, first: 100) {
          nodes { additions deletions }
          pageInfo { hasNextPage endCursor }
        }}}}
      }`,
      )
      .join('\n')

    const res = await fetch('https://api.github.com/graphql', {
      body: JSON.stringify({ query: `{ ${aliases} }` }),
      headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { data, errors } = await res.json()
    if (errors?.length) {
      logger.warn({ graphql_errors: errors.map((e) => e.message) })
      continue
    }

    for (const [key, repoData] of Object.entries(data ?? {})) {
      const history = repoData?.defaultBranchRef?.target?.history
      if (!history) continue
      for (const c of history.nodes ?? []) loc += (c.additions ?? 0) - (c.deletions ?? 0)

      let cursor = history.pageInfo?.hasNextPage ? history.pageInfo.endCursor : null
      const repo = batch[Number(key.slice(1))]
      let pages = 0
      while (cursor && pages < 4) {
        pages++
        const pageRes = await fetch('https://api.github.com/graphql', {
          body: JSON.stringify({
            query: `{ repository(owner: "${repo.owner.login}", name: "${repo.name}") {
              defaultBranchRef { target { ... on Commit { history(author: {emails: ["${GH_EMAIL}"]}, first: 100, after: "${cursor}") {
                nodes { additions deletions }
                pageInfo { hasNextPage endCursor }
              }}}}
            }}`,
          }),
          headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const { data: pd } = await pageRes.json()
        const ph = pd?.repository?.defaultBranchRef?.target?.history
        if (!ph) break
        for (const c of ph.nodes ?? []) loc += (c.additions ?? 0) - (c.deletions ?? 0)
        cursor = ph.pageInfo?.hasNextPage ? ph.pageInfo.endCursor : null
      }
    }
  }

  logger.info(`loc (graphql): ${loc}`)
  return loc
}

async function fetchOrgRepos(orgs) {
  const repos = []
  await Promise.all(
    orgs.map(async (org) => {
      for (let page = 1; ; page++) {
        const { data } = await getOrgRepos(org, page)
        if (!Array.isArray(data) || !data.length) break
        repos.push(...data)
        logger.debug(`org:${org} +${data.length}`)
      }
    }),
  )
  return repos
}

async function fetchOwnerRepos() {
  const repos = []
  for (let page = 1; ; page++) {
    const { data } = await getUserRepos(page)
    if (!Array.isArray(data) || !data.length) break
    repos.push(...data)
  }
  logger.debug(`owner repos: ${repos.length}`)
  return repos
}

async function fetchTotalCommits() {
  const { data, status } = await gh('GET', '/search/commits?q=author:dvgamerr&per_page=1', {
    Accept: 'application/vnd.github.cloak-preview+json',
  })
  if (status === 200 && data?.total_count) {
    logger.info(`total commits: ${data.total_count}`)
    return data.total_count
  }
  return 0
}

async function main() {
  logger.info('Query repositories')
  const [orgRepos, userRepos, totalCommits] = await Promise.all([
    fetchOrgRepos(['dvgamerr-app', 'dl-fansub', 'untirkx']),
    fetchOwnerRepos(),
    fetchTotalCommits(),
  ])
  const allRepos = [...orgRepos, ...userRepos]
  const projects = pickOpenSource(allRepos)
  const { langBytes, summary } = await buildSummary(allRepos)
  if (totalCommits) summary.commits = totalCommits
  const loc = await fetchLocFromGraphQL(allRepos)
  if (loc) summary.loc = loc
  const bytes = Object.fromEntries(Object.entries(langBytes).sort(([, a], [, b]) => b - a))
  await mergeJsonResponse(summary, './src/i18n/coding.json')
  await mergeJsonResponse({ coding: { bytes }, repos: projects, skill: { coding: summary.languages } }, './src/i18n/experience.json')
}

await main()

function pickOpenSource(repos) {
  return repos
    .filter((r) => r.owner && r.description && r.topics?.includes('open-source'))
    .map((r) => ({
      created_at: r.created_at,
      description: r.description,
      forks: r.forks,
      homepage: r.homepage,
      license: r.license,
      name: r.name,
      pushed_at: r.pushed_at,
      stargazers_count: r.stargazers_count,
      svn_url: r.svn_url,
      topics: r.topics,
      watchers: r.watchers,
    }))
    .sort((a, b) => b.stargazers_count - a.stargazers_count || dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf())
}
