const app = require('express')()
const bodyParser = require('body-parser')
const { website } = require('@touno-io/db/mongo')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3001

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

if (config.dev) {
  app.use((req, res, next) => {
    const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/my-resume', require('./resume.js'))

app.post('/api/email', async (req, res) => {
  try {
    const { WebResumeContact } = await website.open()
    await new WebResumeContact(Object.assign({
      sended: false,
      readed: false,
      created: new Date()
    }, req.body)).save()
    res.status(200).json({ error: null })
  } catch (ex) {
    res.status(500).json({ error: ex.message || ex })
  }
})

if (!config.dev) {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  // Give nuxt middleware to express
  app.use(nuxt.render)
}

async function start() {
  // Listen the server
  const server = await app.listen(port, host)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
start()
