const express = require('express')
const app = express()
const cors = require('cors')
const pushRouter = require('./controllers/pushRouter') /*SSE push router that sends info to frontend*/
const dataRouter = require('./controllers/dataRouter') /*pull based router, not requred by frontend, mostly unused*/
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const dataStreams = require('./streams/dataStreams')

/* override default console --> add timestamp to start of logs */
const Logger = require('./utils/logger')
console.log = Logger.consoleLogOverride
console.error = Logger.consoleErrorOverride

const OC_PULL_INTERVAL = config.OC_PULL_INTERVAL

app.use(cors())
app.use('/api/push', pushRouter)
app.use('/api/pull', dataRouter)
app.use(middleware.connectionLogger)
app.use(express.static('build'))
app.setMaxListeners(100) //at 101 browsers connected gives Node warning in console.

const updateTeams = () => dataStreams.updateTeams(app)
const updateData = () => dataStreams.updateData(app)

/*if services are changed - report will include it in 4 sec but Services will take 1h - untested if it causes errors, prob not.
    same for Teams & AgentsOnline/Queue */
const main = async () => {
    console.log('SERVER STARTUP START')

    await updateTeams()
    await updateData() //sends version info to frontend, used to force frontend to refresh on update

    setInterval(updateData, OC_PULL_INTERVAL) // 2.5 sec - database updates every 5-6sec -defined in .env file
    setInterval(updateTeams, 30 * 60 * 1000) //30min  30min * 60sec * 1000msec
    console.log(`SERVER STARTUP DONE - VERSION ${config.SERVER_VERSION} - PORT ${config.PORT}`)
}

main()

module.exports = app
