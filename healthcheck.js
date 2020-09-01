const http = require('http')
const options = { host: 'localhost', port: '3000', timeout: 2000 }
const request = http.request(options, (res) => {
  process.exit(!Number(res.statusCode === 200))
})

request.on('error', () => process.exit(1))
request.end()
