const connectionLogger = (request, response, next) => {
    if(request.url === '/') {
        console.log(' - GET FRONTEND      - ip: ', request.ip)
        console.log('  user-agent: ', request.headers['user-agent'])
    }
    next()
}

module.exports = {
    connectionLogger
}