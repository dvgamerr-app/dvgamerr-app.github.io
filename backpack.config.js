module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './api/index.js'
    return config
  }
}
