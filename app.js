//check out express & body parser also cors
const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./controllers/pullers')
const pushRouter = require('./controllers/pushers')
const Locals = require('./controllers/locals')
const formats = require('./formats/databaseToLocal')

app.use(cors())
app.use('/api', pushRouter)
app.use(express.static('build'))

const update = async () => {
    await OC_Service.GetAgentsOnline()
    await OC_Service.GetGeneralQueue()
    console.log('_______________________')
    reportUpdater()
}

//does async work here too?
const initialize =  async () => {
    const GetServiceStatus = await OC_Service.GetServices() //returns respone status
    let Teams =  await OC_Service.GetTeams() //main group category
    let Agents =  await OC_Service.GetAgentsAll() //has agent - team link
    let Profiles =  await OC_Service.GetAgentProfiles() //has agent service link
    Locals.Teams = formats.setTeams(Teams, Agents, Profiles)
    if(GetServiceStatus !== 200) {
        console.log('GetService failed, status: ', GetServiceStatus)
    }
}

/*
    could add this data for each profile & team, but atm browser has much
    more extra processing power so will let it handle those calculations
    Format data to {ServiceName, ServiceId, ContactsPieces, ProcessedPieces}
    Browser then connects ServiceId of report and profiles
*/
const reportUpdater = async () => {
    const date = new Date().toISOString().substr(0,10) //YYYY-MM-DD
    let report = await OC_Service.GetInboundReport(date)
    Locals.InboundReport = formats.setInboundReport(report, Locals.Services)
}



//dev version restarts due to changes


setInterval(update, 4000)
initialize()
reportUpdater()

setInterval(initialize, 3600000) //1. per hour 1000*3600 = 3 600 000

module.exports = app
