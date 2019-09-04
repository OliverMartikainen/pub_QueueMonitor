//where the frontend gets its data from
const Pullers = require('./pullers')
//Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld

//need to transform this to get the data, store it in memory and then give it away
const pushRouter = require('express').Router()
const fs = require('fs')


pushRouter.get('/teams', async (request, response) => {
    response.json(Pullers.SendTeams())
})

pushRouter.get('/agents', async (request, response) => {
    response.json(Pullers.SendAgentsOnline())
})

pushRouter.get('/queue', async (request, response) => {
    response.json(Pullers.SendQueue())
})



module.exports = pushRouter


