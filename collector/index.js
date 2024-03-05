require('dotenv').config()

const arg = require('arg')
const dayjs = require('dayjs')
const logger = require('pino')({ level: 'trace' })

const { mergeJsonResponse } = require('./json-merge')
const {
  getOrgsRepos,
  getUserRepos,
  getContributors,
  getLanguages,
  getCommitActivity,
} = require('./github')

const args = arg({
	'--github': Boolean,
	'--wakatime': Boolean,
});

const enableGithub = args['--github'] && process.env.GH_TOKEN
const enableWakatime =args['--wakatime'] && process.env.WK_TOKEN

// Initializes the application based on provided arguments and environment variables.
const Initializes = async () => {

  if (process.env.GH_TOKEN) logger.info(`'GH_TOKEN' is available`)
  if (enableGithub) logger.info(`API Github.com collector starting...`)

  if (process.env.WK_TOKEN) logger.info(`'WK_TOKEN' is available`)
  if (enableWakatime) logger.info(`API Wakatime.com collector starting...`)
}

Initializes().then(() => Promise.all([
  collectGithubProjectStats(),
])).then((res) => {
  logger.debug(res)
  logger.info('Complated')
}).catch(ex => {
  logger.error(ex)
}).finally(() => {
  logger.info('Finish')
})

// const apiWaka = new Octokit({
//   baseUrl: 'https://wakatime.com/api/v1'
// })

const collectReposOrgs = async (orgsRepo = ['dvgamerr-app']) => {
  let repos = []
  let nextPage = false

  const repoTask = []
  for (const org of orgsRepo) {
    repoTask.push((async () => {
      let page = 0
      do {
        page++
        const { data } = await getOrgsRepos(org, page)
        repos = repos.concat(data)
        nextPage = data.length > 0
        if (nextPage) {
          logger.debug(` - '${org}' repos: ${data.length}`)
        }
      } while(nextPage)
    })())
  }
  await Promise.all(repoTask)
  return repos
}

const collectRepoOwner = async () => {
  let repos = []
  let nextPage = false

  const repoTask = []
  let page = 0
  do {
    page++
    const { data } = await getUserRepos(page)
    repos = repos.concat(data)
    nextPage = data.length > 0
  } while(nextPage)
  logger.debug(` - 'owner' repos: ${repos.length}`)
  return repos
}

const collectGithubProjectStats = async () => {
  if (!enableGithub) return

  logger.info('Query Repositories')
  const coding = {
    total: 0, // Total Repos
    private: 3,
    public: 0, // Public Repos
    languages: [],
    commits: 0,
    loc: 0
  }

  // const contribRepos = {}
  const orgRepos = await collectReposOrgs([ 'dvgamerr-app','central-group','nippon-sysits' ])
  const usrRepos = await collectRepoOwner()

  const repos = orgRepos.concat(usrRepos)
  coding.total = repos.length + coding.private
  coding.public = repos.filter(e => !e.private).length
  logger.info('Contributors Task...')

  const repoTask = []
  for await (const e of repos) {
    repoTask.push((async () => {
      logger.trace(` - repos '${e.owner.login}/${e.name}'`)
      const { data: contrib, status: statusContrib } = await getContributors(e.owner.login, e.name)
      if (statusContrib === 200) {
        for (const con of contrib) {
          if (con.author.login !== 'dvgamerr') continue
          coding.commits += con.total
        }
      }

      const { data: langs, status: statusLangs }  = await getLanguages(e.owner.login, e.name)
      if (statusLangs === 200) {
        coding.languages = [...new Set(coding.languages.concat(Object.keys(langs)))]
      }

      // const { data: loc, status: statusLoc }  = await ghlocFetch(e.owner.login, e.name)
      // if (statusLoc === 200) {
      //   coding.loc += parseInt(loc.message)
      // }
    })())
  }

  logger.info(`Task Github API (${repoTask.length}) ...`)
  await Promise.all(repoTask)

  // https://ghloc.vercel.app/api/dvgamerr-app/go-hoyolab/badge

  await mergeJsonResponse(coding, './src/i18n/coding.json')

  // coding.languages = Object.keys(coding.languages).length
  // // savedRepos
  // logger.info('Saving...')

  // unlinkSync('./docs/data/repos.json')
  // await mergeJSON('repos.json', savedRepos)
  // await mergeJSON('coding.json', coding)
  return coding
}

// const getWakaTime = async () => {
//   if (!process.env.WK_TOKEN || !enableWakatime) return
//   // https://wakatime.com/api/v1/users/current/durations?api_key=f389e6d1-207e-4c49-9526-d2623ce7b6d1&date=2022-03-26


//   const coding = {
//     updated: new Date().toISOString(),
//     weekly_seconds: 0,
//     average_seconds: 0,
//     best_seconds: 0,
//     daytime: [],
//     weektime: []
//   }

//   let beginDateTime = ''
//   let currDateTime = ''
//   let dayTime = {}
//   let weekTime = {}

//   for (let i = 0; i <= 23; i++) dayTime[i] = 0
//   for (let i = 0; i <= 6; i++) weekTime[i] = 0

//   wakaTask = []
//   const totalDay = 365
//   let cDate = dayjs().startOf('d')
//   for (let i = totalDay; i >= 0; i--) {
//     cDate = dayjs().startOf('d')
//     currDateTime = cDate.add(i * -1, 'd').format('YYYY-MM-DD')
//     const currDay = cDate.add(i * -1, 'd').day()
//     if (!beginDateTime) beginDateTime = currDateTime
//     wakaTask.push((async () => {
//       const { status, data: { data: durations } } = await apiWaka.request('GET /users/current/durations', {
//         api_key: process.env.WK_TOKEN,
//         date: currDateTime
//       })
      // if (status !== 200) return logger.error(status)

//       let totalDuration = 0
//       for (const data of durations) {
//         if (data.duration == 0) continue
//         const beginTime = dayjs(data.time * 1000).hour()
//         const endTime = dayjs((data.time + data.duration) * 1000).hour()

//         for (let i = beginTime; i <= endTime; i++) {
//           dayTime[i] = (dayTime[i] || 0) + 1
//         }
//         totalDuration += data.duration
//       }
//       coding.average_seconds += totalDuration
//       if (totalDuration > coding.best_seconds) coding.best_seconds = totalDuration
//       if (i < 7) coding.weekly_seconds = totalDuration

//       weekTime[currDay] = (weekTime[currDay] || 0) + totalDuration
//     })())
//     if (wakaTask.length == 10) {
      // logger.log(`- fetch: ${beginDateTime} to ${currDateTime}`)
//       await Promise.all(wakaTask)
//       wakaTask = []
//       beginDateTime = ''
//     }
//   }

//   if (wakaTask.length > 0) {
    // logger.log(`- fetch: ${beginDateTime} to ${currDateTime}`)
//     await Promise.all(wakaTask)
//   }

//   coding.average_seconds /= totalDay
//   coding.daytime = Object.values(dayTime)
//   weekTime = Object.values(weekTime).map(e => parseInt(e / 60 / 60 * 100) / 100)
//   weekTime.push(weekTime.shift())

//   coding.weektime = weekTime
//   await mergeJSON('coding.json', coding)
// }

// const apiLayer = new Octokit({
//   baseUrl: 'https://api.bitkub.com/api'
// })

// const getCurrencryUSD = async () => {

  // logger.info('Query bitkub.com THB-USDT')
//   const symbols = 'THB_USDT'
//   const { data, status } = await apiLayer.request('GET /market/ticker?sym={?symbols}', {
//     symbols
//   })

//   const salary = { rate: data[symbols].highestBid }
//   await mergeJSON('resume.json', { salary })
// }

// Promise.all([
//   markdownToJson('work.json'),
//   getCurrencryUSD(),
//   getGithubStats(),
//   getWakaTime(),
// ]).then(() => {
  // logger.log('Complated')
// }).catch(ex => {
//   console.error(ex)
// })
