require('dotenv').config()

const PORT = process.env.PORT
let REST_URI = process.env.REST_URI


module.exports = {
    PORT,
    REST_URI
}

/*
express https://fullstackopen.com/en/part3/node_js_and_express

nodemon (same) - better dev workflow (browser auto reload)


cors - middleware for cross origin resource sharing
dotenv - .env environmental variable file handling DONE
eslint - style/uniform code

PART 4
jest - testing library
cross-env - different env modes (eg test, dev, prod)
supertest - more test 

bcrypt - good pw hasher
jsonwebtoken - token part once user/login implementation
*/
