const app = require('express')()
const bodyParser = require('body-parser')
const { website } = require('@touno-io/db/mongo')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/email', async (req, res) => {
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

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
