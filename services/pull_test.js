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

const getInboundReport = (date) => localRead_test('InboundReport.json')
const getServices = () => localRead_test('Services.json')

const getAgentProfiles = () => localRead_test('AgentProfiles.json')

const getAgentsAll = () => localRead_test('Agents.json')

const getTeams = () => localRead_test('Teams.json')

const getGeneralQueue = () => {
        console.log(`API GET - Queue:           `)
        Locals.Queue = localRead_test('GeneralQueue.json')
 }

const getAgentsOnline = () => {
    console.log(`API GET - AgentsOnline:           `)
    Locals.Queue = localRead_test('AgentsOnline.json')
}

const getDataUpdates = (date) => {
    return ({
        status: 200,
        data: [getGeneralQueue(), getAgentsOnline(), getInboundReport(date)]
    })
}
const getTeamUpdates = () => {
    return ({
        status: 200,
        data: [getTeams(), getAgentsAll(), getServices(), getAgentProfiles()]
    })
}

module.exports = {
    getDataUpdates, getTeamUpdates
}