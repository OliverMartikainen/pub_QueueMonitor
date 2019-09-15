const fs = require('fs')
const Locals = require('../controllers/locals')

const localRead_test = async (file) => {
    await fs.readFile(`./test_data/${file}`, (err, data) => {
        if(err) {
            console.error(err)
        }
        return data
    })
}

const GetServices = () => localRead_test('Services.json')


//use these 3 to form filters - by team and by agent - check that Profiles == AgentsAll length
const GetAgentProfiles = () => localRead_test('AgentProfiles.json')

//get the team of agents
const GetAgentsAll = () => localRead_test('Agents.json')

//Top level group
const GetTeams = () => localRead_test('Teams.json')

const GetGeneralQueue = () => {
        console.log(`API GET - Queue:           `)
        Locals.Queue = localRead_test('GeneralQueue.json')
 }

const GetAgentsOnline = () => {
    console.log(`API GET - AgentsOnline:           `)
    Locals.Queue = localRead_test('AgentsOnline.json')
}

const GetInboundReport = (date) => {


    console.log(`API GET - Report:`)
    return localRead_test('InboundReport.json')
}

module.exports = {
    GetInboundReport, GetAgentProfiles, GetTeams, GetGeneralQueue, GetAgentsOnline, GetAgentsAll, GetServices
}