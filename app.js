const express = require('express')
const app = express()
const cors = require('cors')
const pushRouter = require('./controllers/pushRouter') /*SSE push router that sends info to frontend*/
const dataRouter = require('./controllers/dataRouter') /*pull based router, not requred by frontend, mostly unused*/
const Locals = require('./data/locals') /* Stores "Teams" (returned by databaseToLocal function) and "Services" (unaltered database data)*/
const Logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const dataStreams = require('./streams/dataStreams')

const OC_PULL_INTERVAL = config.OC_PULL_INTERVAL

app.use(cors())
app.use('/api/push', pushRouter)
app.use('/api/pull', dataRouter)
app.use(middleware.connectionLogger)
app.use(express.static('build'))
app.setMaxListeners(100) //at 101 browsers connected gives warning in console.

Locals.Errors = { Data: {}, Teams: {},  } //needs to be initialized for errorHandling
Locals.Connections = { data: 0, teams: 0, highscore: 0, time: null }

const updateTeams = () => dataStreams.updateTeams(app)
const updateData = () => dataStreams.updateData(app)

const initializeServer = async () => {
    await updateTeams()
    await updateData() //sends version info to frontend, used to force frontend to refresh on update
}

/*if services are changed - report will include it in 4 sec but Services will take 1h - untested if it causes errors, prob not.
    same for Teams & AgentsOnline/Queue */
const main = () => {
    Logger.serverStart()
    initializeServer()
    setInterval(updateData, OC_PULL_INTERVAL) // 2.5 sec - database updates every 5-6sec -defined in .env file
    setInterval(updateTeams, 1800000) //30min
    Logger.serverStartDone(config.SERVER_VERSION, config.PORT)
}

main()

module.exports = app
