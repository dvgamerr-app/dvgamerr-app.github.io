import pino from 'pino'
const logger = pino({ level: 'trace' })

export async function mergeJsonResponse(incomingData, filePath) {
  try {
    let existingData = {}
    try {
      existingData = JSON.parse(await Bun.file(filePath).text())
    } catch (err) {
      if (err.code !== 'ENOENT') logger.warn(err)
    }
    await Bun.write(filePath, JSON.stringify(deepMerge(existingData, incomingData), null, 2))
    logger.debug(`merged ${filePath}`)
  } catch (err) {
    logger.error(err)
  }
}

function deepMerge(target, source) {
  if (!target || typeof target !== 'object') return source
  for (const key of Object.keys(source)) {
    const value = source[key]
    if (Array.isArray(target[key])) target[key] = value
    else if (target[key] && typeof target[key] === 'object' && value && typeof value === 'object')
      target[key] = deepMerge(target[key], value)
    else target[key] = value
  }
  return target
}

export default mergeJsonResponse
