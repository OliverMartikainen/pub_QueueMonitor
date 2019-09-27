const pushRouter = require('express').Router()
const Locals = require('../data/locals')

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

    response.app.on('teamUpdates', teamUpdateListener) //subsribes to team updates
    request.on('close', () => {
        response.app.removeListener('teamUpdates', teamUpdateListener)
        console.log('closed teamUpdates:', request.ip)
    })
})

pushRouter.get('/dataUpdates', async (request, response) => {
    //implement middleware for request logging
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

    response.app.on('dataUpdates', dataUpdateListener)
    request.on('close', () => {
        response.app.removeListener('dataUpdates', dataUpdateListener)
        console.log('closed dataUpdate:', request.ip)
    })
})

module.exports = pushRouter


