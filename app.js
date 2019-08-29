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


module.exports = app
