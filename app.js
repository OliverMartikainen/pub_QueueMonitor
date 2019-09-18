//check out express & body parser also cors
const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./services/OC_Service')
const pushRouter = require('./controllers/pushRouter')
const dataRouter = require('./controllers/dataRouter')
const Locals = require('./controllers/locals')
const formats = require('./formats/databaseToLocal')

app.use(cors())
app.use('/api/push', pushRouter)
app.use('/api/pull', dataRouter)
app.use(express.static('build'))
app.setMaxListeners(100) //small scale testing suggests every connected/active browser counts as 1 listener, still need to find performance cost of listeners

Locals.Errors = { Data: {}, Teams: {} } //needs to be initialized for error handling atm

//redundant atm
const errorHandling = (response) => { //handles error reporting - could add logging - atm deals only with database connection issues
    const type = response.type
    if (Locals.Errors[type].status !== 502) {
        response.date = new Date().toISOString()
        Locals.Errors[type] = response
        return
    }
    console.log(`Continues ${response.message}`)
}

const processResponse = (response, type) => { //could use hasProperty to indentify
    //if status not 200 write in log?
    const result = `${response.status}  ${response.statusText}  ${response.data.length}     ${type}     ${response.headers.date}`
    console.log('   ', result)
    if (type === 'Report') {
        return formats.setInboundReport(response.data, Locals.Services)
    }
    return response.data
}

const updateData = async () => {
    const date = new Date().toISOString()
    const data = await OC_Service.getDataUpdates(date.substr(0, 10)) // date //YYYY-MM-DD [queue, agentsOnline, report]
    if (data.status !== 200) {
        errorHandling(data)
        return
    }
    //if scaling needed in future implement caching for shared data over instances
    const dataUpdate = {
        queue: processResponse(data[0], 'Queue'),
        agentsOnline: processResponse(data[1], 'AgentsOnline'),
        report: processResponse(data[2], 'Report'),
        timeStamp: date.substr(11)
    }
    app.emit('dataUpdates', dataUpdate)
    const connectionsData = app.listenerCount('dataUpdates')
    const connectionsTeams = app.listenerCount('teamUpdates')
    console.log(`dataUpdates:    ${dataUpdate.timeStamp.substr(0,8)}   |     Listeners: ${connectionsData}`)
    console.log('d_______________________d')
    Locals.Connections = {data: connectionsData, teams: connectionsTeams, time: date.substr(11,8)}
    if(connectionsTeams !== connectionsData) {
        console.error('listener mismatch!!') //mismatch can happen if conenction done just comparison is done
        console.log('team:', connectionsTeams)
        console.log('data',connectionsData)
    }
    if(app.listenerCount('teamInit') !== 0) {
        console.log('TEAM INIT IS NOT ZERO')
        console.log('team init',app.listenerCount('teamInit'))
    }
}

const updateTeams = async () => { //probably most resource intensive calculation
    const data = await OC_Service.getTeamUpdates() //[teams, AgentsAll, services, profiles]
    if (data.status !== 200) {
        errorHandling(data)
        setTimeout(updateTeams, 10000) // try again in 10 sec
        return
    }
    let Teams = processResponse(data[0], 'Teams') //main group category
    let Agents = processResponse(data[1], 'Agents') //has agent - team link
    Locals.Services = processResponse(data[2], 'Services') //Used with reports - needs to be stored
    let Profiles = processResponse(data[3], 'Profiles') //has agent service link
    const teamUpdates = {
        teams: formats.setTeams(Teams, Agents, Profiles),
        timeStamp: new Date().toISOString().substr(11)
    }
    Locals.Teams = teamUpdates
    app.emit('teamUpdates', teamUpdates)
    console.log(`teamUpdates:    ${teamUpdates.timeStamp.substr(0,8)}   |     Listeners: ${app.listenerCount('teamUpdates')}`)
    console.log('t_______________________t')
}

//does async do anything here?
const initialize = async () => {
    await updateTeams()
    await updateData()
}


//if services are changed - report will include it in 4 sec but Services will take 1h - test if it causes errors - shouldnt
//same for Teams & AgentsOnline/Queue
const main = () => {
    initialize()
    setInterval(updateData, 3000) // 3 sec - database updates every 5-6sec
    setInterval(updateTeams, 3600000) //1h - 3600000 - only change if user changes are done in OC
}


main()

module.exports = app
