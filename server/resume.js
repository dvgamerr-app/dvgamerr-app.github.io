const app = require('express')()
const request = require('request-promise')
const { touno } = require('@touno-io/db/schema')

const secret = process.env.RECAPTCHA_SECRET
const siteverify = process.env.RECAPTCHA_ENDPOINT || 'https://www.google.com/recaptcha/api/siteverify'

app.post('/resume', async (req, res) => {
  let { body } = req
  try {
    let data = { error: null }
    await touno.open()
    const { Resume } = touno.get()
    if (!Object.keys(body).length) {
      let resume = await Resume.find({})
      for (const raw of resume) {
        data[raw.section] = raw.content
      }
      if (!resume.length) data.error = 'Profile is null.'
    } else {
      for (const key in body) {
        let section = await Resume.findOne({ section: key })
        if (!section) throw new Error(`Resume section ${key} not found.`)
        await Resume.updateOne({ section: key }, { $set: { content: body[key], updated: new Date() } })
      }
    }
    res.json(data)
  } catch (ex) {
    res.json({ error: ex.message || ex })
  }
})


app.post('/email', async (req, res) => {
  try {
    if (!secret || !req.body.token) throw new Error('Token Recaptcha expired.')
    const response = req.body.token
    await touno.open()
    const { ResumeContact } = touno.get()

    let data = await request({ method: 'post', url: siteverify, json: true, formData: { secret, response } })
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
    
    res.json({ error: null })
  } catch (ex) {
    res.json({ error: ex.message || ex })
  }
})

// Export the server middleware
module.exports = app
