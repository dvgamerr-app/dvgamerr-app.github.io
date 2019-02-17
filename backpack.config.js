const path = require('path')

module.exports = {
  webpack: (config, options) => {
    config.entry.main = './api/index.js'
    config.output.path = path.join(process.cwd(), 'dist')
    if (options.env === 'production') {
      config.devtool = false
      config.plugins.splice(1, 1)
    }
    return config
  }
}
