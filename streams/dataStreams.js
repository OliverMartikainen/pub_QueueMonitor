const Locals = require('../data/locals')
const formats = require('../formats/databaseToLocal')
const OC_Service = require('../services/OC_Service') /* Database Serivce*/
const config = require('../utils/config')
const SERVER_VERSION = config.SERVER_VERSION /*Used to force connected browsers to update */

/**
 * Sets error status given to frontend & handles error logging.
 * Logs only on 1st encountered error
 * 
 * 503 if frontend to backend problem
 * 502 if backend to database problem (backend will send 'Database Error' as response)
 * 500 for all unknowns
 */
const errorHandling = (response) => {
    const type = response.type
    if (Locals.Errors[type].status === 502) {
        return
    }
    let date = new Date()
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()
    response.date = date
    Locals.Errors[type] = response
    console.error(date, ` - ERROR: ${type} - ${response.status} - ${response.message}`)
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
const updateData = async (app) => {
    let date = new Date()
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()

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
    let connectionsHighscore = Locals.Connections.highscore

    if (connectionsHighscore < connectionsData) {
        connectionsHighscore = connectionsData
        console.log(date, ' - NEW HIGHSCORE: ', connectionsHighscore)
    }
    Locals.Connections = { data: connectionsData, teams: connectionsTeams, highscore: connectionsHighscore, time: date }
}


/**
 * Funcion to update the "Teams" variable for "teamUpdates" datafeed in pushRouter
 * Done at server start then every 30min
 * Gets data from database endpoints /teams, /agents, /services, /profiles
 * 
 * Probably most resource intensive calculation for backend
 * @emits {Teams, Services} to /api/push/teamUpdates
 */
const updateTeams = async (app) => {

    const data = await OC_Service.getTeamUpdates() //return: [teams, agents, services, profiles]
    if (data.status !== 200) {
        errorHandling(data)
        setTimeout(() => updateTeams(app), 30 * 1000) // try again in 30 sec
        return
    }
    const Teams = processResponse(data[0], 'Teams') //has all TeamNames, used as base for "Locals.Teams"
    const Agents = processResponse(data[1], 'Agents') //has agent - team link
    Locals.Services = processResponse(data[2], 'Services') //Used with reports - needs to be stored
    const Profiles = processResponse(data[3], 'Profiles') //has agent <--> service link

    let date = new Date()
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()

    const TeamUpdates = {
        teams: formats.setTeams(Teams, Agents, Profiles),
        services: Locals.Services,
        timeStamp: date.substr(11, 8),
        status: 200,
        serverVersion: SERVER_VERSION //if server version changes frontend will refresh
    }
    app.emit('teamUpdates', TeamUpdates) //sends teamUpdates datafeed and connected browsers (pushRouter)
    Locals.Teams = TeamUpdates

    console.log(date, ` | OC_SERVICE FETCH: teamUpdates - Length: ${Teams.length} | Status: ${data.status} | Listeners: ${app.listenerCount('teamUpdates')}`)

}

module.exports = {
    updateTeams, updateData
}