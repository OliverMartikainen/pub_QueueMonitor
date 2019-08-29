const config = require('../utils/config')
const REST_URI = config.REST_URI
const API_KEY = config.API_KEY
const OC_NAME = config.OC_NAME
const axios = require('axios')
const fs = require('fs')

//reconsider names later - service?
//can consider testing if Agents return same numb of agents as agentonlinestate


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

const updateLocalDB = (response, dataType) => { //maybe not needed
    console.log(`API GET - ${dataType}:`, response.data.length, response.status, response.statusText)
    const jsonItem = responseFormat(response, dataType)

}

//still need to check for STATUS != 200
const localStore_test = (file, response, dataType) => {
    console.log(`API GET - ${dataType}:`, response.data.length, response.status, response.statusText)
    const jsonItem = responseFormat(response, dataType)
    fs.writeFile(file, JSON.stringify(jsonItem, null, 4), (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`Stored to ${file}`)
    })
}

//get once per day
const Teams = () => axios(reqConfig('teams'))    //used to update db_teams once per day
    .then(response => {
        console.log(`API GET - teams:`, response.data.length, response.status, response.statusText)
        return response.data
        //localStore_test('../localDB/db_teams_api.json', response, 'teams')
    })

const Services = () => axios(reqConfig('services'))
    .then(response => {
        console.log(`API GET - services:`, response.data.length, response.status, response.statusText)
        return response.data
        //localStore_test('../localDB/db_services.json', response, 'services')
    })

const AgentsAll = () => axios(reqConfig('agents'))
    .then(response => {
        localStore_test('../localDB/db_agents_all.json', response, 'agents_all')
    })


//get every 6s - seems like real time
const GeneralQueue = () => axios(reqConfig('generalqueue'))
    .then(response => {
        console.log(`API GET - queueu:`, response.data.length, response.status, response.statusText)
        return response.data
        //localStore_test('../localDB/db_queue.json', response, 'queue')
    })

const AgentsOnline = async () => axios(reqConfig('agentonlinestate'))
    .then(response => {
        console.log(`API GET - agents:`, response.data.length, response.status, response.statusText)
        return response.data
        //localStore_test('../localDB/db_agents_online.json', response, 'agents')
    })


//connection test

const HelloWorld = () => axios(reqConfig('helloworld'))
    .then(response => {
        localStore_test('../localDB/db_hello.json', response, 'hello')
    })

module.exports = {
    Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld
}
