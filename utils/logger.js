const dateNow = () => {
    let date = new Date()
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()
    return date
}

const getFrontpage = (request) => {
    const date = dateNow()
    console.log(date, ' - GET FRONTEND      - ip: ', request.ip)
}

const newConnect = (request) => {
    const connectionIP = request.ip
    const date = dateNow()
    console.log(date, ' - NEW CONNECTION    - ip: ', connectionIP)
    console.log('  user-agent: ', request.headers['user-agent'])
}

const closeConnect = (request) => {
    const connectionIP = request.ip
    const date = dateNow()
    console.log(date, ' - CLOSE CONNECTION  - ip: ', connectionIP)
    console.log('  user-agent: ', request.headers['user-agent'])
}

const errorLog = (location, error) => {
    const date = dateNow()
    console.error(date, ` - ERROR AT: ${location}`)
    console.error(`     ERROR MESSAGE: ${error}`)
}

const serverStart = () => {
    const date = dateNow()
    console.log(date, ' SERVER STARTUP')
}

const serverStartDone = (version, port) => {
    const date = dateNow()
    console.log(date, ` SERVER STARTUP DONE - VERSION ${version} - PORT ${port}`)
}

module.exports = {
    newConnect,
    closeConnect,
    errorLog,
    getFrontpage,
    serverStart,
    serverStartDone
}