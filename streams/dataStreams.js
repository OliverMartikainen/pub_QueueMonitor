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
 * 
 * Simple quick error logging. Dont really need anything more sophisticated.
 */
const errorHandling = (response) => {
    const type = response.type
    if (Locals.Errors[type].status === response.status) { //no change
        return
    }

    const date = new Date()
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()

    if (response.status !== 200) {
        Locals.Errors[type] = {
            status: response.status,
            code: response.code,
            message: response.message,
            date: dateString //last change in status
        }
        console.error(` - ERROR: ${type} - ${response.status} - ${response.message}`)
    } else {
        const msg = 'NOW OK'
        Locals.Errors[type] = {
            status: response.status,
            code: 'OK',
            message: msg,
            date: dateString //last change in status
        }
        console.error(` - ERROR: ${type} - ${response.status} - ${msg}`)
    }
}

/**
 * Function that sends "Queue", "AgentsOnline" and "InboundReport" data to frontend
 * Done at start then every 3-6 sec (database updates every 5-6 sec)
 * Only "InboundReport" is formatted before sent, "Queue" and "AgentsOnline" are sent in same format as recieved from database
 * 
 * @emits {Queue, AgentsOnline, ReportsPBX, ReportEmail} to /api/push/dataUpdates (pushRouter)
 */
const updateData = async (app) => {
    const date = new Date()
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()

    const data = await OC_Service.getDataUpdates(dateString.substr(0, 10)) /* param: YYYY-MM-DD  | return: [queue, agentsOnline, report] */
    if (data.status !== 200) {
        errorHandling(data)
        const errorData = {
            status: data.status,
            message: data.message
        }
        app.emit('dataUpdates', errorData)
        return
    } else if (Locals.Errors['Data'].status !== 200) {
        //previously was in error, now is ok
        errorHandling(data)
    }
    const [resQueueData, resAgentsOnline, resReportPBX, resReportEmail] = data

    const DataUpdate = {
        queue: resQueueData.data,
        agentsOnline: resAgentsOnline.data,
        reportPBX: formats.setInboundReport(resReportPBX.data, Locals.Teams.services),
        reportEmail: formats.setInboundReport(resReportEmail.data, Locals.Teams.services),
        timeStamp: dateString.substr(11, 8),
        status: 200
    }

    Locals.Data = DataUpdate
    app.emit('dataUpdates', DataUpdate)
    const connectionsData = app.listenerCount('dataUpdates')
    const connectionsTeams = app.listenerCount('teamUpdates')
    let connectionsHighscore = Locals.Connections.highscore

    if (connectionsHighscore < connectionsData) {
        connectionsHighscore = connectionsData
        console.log(' - NEW HIGHSCORE: ', connectionsHighscore)
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
    } else if (Locals.Errors['Teams'].status !== 200) {
        //previously was in error, now is ok
        errorHandling(data)
    }
    const [resTeams, resAgents, resServices, resProfiles] = data

    const Teams = resTeams.data //has all TeamNames, used as base for "Locals.Teams"
    const Agents = resAgents.data //has agent - team link
    const Services = resServices.data //Used with reports - needs to be stored
    const Profiles = resProfiles.data //has agent <--> service link

    const date = new Date()
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()

    const TeamUpdates = {
        teams: formats.setTeams(Teams, Agents, Profiles),
        timeStamp: dateString.substr(11, 8),
        services: Services,
        status: 200,
        serverVersion: SERVER_VERSION //if server version changes frontend will refresh
    }

    app.emit('teamUpdates', TeamUpdates) //sends teamUpdates datafeed and connected browsers (pushRouter)
    Locals.Teams = TeamUpdates
    console.log(`| OC_SERVICE FETCH: teamUpdates - Length: ${Teams.length} | Status: ${data.status} | Listeners: ${app.listenerCount('teamUpdates')}`)

}

module.exports = {
    updateTeams, updateData
}