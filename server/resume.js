const app = require('express')()
const axios = require('axios')
const { touno } = require('@touno-io/db/schema')

const secret = process.env.RECAPTCHA_SECRET
const siteverify = process.env.RECAPTCHA_ENDPOINT || 'https://www.google.com/recaptcha/api/siteverify'

app.get('/resume', async (req, res) => {
  try {
    const { body } = req
    const data = { error: null }
    await touno.open()
    const { Resume } = touno.get()
    if (!Object.keys(body).length) {
      const resume = await Resume.find({})
      for (const raw of resume) {
        data[raw.section] = raw.content
      }
      if (!resume.length) { throw new Error('Profile is null.') }
    } else {
      for (const key in body) {
        const section = await Resume.findOne({ section: key })
        if (!section) { throw new Error(`Resume section ${key} not found.`) }
        await Resume.updateOne({ section: key }, { $set: { content: body[key], updated: new Date() } })
      }
    }
    res.json(data)
  } catch (ex) {
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
})

app.post('/email', async (req, res) => {
  try {
    if (!secret || !req.body.token) { throw new Error('Token Recaptcha expired.') }
    const response = req.body.token
    await touno.open()
    const { ResumeContact } = touno.get()

    const { data } = await axios({ method: 'post', url: siteverify, formData: { secret, response } })
    if (!data.success) { throw new Error(data['error-codes']) }

    await new ResumeContact(Object.assign({
      sended: false,
      score: data.score,
      challenge: new Date(data.challenge_ts),
      created: new Date()
    }, req.body)).save()
    // name || !this.msg.email || !this.msg.subject || !this.msg.text
    await axios.put('https://notice.touno.io/mr-touno/sentinel', { type: 'text', text: `Your got mail! by ${req.body.name}<${req.body.email}>\n*${req.body.subject}*\n${req.body.text}` })

    res.json({ error: null })
  } catch (ex) {
    res.json({ error: ex.message || ex })
  }
})

// Export the server middleware
module.exports = app
