import 'dotenv/config'
import pino from 'pino'

import { mergeJsonResponse } from './helper.js'

const logger = pino({ level: 'trace' })

async function collectWakatime() {
  const stats = { average_seconds: 0, best_seconds: 0, weekly_seconds: 0 }
  const uid = '06633b1c-3ba7-44c2-ab5d-08e47ccc87ab'
  let userAgent = ''
  try {
    userAgent = (await fetchUserAgents())[0] || ''
  } catch {
    /* ignore UA fetch errors */
  }
  const res = await fetch(`https://wakatime.com/api/v1/users/${uid}/insights/days`, {
    headers: { accept: 'application/json', referer: 'https://wakatime.com/@dvgamerr', 'user-agent': userAgent },
  })
  if (res.status !== 200) {
    logger.warn(`wakatime insights error: ${res.status}`)
    return null
  }
  const payload = await res.json()
  const days = payload.data?.days || []
  const lastIndex = days.length - 1
  for (let i = lastIndex; i >= 0; i--) {
    const total = days[i].total
    stats.average_seconds += total
    if (i > lastIndex - 7) stats.weekly_seconds += total
    if (stats.best_seconds < total) stats.best_seconds = total
  }
  if (days.length) {
    stats.average_seconds /= days.length
    stats.weekly_seconds /= 7
  }

  await mergeJsonResponse(stats, './src/i18n/coding.json')
  await mergeJsonResponse(payload, './src/i18n/insights.json')
  return stats
}

async function fetchUserAgents() {
  const res = await fetch('https://jnrbsn.github.io/user-agents/user-agents.json')
  if (res.status !== 200) return []
  return res.json()
}

try {
  const wakatimeStats = await collectWakatime()
  logger.debug({ wakatime: wakatimeStats })
  logger.info('Completed')
} catch (err) {
  logger.error(err)
} finally {
  logger.info('Finish')
}
