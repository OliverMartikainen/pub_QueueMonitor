const app = require('./app')
const config = require('./utils/config')
const http = require('http') 

const server = http.createServer(app)

server.listen(config.PORT, () => {console.log(`Server running from port ${config.PORT}`)})
