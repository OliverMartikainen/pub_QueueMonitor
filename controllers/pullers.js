const config = require('../utils/config')
const REST_URI = config.REST_URI
const API_KEY = config.API_KEY
const OC_NAME = config.OC_NAME
const axios = require('axios')
const fs = require('fs')

//reconsider names later - service?
var AgentsOnline  // same as API AgentsOnline
var Queue //same as API GeneralQueue
var Teams //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}

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

//use these 3 to form filters - by team and by agent - check that Profiles == AgentsAll length
const GetAgentProfiles = () => axios(reqConfig('agentprofiles'))
    .then(response => {
        console.log(`API GET - Profiles:`, response.data.length, response.status, response.statusText)
        return response.data
    })

    //get the team of agents
const GetAgentsAll = () => axios(reqConfig('agents'))
    .then(response => {
        console.log(`API GET - Agents:`, response.data.length, response.status, response.statusText)
        return response.data
    })

    //Top level group
const GetTeams = () => axios(reqConfig('teams'))
    .then(response => {
        console.log(`API GET - Teams:`, response.data.length, response.status, response.statusText)
        return response.data
    })

const GetGeneralQueue = () => axios(reqConfig('generalqueue'))
    .then(response => {
        Queue = response.data
        console.log(`API GET - Queue:           `, response.headers.date, response.data.length, response.status, response.statusText)
        return response.status
    })

const GetAgentsOnline = () => axios(reqConfig('agentonlinestate'))
    .then(response => {
        console.log(`API GET - AgentsOnline:    `, response.headers.date, response.data.length, response.status, response.statusText)
        AgentsOnline = response.data
        return response.status
    })

    //how do i get rid of these, exporting the var just gives undefined
const SendAgentsOnline = () => AgentsOnline
const SendQueue = () => Queue
const SendTeams = () => Teams

const SetTeams = (teams) => Teams = teams

const HelloWorld = () => axios(reqConfig('helloworld'))
    .then(response => {
        localStore_test('../localDB/db_hello.json', response, 'hello')
    })

module.exports = {
    GetAgentProfiles, GetTeams, GetGeneralQueue, GetAgentsOnline, GetAgentsAll, SendAgentsOnline, SendQueue, SendTeams, SetTeams
}
