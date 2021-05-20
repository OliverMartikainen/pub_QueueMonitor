const serverVersion = require('../utils/config').SERVER_VERSION
/**
 * Used to store slowly updated data, eg "Teams" and "Services" at the moment.
 * If app was scaled this should be replaced with something more elaborate.
 */
const Locals = {
    Teams: {
        teams: [],
        services: [],
        teamServicesIndex: {},
        timeStamp: '0',
        status: 200,
        serverVersion: serverVersion //if server version changes frontend will refresh
    },  //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
    Errors: {
        Data: {
            status: 200,
            code: '',
            message: '',
            date: '0' //last change in status
        },
        Teams: {
            status: 200,
            code: '',
            message: '',
            date: '0' //last change in status
        }
    }, //backend can report database or other errors to frontend
    Connections: {
        data: 0,
        teams: 0,
        highscore: 0,
        time: null
    },
    Data: { //updated in dataStreams.js
        queue: [],
        agentsOnline: [],
        reportPBX: [],
        reportEmail: [],
        timeStamp: '0',
        status: 200
    }
}

module.exports = Locals