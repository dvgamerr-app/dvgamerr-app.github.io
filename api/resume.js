const app = require('express')()
const { touno } = require('@touno-io/db/schema')
router = app

router.get('/', async (req, res) => {
  try {
    await touno.open()
    const { Resume } = touno.get()
    let data = {}
    for (const raw of (await Resume.find({}))) {
      data[raw.section] = raw.content
    }
    res.json(data)
  } catch (ex) {
    res.status(500).json({ error: ex.message || ex })
  }
})

// Export the server middleware
module.exports = router
