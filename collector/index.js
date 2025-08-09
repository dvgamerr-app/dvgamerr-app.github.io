require('dotenv').config()

const arg = require('arg')
const dayjs = require('dayjs')
const logger = require('pino')({ level: 'trace' })

const { getContributors, getLanguages, getOrgsRepos, getUserRepos } = require('./github')
const { mergeJsonResponse } = require('./json-merge')

const args = arg({
  '--file': String,
  '--github': Boolean,
  '--wakatime': Boolean,
})

const enableGithub = args['--github'] && process.env.GH_TOKEN
const enableWakatime = args['--wakatime'] && process.env.WK_COOKIE

// Initializes the application based on provided arguments and environment variables.
const Initializes = async () => {
  if (process.env.GH_TOKEN) logger.info(`'GH_TOKEN' is available`)
  if (enableGithub) logger.info(`API Github.com collector starting...`)

  if (process.env.WK_COOKIE) logger.info(`'WK_COOKIE' is available`)
  if (enableWakatime) logger.info(`API Wakatime.com collector starting...`)
}

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
  if (!enableGithub) return

  logger.info('Query Repositories')
  const coding = {
    commits: 0,
    languages: [],
    loc: 0,
    private: 53,
    public: 0, // Public Repos
    total: 0, // Total Repos
    updated: dayjs().toISOString(),
  }

  // const contribRepos = {}
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

const fetchUserAgent = async (n = 0) => {
  const res = await fetch(`https://jnrbsn.github.io/user-agents/user-agents.json`)
  if (res.status != 200) {
    logger.warn(`get user-agents.json error: ${res.status}`)
    return ''
  }
  const body = await res.json()
  return body[n]
}

const collectWakaTime = async () => {
  if (!enableWakatime) return

  const coding = {
    average_seconds: 0,
    best_seconds: 0,
    daytime: [],
    weekly_seconds: 0,
    // weektime: []
  }

  const uid = '06633b1c-3ba7-44c2-ab5d-08e47ccc87ab'
  const res = await fetch(`https://wakatime.com/api/v1/users/${uid}/insights/days`, {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      authority: 'wakatime.com',
      cookie: process.env.WK_COOKIE,
      referer: 'https://wakatime.com/@dvgamerr',
      'user-agent': fetchUserAgent(0),
    },
  })
  if (res.status !== 200) {
    logger.warn(`wakatime.com insights error: ${res.status}`)
    return
  }

  const body = await res.json()

  const { days: dayOfYear } = body.data

  const idx = dayOfYear.length - 1
  for (let i = idx; i >= 0; i--) {
    const totalDuration = dayOfYear[i].total
    // const dateDuration = dayjs(dayOfYear[i].date, 'YYYY-MM-DD')
    coding.average_seconds += totalDuration
    if (i > idx - 7) {
      coding.weekly_seconds += totalDuration
    }
    if (coding.best_seconds < totalDuration) coding.best_seconds = totalDuration

    // weekday
    // const dayInWeek = dateDuration.day()
    // const shiftWeek = dayInWeek - 1 < 0 ? 6 : dayInWeek - 1
    // if (!coding.weektime[shiftWeek]) coding.weektime[shiftWeek] = { count: 0, duration: 0 }
    // coding.weektime[shiftWeek] = {
    //   count: coding.weektime[shiftWeek].count + 1,
    //   duration: coding.weektime[shiftWeek].duration + totalDuration,
    // }
  }
  coding.average_seconds = coding.average_seconds / dayOfYear.length
  coding.weekly_seconds = coding.weekly_seconds / 7
  // coding.weektime = coding.weektime.map(e => e.duration / e.count)

  if (!args['--file']) {
    delete coding.daytime
  }

  await mergeJsonResponse(coding, './src/i18n/coding.json')
  await mergeJsonResponse(body, './src/i18n/insights.json')

  return coding
}

// const getCitibankUSD = async () => {
//   logger.info(`Foreign 'citibank.co.th' exchange rate...`)
//   const res = await fetch('https://www.citibank.co.th/THGCB/COA/frx/prefxratinq/flow.action')

//   if (res.status != 200) {
//     logger.error(new Error('https://www.citibank.co.th/ is down.'))
//   }
//   const body = await res.text()
//   const { groups: citibank } = /<label>(?<ccy>USD)[\W\w]+?<label>(?<buy>[\d.]+)[\W\w]+?<label>(?<sell>[\d.]+)/gi.exec(body)
//   if (!citibank) {
//     logger.warn(`Exchange rate is empty`)
//     return
//   }
//   citibank.sell = parseFloat(citibank.sell)
//   citibank.buy = parseFloat(citibank.buy)
//   await mergeJsonResponse({ currencry: citibank }, './src/i18n/experience.json')
// }

Initializes()
  .then(() =>
    Promise.all([
      collectGithubProjectStats(),
      // getCitibankUSD(),
      collectWakaTime(),
    ]),
  )
  .then((res) => {
    logger.debug(res)
    logger.info('Complated')
  })
  .catch((ex) => {
    logger.error(ex)
  })
  .finally(() => {
    logger.info('Finish')
  })
