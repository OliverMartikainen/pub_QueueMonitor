const Locals = require('../data/locals')
const dataRouter = require('express').Router()

/**
 * For frontend GET requests
 * <host url>/api/pull/<endpoint url>
 */


/**
 * Works, but not used
 */
dataRouter.get('/teams', async (request, response) => {
    response.json(Locals.Teams)
})

/**
 * @deprecated - works if AgentsOnline is stored to Locals.AgentsOnline
 */
dataRouter.get('/agentsonline', async (request, response) => { //
    response.json(Locals.AgentsOnline)
})

/**
 * @deprecated - works if Queue is stored to Locals.Queue
 */
dataRouter.get('/queue', async (request, response) => {
    response.json(Locals.Queue)
})

/**
 * @deprecated - works if InboundReport is stored to Locals.InboundReport
 */
dataRouter.get('/inboundreport', async (request, response) => {
    response.json(Locals.InboundReport)
})

/**
 * Will show errors in calls to database if any of requests fail.
 */
dataRouter.get('/errors', async (request, response) => {
    response.json(Locals.Errors)
})

/**
 * Used to check number of connections to backend server 
 */
dataRouter.get('/admin/connections', async (request, response) => {
    console.log('visited adming connect:',request.ip)
    response.json(Locals.Connections)
})

module.exports = dataRouter