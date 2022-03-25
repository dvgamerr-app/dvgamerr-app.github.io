const { readdir, readFile, writeFile } = require('fs/promises')
const { extname, join } = require('path')

const mdPath = './docs/'
readdir(mdPath).then(async files => {
  let workfile = {}
  for await (const file of files) {
    if (extname(file) !== '.md') continue
    const data = await readFile(join(mdPath, file))
    workfile[file] = data.toString()
  }
  await writeFile(join(mdPath, 'work.json'), JSON.stringify(workfile))
}).catch(ex => {
  console.error(ex)
})
