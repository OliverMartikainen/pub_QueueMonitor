const Locals = require('../data/locals')
const dataRouter = require('express').Router()

/**
 * For frontend GET requests
 * <host url>/api/pull/<endpoint url>
 */

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
    console.log(' - ADMIN VISIT - ip: ', request.ip)
    response.json(Locals.Connections)
})

module.exports = dataRouter