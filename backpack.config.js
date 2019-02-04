const path = require('path')

module.exports = {
  webpack: (config, options) => {
    config.entry.main = './api/index.js'
    if (options.env === 'production') {
      config.devtool = false
      config.plugins.splice(1, 1)
      config.output.path = path.join(process.cwd(), 'dist')
    }
    return config
  }
}
