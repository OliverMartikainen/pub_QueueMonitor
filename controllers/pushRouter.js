const pushRouter = require('express').Router()
const Locals = require('../data/locals')
const Logger = require('../utils/logger')

/** 
 * Uses SSE method to push data to frontend.
 * <host url>/api/push/<endpoint url>
 */


/**
 * Sends the Teams data used in frontends Options to choose filters for the dataUpdates data.
 * Updates every 30 minutes
 */
pushRouter.get('/teamUpdates', async (request, response) => {
    const timeoutWait = 40 * 60 * 1000 //makes client connection wait for 40 min - team updates done every 30 min
    response.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })

    const teamUpdateListener = (data) => {
        try {
            response.write(`data: ${JSON.stringify(data)}\n\n`)
        } catch (error) {
            Logger.errorLog('pushRouter teamUpdates', error)
        }
    }
    request.setTimeout(timeoutWait)
    if (Locals.Teams && Locals.Teams.length !== 0) { //prevents sending empty data on server start
        response.app.once('teamInit', teamUpdateListener) //on connect sends latest Team data
        response.app.emit('teamInit', Locals.Teams)
    }

    response.app.on('teamUpdates', teamUpdateListener) //subscribes to team updates
    request.on('close', () => {                         //removes listeners from closed connections
        response.app.removeListener('teamUpdates', teamUpdateListener)
    })



})


/**
 * Sends the Queue, AgentsOnline, and InboundReport data used in frontends active dasboard
 * Updates every ~3 seconds
 */
pushRouter.get('/dataUpdates', async (request, response) => {
    //implement middleware for request logging at some point
    Logger.newConnect(request)

    response.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })


    const dataUpdateListener = (data) => {
        try {
            response.write(`data: ${JSON.stringify(data)}\n\n`)
        } catch (error) {
            Logger.errorLog('pushRouter teamUpdates', error)
        }
    }

    if (Locals.Data && Locals.Data.length !== 0) { //prevents sending empty data on server start
        response.app.once('dataInit', dataUpdateListener) //on connect sends latest Team data
        response.app.emit('dataInit', Locals.Data)
    }

    response.app.on('dataUpdates', dataUpdateListener) //subscribes to data updates
    request.on('close', () => {                     //removes listeners from closed connections
        response.app.removeListener('dataUpdates', dataUpdateListener)

        Logger.closeConnect(request)
    })

})

module.exports = pushRouter


