const pushRouter = require('express').Router()
const Locals = require('./locals')

pushRouter.get('/teamUpdates', async (request, response) => {
    console.log('connect teamUpdates:', request.ip)
    response.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })
    const teamUpdateListener = (data) => {
        response.write(`data: ${JSON.stringify( data )}\n\n`)
    }
    response.app.once('teamInit', teamUpdateListener) //on connect sends latest Team data
    response.app.emit('teamInit', Locals.Teams)

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
        response.write(`data: ${JSON.stringify( data )}\n\n`)
    }
    response.app.on('dataUpdates', dataUpdateListener)
    request.on('close', () => {
        response.app.removeListener('dataUpdates', dataUpdateListener)
        console.log('closed dataUpdate:', request.ip)
    })
})

module.exports = pushRouter


