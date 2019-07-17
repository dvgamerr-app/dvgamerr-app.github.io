const app = require('express')()
const bodyParser = require('body-parser')
const request = require('request-promise')
const debuger = require('@touno-io/debuger')
const { touno } = require('@touno-io/db/schema')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const reSecret = process.env.RECAPTCHA_SECRET
const reEndpoint = process.env.RECAPTCHA_ENDPOINT || 'https://www.google.com/recaptcha/api/siteverify'
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/my-resume', require('./resume.js'))

app.post('/api/email', async (req, res) => {
  try {
    if (!reSecret || !req.body.token) throw new Error('Token Recaptcha expired.')

    await touno.open()
    const { ResumeContact } = touno.get()

    let data = await request({
      method: 'post',
      url: reEndpoint,
      json: true,
      formData: {
        secret: reSecret,
        response: req.body.token
      }
    })
    if (!data.success) throw new Error(data['error-codes'])
    
    await new ResumeContact(Object.assign({
      sended: false,
      score: data.score,
      challenge: new Date(data.challenge_ts),
      created: new Date()
    }, req.body)).save()

    // const { name, email, subject, text } = req.body
    // await debuger.Slack({ 
    //   text: `*${subject}*\n${text}\n\nby _${email}_`,
    //   name: name,
    //   channel: '#contact-us'
    // })
    res.status(200).json({ error: null })
  } catch (ex) {
    res.status(500).json({ error: ex.message || ex })
  }
})


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
