const config = require('../utils/config')
const REST_URI = config.REST_URI
const API_KEY = config.API_KEY
const OC_NAME = config.OC_NAME
const axios = require('axios')
const fs = require('fs')

//reconsider names later - service?

const reqConfig = (URL) => {            //returns JSON for request configuration
    return {
        method: 'POST',
        baseURL: REST_URI,
        url: URL,                  //determines what is requested
        headers: { 'ApiKey': API_KEY },
        data: { 'OcName': OC_NAME }
    }
}

const responseFormat = (response, dataType) => {
    const temp = {
        count: response.data.length,
        status: response.status,
        text: response.statusText,
        date: response.headers.date
    }
    temp[dataType] = response.data
    return temp
}

//still need to check for STATUS != 200
const localStore_test = (file, response, dataType) => {
    console.log(`API GET TO STORE - ${dataType}:`, response.data.length, response.status, response.statusText)
    const jsonItem = responseFormat(response, dataType)
    fs.writeFile(file, JSON.stringify(jsonItem, null, 4), (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`Stored to ${file}`)
    })
}

//date in form YYYY-MM-DD
const getInboundReport = (date) => axios({
    method: 'POST',
    baseURL: REST_URI,
    url: 'inboundreport',
    headers: { 'ApiKey': API_KEY },
    data: {
        'OcName': OC_NAME,
        'ServiceGroupId': '-1',
        'ServiceId': '-1',
        'TeamId': '',
        'AgentId': '-1',
        'StartDate': `${date}T00:00:00`,
        'EndDate': `${date}T23:59:59`,
        'ContactTypes': 'PBX, EMAIL',
        'contactReportType': 'Service',
        'ServiceLevelTime': '20',
        'UseServiceTime': 'false'
    }
})


const getServices = () => axios(reqConfig('services'))


//use these 3 to form filters - by team and by agent - check that Profiles == AgentsAll length
const getAgentProfiles = () => axios(reqConfig('agentprofiles'))

//get the team of agents
const getAgentsAll = () => axios(reqConfig('agents'))

//Top level group
const getTeams = () => axios(reqConfig('teams'))

const getGeneralQueue = () => axios(reqConfig('generalqueue'))

const getAgentsOnline = () => axios(reqConfig('agentonlinestate'))


const getDataUpdates = (date) => 
    axios.all([getGeneralQueue(), getAgentsOnline(), getInboundReport(date)])
    .then(response => {
        response.status = 200
        return response
    })
    .catch(error => {
        return {type: 'Data', status: 502, code: error.code, message: 'database connection error - failed getDataUpdates'}
    })
const getTeamUpdates = () => 
    axios.all([getTeams(), getAgentsAll(), getServices(), getAgentProfiles()])
    .then(response => {
        response.status = 200
        return response
    })
    .catch(error => {
        return {type: 'Teams', status: 502, code: error.code, message: 'database connection error - failed getTeamUpdates'}
    })
    

module.exports = {
    getDataUpdates, getTeamUpdates
}
