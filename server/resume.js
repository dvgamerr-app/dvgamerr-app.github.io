const app = require('express')()
const { touno } = require('@touno-io/db/schema')

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

// Export the server middleware
module.exports = app
