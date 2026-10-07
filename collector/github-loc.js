import pino from 'pino'

const logger = pino({ level: 'trace' })
const TOKEN = process.env.GH_TOKEN || ''

const GH_EMAIL = 'info.dvgamer@gmail.com'
const GRAPHQL_URL = 'https://api.github.com/graphql'

const historyFragment = (
  after = '',
) => `defaultBranchRef { target { ... on Commit { history(author: {emails: ["${GH_EMAIL}"]}, first: 100${after}) {
  nodes { additions deletions }
  pageInfo { hasNextPage endCursor }
}}}}`

const postGraphql = (query) =>
  fetch(GRAPHQL_URL, {
    body: JSON.stringify({ query }),
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    method: 'POST',
  })

const sumNodes = (nodes) => (nodes ?? []).reduce((total, c) => total + (c.additions ?? 0) - (c.deletions ?? 0), 0)
const nextCursor = (history) => (history.pageInfo?.hasNextPage ? history.pageInfo.endCursor : null)

export async function fetchLocFromGraphQL(allRepos) {
  const BATCH = 10
  let loc = 0

  for (let i = 0; i < allRepos.length; i += BATCH) {
    const batch = allRepos.slice(i, i + BATCH).filter((r) => r.owner)
    if (batch.length) loc += await fetchBatchLoc(batch, i)
  }

  logger.info(`loc (graphql): ${loc}`)
  return loc
}

async function fetchBatchLoc(batch, index) {
  const aliases = batch
    .map((r, idx) => `r${idx}: repository(owner: "${r.owner.login}", name: "${r.name}") { ${historyFragment()} }`)
    .join('\n')
  const res = await postGraphql(`{ ${aliases} }`)
  const { data, errors } = await res.json().catch(() => ({}))
  if (!data) {
    logger.warn(`graphql batch ${index} non-json (status ${res.status})`)
    return 0
  }
  if (errors?.length) {
    logger.warn({ graphql_errors: errors.map((e) => e.message) })
    return 0
  }

  let loc = 0
  for (const [key, repoData] of Object.entries(data)) {
    const history = repoData?.defaultBranchRef?.target?.history
    if (!history) continue
    loc += sumNodes(history.nodes)
    const cursor = nextCursor(history)
    if (cursor) loc += await fetchRemainingLoc(batch[Number(key.slice(1))], cursor)
  }
  return loc
}

async function fetchRemainingLoc(repo, firstCursor) {
  let loc = 0
  let cursor = firstCursor
  for (let pages = 0; cursor && pages < 4; pages++) {
    const res = await postGraphql(
      `{ repository(owner: "${repo.owner.login}", name: "${repo.name}") { ${historyFragment(`, after: "${cursor}"`)} } }`,
    )
    const { data } = await res.json().catch(() => ({}))
    const history = data?.repository?.defaultBranchRef?.target?.history
    if (!history) break
    loc += sumNodes(history.nodes)
    cursor = nextCursor(history)
  }
  return loc
}
