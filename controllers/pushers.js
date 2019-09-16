//where the frontend gets its data from
const Locals = require('./locals')
//Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld

//need to transform this to get the data, store it in memory and then give it away
const pushRouter = require('express').Router()

pushRouter.get('/teams', async (request, response) => {
    response.json(Locals.Teams)
})

pushRouter.get('/agentsonline', async (request, response) => {

    response.json(Locals.AgentsOnline)
})

pushRouter.get('/queue', async (request, response) => {

    response.json(Locals.Queue)
})


pushRouter.get('/inboundreport', async (request, response) => {
    console.log('POST InboundReport')
    response.json(Locals.InboundReport)
})

pushRouter.get('/eventtest', async (request, response) => {
    console.log('Event test')
})

pushRouter.get('/errors', async (request, response) => {
    response.json(Locals.Errors)
})



module.exports = pushRouter


