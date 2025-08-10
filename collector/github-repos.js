import dayjs from 'dayjs'
import pino from 'pino'

import { mergeJsonResponse } from './helper.js'

const logger = pino({ level: 'trace' })
const API = 'https://api.github.com'
const TOKEN = process.env.GH_TOKEN || ''
let warned = false

async function gh(method, path) {
  if (!TOKEN && !warned) {
    warned = true
    logger.warn('GH_TOKEN missing: unauthenticated requests (rate limited)')
  }
  let tries = 4
  while (tries > 0) {
    const res = await fetch(`${API}${path}`, {
      headers: { Accept: 'application/vnd.github.v3+json', ...(TOKEN ? { Authorization: `token ${TOKEN}` } : {}) },
      method,
    })
    if (res.status <= 204) {
      try {
        return { data: await res.json(), status: res.status }
      } catch {
        return { data: null, status: res.status }
      }
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

const getContributors = (o, r) => gh('GET', `/repos/${o}/${r}/stats/contributors`)
const getLanguages = (o, r) => gh('GET', `/repos/${o}/${r}/languages`)
const getOrgRepos = (o, p) => gh('GET', `/orgs/${o}/repos?page=${p}&per_page=100`)
const getUserRepos = (p) => gh('GET', `/user/repos?type=owner&page=${p}&per_page=100`)

async function buildSummary(allRepos) {
  const summary = {
    commits: 0,
    languages: [],
    private: 53,
    public: allRepos.filter((r) => !r.private).length,
    total: 0,
    updated: dayjs().toISOString(),
  }
  summary.total = allRepos.length + summary.private
  const langBytes = {}
  const tasks = allRepos.map(async (r) => {
    if (!r.owner) return
    const { data: contrib, status: sc } = await getContributors(r.owner.login, r.name)
    if (sc === 200 && Array.isArray(contrib)) for (const c of contrib) if (c.author?.login === 'dvgamerr') summary.commits += c.total
    const { data: langs, status: sl } = await getLanguages(r.owner.login, r.name)
    if (sl === 200 && langs) {
      for (const k in langs) langBytes[k] = (langBytes[k] || 0) + langs[k]
      summary.languages = Array.from(new Set([...Object.keys(langs), ...summary.languages])).sort()
    }
  })
  logger.info(`detail tasks: ${tasks.length}`)
  await Promise.all(tasks)
  return { langBytes, summary }
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

async function main() {
  logger.info('Query repositories')
  const orgRepos = await fetchOrgRepos(['dvgamerr-app', 'dl-fansub', 'un-centralgroup', 'un-nipponsysits', 'un-wedo', 'untirkx'])
  const userRepos = await fetchOwnerRepos()
  const allRepos = [...orgRepos, ...userRepos]
  const projects = pickOpenSource(allRepos)
  const { langBytes, summary } = await buildSummary(allRepos)
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
