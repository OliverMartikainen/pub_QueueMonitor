const pushRouter = require('express').Router()
const Locals = require('../data/locals')

/** 
 * Uses SSE method to push data to frontend.
 * <host url>/api/push/<endpoint url>
 */


/**
 * Sends the Teams data used in frontends Options to choose filters for the dataUpdates data.
 * Updates every 30 minutes
 */
pushRouter.get('/teamUpdates', async (request, response) => {
    console.log('connect teamUpdates:', request.ip)
    const timeoutWait = 31 * 60 * 1000 //makes client connection wait for 31 min - team updates done every 30 min
    response.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })
    const teamUpdateListener = (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`)
    }
    request.setTimeout(timeoutWait)
    if (Locals.Teams && Locals.Teams.length !== 0) { //prevents sending empty data on server start
        response.app.once('teamInit', teamUpdateListener) //on connect sends latest Team data
        response.app.emit('teamInit', Locals.Teams)
    }

    response.app.on('teamUpdates', teamUpdateListener) //subscribes to team updates
    request.on('close', () => {                         //removes listeners from closed connections
        response.app.removeListener('teamUpdates', teamUpdateListener)
        console.log('closed teamUpdates:', request.ip)
    })
})


/**
 * Sends the Queue, AgentsOnline, and InboundReport data used in frontends active dasboard
 * Updates every ~3 seconds
 */
pushRouter.get('/dataUpdates', async (request, response) => {
    //implement middleware for request logging at some point
    console.log('connect dataUpdates:', request.ip)
    response.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })
    const dataUpdateListener = (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`)
    }
    if (Locals.Data && Locals.Data.length !== 0) { //prevents sending empty data on server start
        response.app.once('dataInit', dataUpdateListener) //on connect sends latest Team data
        response.app.emit('dataInit', Locals.Data)
    }

    response.app.on('dataUpdates', dataUpdateListener) //subscribes to data updates
    request.on('close', () => {                     //removes listeners from closed connections
        response.app.removeListener('dataUpdates', dataUpdateListener)
        console.log('closed dataUpdate:', request.ip)
    })
})

module.exports = pushRouter


