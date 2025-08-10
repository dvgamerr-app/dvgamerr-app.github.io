require('dotenv').config()

const arg = require('arg')
const logger = require('pino')({ level: 'trace' })
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

// GitHub task moved to './github-task.js'

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
