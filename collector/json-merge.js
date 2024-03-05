const logger = require('pino')({ level: 'trace' })
const { readFile, writeFile } = require('fs/promises')

const deepMerge = (target, source)  => {
  if (typeof target !== 'object' || target === null) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
      target[key] = deepMerge(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
}

const mergeJsonResponse = async (target, filePath) => {
  try {
    const sourceData = await readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(sourceData);
    const mergedData = deepMerge(jsonData, target);
    const formattedData = JSON.stringify(mergedData, null, 2); // Pretty format with 2 spaces indentation
    await writeFile(filePath, formattedData, 'utf-8');
    logger.debug(`merged and wrote data to ${filePath}`)
  } catch (ex) {
    logger.error(ex);
  }
}
module.exports = {
  mergeJsonResponse
}
