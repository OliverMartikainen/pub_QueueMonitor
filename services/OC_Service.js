const config = require('../utils/config')
const REST_URI = config.REST_URI
const API_KEY = config.API_KEY
const OC_NAME = config.OC_NAME
const axios = require('axios')

/**
 * See OC database REST API for endpoints
 */

const reqConfig = (URL) => { //returns JSON for request configuration
    return {
        method: 'POST',
        baseURL: REST_URI,
        url: URL,                  //determines endpoint
        headers: { 'ApiKey': API_KEY },
        data: { 'OcName': OC_NAME }
    }
}

//date in form YYYY-MM-DD
const getInboundReport = (date, type) => axios({
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
        'ContactTypes': type,
        'contactReportType': 'Service',
        'ServiceLevelTime': '20',
        'UseServiceTime': 'false'
    }
}).then((response) => {
    response.type = type
    response.date = date
    return response
})

const getInboundReportTeam = async (date, type, team) => {
    try {
        const res = await axios({
            method: 'POST',
            baseURL: REST_URI,
            url: 'inboundreport',
            headers: { 'ApiKey': API_KEY },
            data: {
                'OcName': OC_NAME,
                'ServiceGroupId': '-1',
                'ServiceId': '-1',
                'TeamId': team,
                'AgentId': '-1',
                'StartDate': `${date}T00:00:00`,
                'EndDate': `${date}T23:59:59`,
                'ContactTypes': type,
                'contactReportType': 'Service',
                'ServiceLevelTime': '20',
                'UseServiceTime': 'false'
            }
        })

        return {
            status: res.status,
            data: res.data,
            TeamName: team,
            type,
            date
        }
    } catch (error) {
        return {
            status: error.status,
            data: [],
            TeamName: team,
            type,
            date
        }
    }

}


//for connection ServiceIds to ServiceNames in InboundReport
const getServices = () => axios(reqConfig('services'))
//use these 3 to form filters in frontend (to filter queues and AgentsOnline) - by team && agent - check that Profiles == Agents length
const getAgentProfiles = () => axios(reqConfig('agentprofiles'))
//get the team of agents
const getAgents = () => axios(reqConfig('agents'))
const getTeams = () => axios(reqConfig('teams'))


const getGeneralQueue = () => axios(reqConfig('generalqueue'))
const getAgentsOnline = () => axios(reqConfig('agentonlinestate'))


const getDataUpdates = (date) => axios.all([
    getGeneralQueue(),
    getAgentsOnline(),
    getInboundReport(date, 'PBX'),
    getInboundReport(date, 'email')
]).then(responseArr => {
    const [resQueueData, resAgentsOnline, resReportPBX, resReportEmail] = responseArr
    /* naive assumption that if no error --> all responses status === 200
        Hasnt really caused any problems in 1 year, will let it be. */
    return {
        type: 'Data',
        status: 200,
        code: 'OK',
        message: 'ALL OK',
        queue: resQueueData.data,
        agentsOnline: resAgentsOnline.data,
        reportPBX: resReportPBX.data,
        reportEmail: resReportEmail.data
    }
}).catch(error => {
    return { type: 'Data', status: 502, code: error.code, message: 'database connection error - failed getDataUpdates' }
})

const getTeamUpdates = () => axios.all([
    getTeams(),
    getAgents(),
    getServices(),
    getAgentProfiles()
]).then(responseArr => {
    /* naive assumption that if no error --> all responses status === 200
    Hasnt really caused any problems in 1 year, will let it be. */
    const [resTeams, resAgents, resServices, resProfiles] = responseArr

    return {
        type: 'Teams',
        status: 200,
        code: 'OK',
        message: 'ALL OK',
        Teams: resTeams.data,
        Agents: resAgents.data,
        Services: resServices.data,
        Profiles: resProfiles.data
    }
}).catch(error => {
    return { type: 'Teams', status: 502, code: error.code, message: 'database connection error - failed getTeamUpdates' }
})

module.exports = {
    getDataUpdates, getTeamUpdates, getInboundReportTeam
}
