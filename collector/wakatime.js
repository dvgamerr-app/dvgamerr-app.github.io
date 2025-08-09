const url = process.env.WAKA_BADGE_URL
if (!url) {
  console.error('Missing WAKA_BADGE_URL environment variable')
  process.exit(1)
}

const res = await fetch(url, { redirect: 'follow' })
if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
const svg = await res.text()

// Extract inner text of <text>...</text> elements from the SVG
const texts = [...svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map((m) => m[1])
const val = texts.find((t) => /\bhrs?\b/i.test(t)) || ''
if (!val) {
  console.error('No wakatime value found in badge')
  process.exit(0)
}

const path = 'src/i18n/coding.json'
const json = await Bun.file(path).json()
if (json.wakatime === val) {
  console.log('Wakatime unchanged')
  process.exit(0)
}
json.wakatime = val
json.updated = new Date().toISOString()
await Bun.write(path, JSON.stringify(json, null, 2) + '\n')
console.log('Updated wakatime to', val)
