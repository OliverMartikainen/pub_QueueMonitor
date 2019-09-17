//where the frontend gets its data from
const Locals = require('./locals')
//Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld


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

pushRouter.get('/eventtest', (request, res) => {
    console.log(request.ip) // a way to record all unique connections - middleware to process all requests and log all unique
    res.status(200).set({
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
    })

    //still need someway to emit data when i want to... 
    
    const data = 'hello world!'
    setInterval(() => {
        data.timestamp = new Date().toISOString().substr(11,)
        res.write('data: ' + JSON.stringify({ data }) + '\n\n')

    }, 10000)
})

pushRouter.get('/errors', async (request, response) => {
    response.json(Locals.Errors)
})



module.exports = pushRouter


