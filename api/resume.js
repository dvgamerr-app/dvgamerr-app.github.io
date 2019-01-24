const app = require('express')()
const { website } = require('@touno-io/db/mongo')
router = app

router.get('/', async (req, res) => {
  try {
    const { WebResume } = await website.open()
    let data = await WebResume.findOne({ data: 'web-resume-profile' })
    res.status(200).json(data.content)
  } catch (ex) {
    res.status(500).json({ error: ex.message || ex })
  }
})

// Export the server middleware
module.exports = router
