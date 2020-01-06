require('dotenv').config()

let PORT = process.env.PORT || 3001
let REST_URI = process.env.REST_URI
let API_KEY = process.env.API_KEY
let OC_NAME = process.env.OC_NAME
const MODE = process.env.NODE_ENV

const OC_PULL_INTERVAL = process.env.OC_PULL_INTERVAL

//const SERVER_VERSION = process.env.npm_package_version // - package.json version - atm requires complete server restart
const SERVER_VERSION = '0.0.9' //this way npm run watch - forces frontend to update

if(MODE === 'test') {
    REST_URI = process.env.TEST_URI
    API_KEY = 'TestKey'
    OC_NAME = 'TestName'
    PORT = process.env.TEST_PORT || PORT
    console.log('Connecting to TestDatabase in', REST_URI)
}


module.exports = {
    PORT,
    REST_URI,
    API_KEY,
    OC_NAME,
    MODE,
    SERVER_VERSION,
    OC_PULL_INTERVAL
}