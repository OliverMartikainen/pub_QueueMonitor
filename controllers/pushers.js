//where the frontend gets its data from
const Pullers = require('./pullers')
//Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld

//need to transform this to get the data, store it in memory and then give it away
const pushRouter = require('express').Router()
const fs = require('fs')


pushRouter.get('/teams', async (request, response) => {
    const teams = await Pullers.Teams()
    response.json(teams)
})

pushRouter.get('/agents', async (request, response) => {
    const agents = await Pullers.AgentsOnline()
    response.json(agents)
})

pushRouter.get('/queue', async (request, response) => {
    const queue = await Pullers.GeneralQueue()
    response.json(queue)
})

pushRouter.get('/services', async (request, response) => {
    const services = await Pullers.Services()
    response.json(services)
})


/*   
var teams
    fs.readFile('../localDB/db_teams.json', 'utf8', (err, data) => {
        if(err) {
            console.error(err, 'aa')
            return
        }
        teams = JSON.parse(data)
    })
    console.log({teams}, 'aa')
    */


module.exports = pushRouter


