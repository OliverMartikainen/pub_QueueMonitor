//where the frontend gets its data from
//traditional pull router - when frontend polls for data
//redundant atm - only teams and connections give info
const Locals = require('../data/locals')
const dataRouter = require('express').Router()

dataRouter.get('/teams', async (request, response) => {
    response.json(Locals.Teams)
})

dataRouter.get('/agentsonline', async (request, response) => {
    response.json(Locals.AgentsOnline)
})

dataRouter.get('/queue', async (request, response) => {
    response.json(Locals.Queue)
})


dataRouter.get('/inboundreport', async (request, response) => {
    response.json(Locals.InboundReport)
})

dataRouter.get('/errors', async (request, response) => {
    response.json(Locals.Errors)
})

dataRouter.get('/admin/connections', async (request, response) => {
    console.log('visited adming connect:',request.ip)
    response.json(Locals.Connections)
})


module.exports = dataRouter