const Logger = require('../utils/logger')

const connectionLogger = (request, response, next) => {
    if(request.url === '/') {
        Logger.getFrontpage(request)
    }
    next()
}

module.exports = {
    connectionLogger
}