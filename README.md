29.11.2019


# QueueMonitor

## About

Queue Monitor is a fullstack project that is deployed as a dashboard for support center teams.
It is used to show the support teams:
- Staff status and availability (referred to as `agents`)
support center queue monitor
- Incoming email and call `queue`'s

Repositories:
 * The **Frontend** is made with React.js and can be found in [here](https://github.com/OliverMartikainen/pub_QueueMonitor_Frontend).
 * The **Backend** is made with Node.js and is in this repository together with a build of the frontend.
 * The project uses an external service providers **Database** for the dashboards items, which is not available for the public version.
 * The public version uses a test **Database** to showcase the different elements of the dashboard, found [here](https://github.com/OliverMartikainen/pub_QueueMonitor_testDatabase).


## Worklog

Project worklog available [here](https://github.com/OliverMartikainen/priv_QueueMonitor_Worklog) (private repository)

---

## Requirements

To run this project you need
- [Node.js](https://nodejs.org/en/)
- npm - comes with Node
- This repository - contains **Backend** and a build version of **Frontend**
- [TestDatabase](https://github.com/OliverMartikainen/pub_QueueMonitor_testDatabase) repository
- Chrome or Firefox browser (Edge and IE not supported)

## How to use

1. Run command `npm install` in both repository root folders to install all of their dependancies.
2. To use with TestDatabase add an .env file to **Backend** repository root and insert the following text in it:
        `TEST_URI=http://localhost:3050
        TEST_PORT=3010`
3. In **TestDatabase** root run command `npm start` to start the **TestDatabase** server
    - If started successfully should display:
        `Test database server running from port 3010`
4. In **Backend** (this repos) root run command `npm run showcase` to start the QueueMonitor server and connect it to the **TestDatabase**
    - If started successfully should display:
        `Connecting to TestDatabase in http://localhost:3050
        Server version <server version number> running from port 3010
        teamUpdates:    <timestamp of data>   |     Listeners: 0
        _______________________`
5. In a **Google Chrome** or **Mozilla Firefox** browser navigate to `http://localhost:3010`
    - Must on the computer the servers are running on.
    

---

# Backend Documentation

The Backend does not use any authentication with frontend due to expected use case and hosting location. The backend does not read any data from the frontend, it only sends.

The Backend does authenticate with the actual Database, however the TestDatabase does not do any authentication checks.

## Backend API Endpoints

Backend has two different brances:
 * `/api/push/`, which use Server Sent Events to push data to the frontend
 * `/api/pull/`, which is used to GET data from backend **NOT IN ACTIVE USE**
Found in `/controllers/` folder.

**PUSH CONTROLLER**

EXAMPLE:
`<host url>/api/push/<endpoint url>`

TeamUpdates:
 * `<host url>/api/push/teamUpdates`
 * Sends JSON.string data every 30 minutes
 * returns:
    `{
        data: {
            teams: stuff stuff
        }
    }`

DataUpdates:
 * `<host url>/api/push/dataUpdates`
 * Sends JSON.string data every ~3 seconds
 * returns:
    `{
        idk what this will look like
    }`


**PULL CONTROLLER**

`<host url>/api/pull/<endpoint url>`

Teams:
 * GET: `<host url>/api/pull/teams`
 * Sends JSON data on GET request
 * returns:
    `
    `

Errors:
 * GET: `<host url>/api/pull/errors`
 * Sends JSON data on GET request
 * return
    `sdfgsdgsd
    dafgsdfgsdf
    sdfgsdfg
    {sdfgfdg (fasfas
    ff)}
    `
Connections:
 * GET: `<host url>/api/pull/admin/connections`
 * Sends JSON data on GET request
 * returns:
    `
    `

Deprecated Endpoints:
 * `<host url>/api/pull/agentsonline`
 * `<host url>/api/pull/queue`
 * `<host url>/api/pull/inboundreport`

## Endnotes

**TestDatabase** and **Frontend** both have their own README.md in their own respective repositories.

Could move data transformation happening in backend's `/formats/databaseToLocal.js` to frontend.
Could add tests for backend.
Could add data validation for information sent by database to avoid any problems with corrupted data sent by database.
Could improve logging.
Could separate database calls/cache information recieved to allow scaling without excess requests to database.

# Author

**Oliver Martikainen**