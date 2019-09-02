//where the frontend gets its data from
const Pullers = require('./pullers')
//Teams, Services, AgentsAll, AgentsOnline, GeneralQueue, HelloWorld

//need to transform this to get the data, store it in memory and then give it away
const pushRouter = require('express').Router()
const fs = require('fs')


pushRouter.get('/teams', async (request, response) => {
    fs.readFile('./public/data/db_teams_plain.json', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        response.json(JSON.parse(data).teams)
    })
})

pushRouter.get('/agents', async (request, response) => {
    response.json(Pullers.GetAgents())
})

pushRouter.get('/queue', async (request, response) => {
    response.json(Pullers.GetQueue())
})

pushRouter.get('/services', async (request, response) => {
    fs.readFile('./public/data/db_services.json', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        response.json(JSON.parse(data).services)
    })
})

//atm no readl id so do that
pushRouter.put('/teams/:id', async (request, response) => {
    const updateTeams = (teams, id) => {
        
        //fs.writeFile - replace entire file with new or find an update method
    }

    fs.readFile('./public/data/db_teams.json', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const teams = JSON.parse(data)



    })



})

module.exports = pushRouter


