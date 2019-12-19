const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./services/OC_Service') /* Database Serivce*/
const pushRouter = require('./controllers/pushRouter') /*SSE push router that sends info to frontend*/
const dataRouter = require('./controllers/dataRouter') /*pull based router, not requred by frontend, mostly unused*/
const Locals = require('./data/locals') /* Stores "Teams" (returned by databaseToLocal function) and "Services" (unaltered database data)*/
const formats = require('./formats/databaseToLocal')
const config = require('./utils/config')
const SERVER_VERSION = config.SERVER_VERSION /*Used to force connected browsers to update */

const OC_PULL_INTERVAL = config.OC_PULL_INTERVAL
let count = 1

app.use(cors())
app.use('/api/push', pushRouter)
app.use('/api/pull', dataRouter)
app.use(express.static('build'))
app.setMaxListeners(100) //at 101 browsers connected gives warning in console.

Locals.Errors = { Data: {}, Teams: {} } //needs to be initialized for errorHandling

/**
 * Supposed to handle error logging and responses. Doesnt really do anything atm.
 * Only logs to backend console. ToDo at some point?
 * 
 * 503 if frontend to backend problem
 * 502 if backend to database problem (backend will send 'Database Error' as response)
 * 500 for all unknowns
 */
const errorHandling = (response) => {
    const type = response.type
    if (Locals.Errors[type].status !== 502) {
        response.date = new Date().toISOString()
        Locals.Errors[type] = response
        return
    }
    //console.log(`Continues ${response.message}`, type)
}

/**
 * Is meant to be used for logging purposes
 * Not really used atm, except to indentify InboundReport data.
 * 
 * @param {*} response 
 * @param {String} type
 * @return {Object}
 */
const processResponse = (response, type) => {
    /*const result = `${response.status}  ${response.statusText}  ${response.data.length}     ${type}     ${response.headers.date}`
    console.log('    ', result)*/
    if (config.MODE === 'record') {
        const recordTestData = require('./utils/recordTestData')
        recordTestData(response, type, count)
    }
    if (type === 'ReportPBX' || type === 'ReportEmail' || type === 'Report') {
        return formats.setInboundReport(response.data, Locals.Services)
    }
    return response.data
}


/**
 * Function that sends "Queue", "AgentsOnline" and "InboundReport" data to frontend
 * Done at start then every 3-6 sec (database updates every 5-6 sec)
 * Only "InboundReport" is formatted before sent, "Queue" and "AgentsOnline" are sent in same format as recieved from database
 * 
 * @emits {Queue, AgentsOnline, ReportsPBX, ReportEmail} to /api/push/dataUpdates (pushRouter)
 */
const updateData = async () => {
    count = count >= 5 ? 1 : (count + 1)
    const date = new Date().toISOString()

    const data = await OC_Service.getDataUpdates(date.substr(0, 10)) /* param: YYYY-MM-DD  | return: [queue, agentsOnline, report] */
    if (data.status !== 200) {
        errorHandling(data)
        const errorData = {
            status: data.status,
            message: data.message
        }
        app.emit('dataUpdates', errorData)
        return
    }

    const DataUpdate = {
        queue: processResponse(data[0], 'Queue'),
        agentsOnline: processResponse(data[1], 'AgentsOnline'),
        reportPBX: processResponse(data[2], 'ReportPBX'),
        reportEmail: processResponse(data[3], 'ReportEmail'),
        timeStamp: date.substr(11, 8),
        status: 200
    }
    Locals.Data = DataUpdate
    app.emit('dataUpdates', DataUpdate)
    const connectionsData = app.listenerCount('dataUpdates')
    const connectionsTeams = app.listenerCount('teamUpdates')
    /* console.log(`dataUpdates:    ${dataUpdate.timeStamp.substr(0,8)}   |     Listeners: ${connectionsData}`)
    console.log('d_______________________d') */
    Locals.Connections = { data: connectionsData, teams: connectionsTeams, time: date.substr(11, 8) }
    if (connectionsTeams !== connectionsData) {
        console.error('listener mismatch!!') /* mismatch can happen if connection done just comparison is done */
        console.log('team:', connectionsTeams)
        console.log('data', connectionsData)
    }
    if (app.listenerCount('teamInit') !== 0) { /* Browser stuck waiting for Locals.Teams data, prob unnecessary */
        console.log('TEAM INIT IS NOT ZERO')
        console.log('team init', app.listenerCount('teamInit'))
    }
}


/**
 * Funcion to update the "Teams" variable for "teamUpdates" datafeed in pushRouter
 * Done at server start then every 30min
 * Gets data from database endpoints /teams, /agents, /services, /profiles
 * 
 * Probably most resource intensive calculation for backend
 * @emits {Teams, Services} to /api/push/teamUpdates
 */
const updateTeams = async () => {

    const data = await OC_Service.getTeamUpdates() //return: [teams, agents, services, profiles]
    if (data.status !== 200) {
        errorHandling(data)
        setTimeout(updateTeams, 10000) // try again in 10 sec
        return
    }
    const Teams = processResponse(data[0], 'Teams') //has all TeamNames, used as base for "Locals.Teams"
    const Agents = processResponse(data[1], 'Agents') //has agent - team link
    Locals.Services = processResponse(data[2], 'Services') //Used with reports - needs to be stored
    const Profiles = processResponse(data[3], 'Profiles') //has agent <--> service link

    const TeamUpdates = {
        teams: formats.setTeams(Teams, Agents, Profiles),
        services: Locals.Services,
        timeStamp: new Date().toISOString().substr(11, 8),
        status: 200,
        serverVersion: SERVER_VERSION //if server version changes frontend will refresh
    }
    app.emit('teamUpdates', TeamUpdates) //sends teamUpdates datafeed and connected browsers (pushRouter)
    Locals.Teams = TeamUpdates
    console.log(`teamUpdates:    ${TeamUpdates.timeStamp.substr(0, 8)}   |     Listeners: ${app.listenerCount('teamUpdates')}`)
    console.log('_______________________')
}

const initializeServer = async () => {
    await updateTeams()
    await updateData() //sends version info to frontend, used to force frontend to refresh on update
}

/*if services are changed - report will include it in 4 sec but Services will take 1h - untested if it causes errors, prob not.
    same for Teams & AgentsOnline/Queue */
const main = () => {
    console.log(OC_PULL_INTERVAL)
    initializeServer()
    setInterval(updateData, OC_PULL_INTERVAL) // 2.5 sec - database updates every 5-6sec
    setInterval(updateTeams, 1800000) //30min
}

main()

module.exports = app
