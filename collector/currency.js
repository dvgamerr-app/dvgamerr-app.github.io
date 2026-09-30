import pino from 'pino'

import { mergeJsonResponse } from './helper.js'

const logger = pino({ level: 'trace' })

const YAHOO_THBUSD = 'https://query1.finance.yahoo.com/v8/finance/chart/THBUSD=X?interval=1d&range=1d'

async function collectCurrency() {
  const res = await fetch(YAHOO_THBUSD, { headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0' } })
  if (res.status !== 200) {
    logger.warn(`yahoo THBUSD error: ${res.status}`)
    return null
  }
  const payload = await res.json()
  const usdPerThb = payload.chart?.result?.[0]?.meta?.regularMarketPrice
  if (!usdPerThb) {
    logger.warn('yahoo THBUSD: missing regularMarketPrice')
    return null
  }
  // Header.svelte divides THB by this value, so store THB per USD.
  const thbPerUsd = Math.round((1 / usdPerThb) * 100) / 100
  const currencry = { buy: thbPerUsd, ccy: 'USD', sell: thbPerUsd }
  await mergeJsonResponse({ currencry }, './src/i18n/experience.json')
  return { usdPerThb, ...currencry }
}

try {
  logger.debug({ currency: await collectCurrency() })
  logger.info('Completed')
} catch (err) {
  logger.error(err)
} finally {
  logger.info('Finish')
}
