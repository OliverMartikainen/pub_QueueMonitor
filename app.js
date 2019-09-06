//check out express & body parser also cors
const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./controllers/pullers')
const pushRouter = require('./controllers/pushers')

app.use(cors())
app.use('/api', pushRouter)
app.use(express.static('build'))

const update = async () => {
    await OC_Service.GetAgentsOnline()
    await OC_Service.GetGeneralQueue()
    console.log('_______________________')
}

//does async work here too?
const initialize = async () => {
    var Teams = await OC_Service.GetTeams() //main group category
    var Agents = await OC_Service.GetAgentsAll() //has agent - team link
    var Profiles = await OC_Service.GetAgentProfiles() //has agent service link
    if (Agents.length != Profiles.length) {
        console.log('Agents count mismatch', Agents.length, Profiles.length)
    }

    //each profile has {TeamName, AgentId, AgentName, ServiceIds[]}
    Profiles.forEach(profile => {
        agent = Agents.find(agent => agent.AgentId === profile.AgentId)
        profile.TeamName = agent.TeamName
        profile.ServiceIds = profile.Profiles.map(list => list.ServiceId) //list used to filter queue
        profile.AgentName = `${agent.LastName} ${agent.FirstName}` //name used in options
        delete profile.Profiles
    })

    const teamServices = (profiles) => {
        var allServices = []
        profiles.forEach(profile => allServices = [...allServices, ...profile.ServiceIds])
        return allServices.filter((item, index) => allServices.indexOf(item) === index) //removes duplicates - indexOf returns first item, if index is different == duplicate
    }

    //Each team has {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
    Teams.forEach((team, index) => {
        team.Profiles = Profiles.filter(profile => profile.TeamName === team.TeamName)
        teamProfile = {
            TeamName: team.TeamName,
            AgentId: index, //Could cause issues if database has same agentid - shouldnt though 
            AgentName: 'ALL',
            ServiceIds: teamServices(team.Profiles) //all teams services in one profile
        }
        team.Profiles.push(teamProfile)
    })

    OC_Service.SetTeams(Teams)

    //this begins to be the moment tests begin to be useful - Seems to work fine
    //console.log(Teams[0].Profiles[0])
}


//dev version restarts due to changes

setInterval(update, 4000)
initialize()
setInterval(initialize, 3600000) //1. per hour 1000*3600 = 3 600 000

module.exports = app
