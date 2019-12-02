const app = require('express')()
const bodyParser = require('body-parser')
const debuger = require('@touno-io/debuger')
const { touno } = require('@touno-io/db/schema')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', require('./resume.js'))

const expressInitialize = async () => {
  let logger = await debuger('SERVER')
  await touno.open()
  logger.info('Mongo connected.')
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(nuxt.render)

  // Listen the server
  await app.listen(port, host)
  logger.start('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
expressInitialize()
