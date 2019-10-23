require('dotenv').config()

const PORT = process.env.PORT
let REST_URI = process.env.REST_URI
let API_KEY = process.env.API_KEY
let OC_NAME = process.env.OC_NAME
//const SERVER_VERSION = process.env.npm_package_version // - package.json version - atm requires complete server restart
const SERVER_VERSION = '0.0.7' //this way npm run watch - forces frontend to update

if(process.env.NODE_ENV === 'test') {
    REST_URI = process.env.TEST_URI
    API_KEY = process.env.TEST_KEY
    OC_NAME = process.env.TEST_NAME
}


module.exports = {
    PORT,
    REST_URI,
    API_KEY,
    OC_NAME,
    SERVER_VERSION
}