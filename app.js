//check out express & body parser also cors
const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./services/OC_Service')
const pushRouter = require('./controllers/pushers')
const Locals = require('./controllers/locals')
const formats = require('./formats/databaseToLocal')

app.use(cors())
app.use('/api', pushRouter)
app.use(express.static('build'))

Locals.Errors = {Data: {}, Teams: {}} //needs to be initialized for error handling atm


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
    const date = new Date().toISOString().substr(0, 10) //YYYY-MM-DD
    const data = await OC_Service.getDataUpdates(date) // [queue, agentsOnline, report]
    if (data.status !== 200) {
        errorHandling(data)
        return
    }
    Locals.Queue = processResponse(data[0], 'Queue')
    Locals.AgentsOnline = processResponse(data[1], 'AgentsOnline')
    Locals.Report = processResponse(data[2], 'Report')
    Locals.Errors.Data = { status: 200, code: 'OK', message: 'OK' }
    console.log('_______________________')
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
    Locals.Teams = formats.setTeams(Teams, Agents, Profiles)
    Locals.Errors.Teams = { status: 200, code: 'OK', message: 'OK' }
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
    setInterval(updateData, 4000) // 4 sec - database updates every 5-6sec
    setInterval(updateTeams, 3600000) //1h - only change if user changes are done in OC
}



main()

module.exports = app
