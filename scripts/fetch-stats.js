// Pulls coding stats from the stash API into src/i18n/*.json before `astro build`.
// On any failure the committed JSON is kept, so an API outage never breaks a build.
const BASE = (process.env.STASH_URL || 'https://stash.dvgamerr.app').replace(/\/$/, '')
const I18N = 'src/i18n'

const get = async (path) => {
  const res = await fetch(`${BASE}/v1${path}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20_000) })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.json()
}

const readJson = (name) => Bun.file(`${I18N}/${name}.json`).json()
const writeJson = (name, data) => Bun.write(`${I18N}/${name}.json`, JSON.stringify(data, null, 2) + '\n')

async function main() {
  const [stats, telemetry, fx] = await Promise.all([get('/coding'), get('/telemetry'), get('/exchange-rates?ccy=USD')])
  const usd = fx.items.find((item) => item.ccy === 'USD')
  if (!usd) throw new Error('exchange-rates: USD missing')

  const { bytes, popular, top5, weektime, ...codingStats } = stats
  const coding = await readJson('coding')
  // The API sends seconds per weekday; the site keeps hours.
  await writeJson('coding', { ...coding, ...codingStats, weektime: weektime.map((s) => Math.round((s / 3600) * 100) / 100) })

  const experience = await readJson('experience')
  experience.coding = { ...experience.coding, bytes, top5 }
  experience.skill = { ...experience.skill, coding: popular }
  experience.currencry = { buy: usd.buy, ccy: usd.ccy, sell: usd.sell }
  await writeJson('experience', experience)

  await writeJson('telemetry', telemetry)

  const files = ['coding', 'experience', 'telemetry'].map((name) => `${I18N}/${name}.json`)
  await Bun.spawn(['bun', 'x', '--bun', 'prettier', '--write', ...files], { stdout: 'ignore' }).exited
  console.log(`[stats] updated from ${BASE}`)
}

try {
  await main()
} catch (error) {
  console.warn(`[stats] skipped, keeping committed data: ${error.message}`)
}
