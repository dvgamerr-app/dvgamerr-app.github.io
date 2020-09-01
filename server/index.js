const app = require('express')()
const bodyParser = require('body-parser')
const debuger = require('@touno-io/debuger')
const { touno } = require('@touno-io/db/schema')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.get('/_health', (req, res) => res.status(200).end('OK'))

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', require('./resume.js'))

const logger = debuger('SERVER')
const expressInitialize = async () => {
  await touno.open()
  logger.info('Mongo connected.')
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  await nuxt.ready()

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  logger.start(`Server listening on http://${host}:${port}`)
}

expressInitialize().catch((ex) => {
  logger.error(ex)
})
