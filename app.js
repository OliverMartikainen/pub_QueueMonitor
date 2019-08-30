//check out express & body parser also cors
const express = require('express')
const app = express()
const cors = require('cors')
const OC_Service = require('./controllers/pullers')
const pushRouter = require('./controllers/pushers')

app.use(cors())
app.use('/api', pushRouter)
/*
OC_Service.HelloWorld()
OC_Service.Teams()
OC_Service.Services()
OC_Service.GeneralQueue()
OC_Service.AgentsOnline()
OC_Service.AgentsAll()
*/

const update = () => {
    const agents = OC_Service.AgentsOnline()
    const queue = OC_Service.GeneralQueue()
    console.log('aa_______________________bb')
} 

setInterval(update, 4000)

module.exports = app
