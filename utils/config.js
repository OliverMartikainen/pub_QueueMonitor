require('dotenv').config()

const PORT = process.env.PORT
const REST_URI = process.env.REST_URI
const API_KEY = process.env.API_KEY
const OC_NAME = process.env.OC_NAME
//const SERVER_VERSION = process.env.npm_package_version // - package.json version - atm requires complete server restart
const SERVER_VERSION = '0.0.2' //this way npm run watch - forces frontend to update

module.exports = {
    PORT,
    REST_URI,
    API_KEY,
    OC_NAME,
    SERVER_VERSION
}