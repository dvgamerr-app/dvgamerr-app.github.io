const dayjs = require('dayjs')
const logger = require('pino')({ level: 'trace' })

const { getContributors, getLanguages, getOrgsRepos, getUserRepos } = require('./github')
const { mergeJsonResponse } = require('./json-merge')

const collectReposOrgs = async (orgsRepo = ['dvgamerr-app']) => {
  let repos = []
  let nextPage = false

  const repoTask = []
  for (const org of orgsRepo) {
    repoTask.push(
      (async () => {
        let page = 0
        do {
          page++
          const { data } = await getOrgsRepos(org, page)
          repos = repos.concat(data)
          nextPage = data.length > 0
          if (nextPage) {
            logger.debug(` - '${org}' repos: ${data.length}`)
          }
        } while (nextPage)
      })(),
    )
  }
  await Promise.all(repoTask)
  return repos
}

const collectRepoOwner = async () => {
  let repos = []
  let nextPage = false

  let page = 0
  do {
    page++
    const { data } = await getUserRepos(page)
    repos = repos.concat(data)
    nextPage = data.length > 0
  } while (nextPage)
  logger.debug(` - 'owner' repos: ${repos.length}`)
  return repos
}

const collectGithubProjectStats = async () => {
  logger.info('Query Repositories')
  const coding = {
    commits: 0,
    languages: [],
    loc: 0,
    private: 53,
    public: 0,
    total: 0,
    updated: dayjs().toISOString(),
  }

  const orgRepos = await collectReposOrgs(['dvgamerr-app', 'dl-fansub', 'un-centralgroup', 'un-nipponsysits', 'un-wedo', 'untirkx'])
  const usrRepos = await collectRepoOwner()

  const repos = orgRepos.concat(usrRepos)
  coding.total = repos.length + coding.private
  coding.public = repos.filter((e) => !e.private).length

  let projectRepos = []
  for (const e of orgRepos) {
    if (!e.owner) {
      logger.debug('skip:', e)
      continue
    }
    if (e.owner.login !== 'dvgamerr-app' || !e.description || !e.topics.includes('open-source')) continue
    projectRepos.push({
      created_at: e.created_at,
      description: e.description,
      forks: e.forks,
      homepage: e.homepage,
      license: e.license,
      name: e.name,
      pushed_at: e.pushed_at,
      stargazers_count: e.stargazers_count,
      svn_url: e.svn_url,
      topics: e.topics,
      watchers: e.watchers,
    })
  }

  projectRepos = projectRepos.sort((a, b) => {
    const ay = dayjs(a.created_at).year()
    const by = dayjs(b.created_at).year()
    return a.stargazers_count > b.stargazers_count ? -1 : a.stargazers_count < b.stargazers_count ? 1 : ay > by ? -1 : 1
  })

  logger.info('Contributors Task...')

  const repoTask = []
  const repoLangs = {}
  for await (const e of repos) {
    if (e.owner)
      repoTask.push(
        (async () => {
          logger.trace(` - repos '${e.owner.login}/${e.name}'`)
          const { data: contrib, status: statusContrib } = await getContributors(e.owner.login, e.name)
          if (statusContrib === 200) {
            for (const con of contrib) {
              if (con.author.login !== 'dvgamerr') continue
              coding.commits += con.total
            }
          }

          const { data: langs, status: statusLangs } = await getLanguages(e.owner.login, e.name)
          if (statusLangs === 200) {
            for (const key in langs) {
              repoLangs[key] = (repoLangs[key] || 0) + langs[key]
            }
            coding.languages = [...new Set(coding.languages.concat(Object.keys(langs)))].sort()
          }
        })(),
      )
  }

  logger.info(`Task Github API (${repoTask.length}) ...`)
  await Promise.all(repoTask)

  const bytes = Object.fromEntries(Object.entries(repoLangs).sort(([, a], [, b]) => b - a))
  await mergeJsonResponse(coding, './src/i18n/coding.json')
  await mergeJsonResponse(
    {
      coding: { bytes },
      repos: projectRepos,
      skill: { coding: coding.languages },
    },
    './src/i18n/experience.json',
  )

  return coding
}

collectGithubProjectStats()
