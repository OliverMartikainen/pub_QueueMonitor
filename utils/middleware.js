

const connectionLogger = (request, response, next) => {
    const connectionIP = request.ip
    console.log('  ip:', request.ip)
    console.log('  user-agent: ', request.headers['user-agent'])
    console.log('connection from: ', connectionIP)
    //write to some file user and connection ip for sake of logging? also add request time to requests in frontend and record that? then compare to backend time for sake of science?
    next()
}

module.exports = {
    connectionLogger
}