Last Updated: 11.12.2019


# QueueMonitor

## About

Queue Monitor is a fullstack project that is deployed as a dashboard for support center teams.
It is used to show the support teams:
- Staff status and availability (referred to as `agents`)
- Incoming email and call queue's

Designed to be used on a 1920x1080p monitor.

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

1. Run command `npm install` in both this and **TestDatabase** repository root folders to install all of their dependancies.
2. To use with TestDatabase add an "**.env**" file to **Backend** repository root and insert the following text in it:
    ```
        TEST_URI=http://localhost:3050
        TEST_PORT=3010
    ```
3. In **TestDatabase** root run command `npm start` to start the **TestDatabase** server
    - If started successfully should display:
    ```
        Test database server running from port 3050
    ```
4. In **Backend** (this repos) root run command `npm run showcase` to start the QueueMonitor server and connect it to the **TestDatabase**
    - If started successfully should display:
    ``` 
        Connecting to TestDatabase in http://localhost:3050
        Server version <server version number> running from port 3010
        teamUpdates:    <timestamp of data>   |     Listeners: 0
        _______________________ 
    ```
5. In a **Google Chrome** or **Mozilla Firefox** browser navigate to `http://localhost:3010`

---

# Backend Documentation

The Backend does not use any authentication with frontend due to expected use case and hosting location. The backend does not read any data from the frontend, it only sends.

The Backend does authenticate with the actual Database, however the TestDatabase does not do any authentication checks.

## Backend Script Commands

    Commands:
    1. npm start
    2. npm run watch
    3. npm run showcase
    4. npm run build:ui

## Backend API Endpoints

Backend has two different brances in `/controllers/` folder:
 * `/api/push/`, which use Server Sent Events to push data to the frontend
 * `/api/pull/`, which is used to GET data from backend **NOT IN ACTIVE USE**

### PUSH CONTROLLER

EXAMPLE:
`<host url>/api/push/<endpoint url>`  
With server running go to endpoint anddress to see example of data.  
Need to use [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
 API to make use of the Server Sent Events.

**TeamUpdates**:
 * `<host url>/api/push/teamUpdates`
 * Sends JSON.string data every 30 minutes
 * Connection settings:
 ```
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
 ```
 * returns: <br>
 ```
    data:
    {
        "teams":
        [{
            "TeamName": String,
            "Profiles:
            [{
                "AgentName": String,
                "AgentFirstName": String,
                "AgentId": Number,
                "TeamName": String,
                "ServiceIds": [Numbers]
            }]
        }],
        "services":
        [{
            "ServiceName": String,
            "ServiceId": Number
        }],
        "timeStamp": String,
        "status": Number,
        "serverVersion": String
    }
```

**DataUpdates**:
 * `<host url>/api/push/dataUpdates`
 * Sends JSON.string data every ~3 seconds
 * Connection settings:
 ```
        'connection': 'keep-alive',
        'cache-control': 'no-cache',
        'content-Type': 'text/event-stream'
 ```
 * returns:
 ```
     data:
     {
         "queue":
         [{
             "ServiceId": Number,
             "ServiceName": String,
             "ContactType": String,
             "QueueLength": Number,
             "MaxQueueTime": Number
         }],
         "agentsOnline":
         [{
             "AgentId": Number,
             "AgentName": String,
             "Team": String,
             "Reason": String,
             "Duration": Number
         }],
         "reportPBX":
         [{
             "ServiceName": String,
             "ServiceId": Number,
             "ContactsPieces": Number,
             "ProcessedPieces": Number
         }],
         "reportEmail":
         [{
             "ServiceName": String,
             "ServiceId": Number,
             "ContactsPieces": Number,
             "ProcessedPieces": Number
         }],
         "timeStamp": String,
         "status": Number
     }
```

### PULL CONTROLLER

EXAMPLE:
`<host url>/api/pull/<endpoint url>`

**Teams:**
 * GET: `<host url>/api/pull/teams`
 * Sends JSON data on GET request
 * returns:
 ```
    {
    "teams":
    [{
        "TeamName": String,
        "Profiles:
        [{
            "AgentName": String,
            "AgentFirstName": String,
            "AgentId": Number,
            "TeamName": String,
            "ServiceIds": [Numbers]
        }]
    }],
    "services":
    [{
        "ServiceName": String,
        "ServiceId": Number
    }],
    "timeStamp": String,
    "status": Number,
    "serverVersion": String
    }
```

**Errors:**
 * GET: `<host url>/api/pull/errors`
 * Sends JSON data on GET request
 * return:
 ```
    {
        "Data":
        {
            "type": String,
            "status": Number,
            "code": "String - error header from failed request",
            "message": "String - error message from failed request",
            "date": "String - date of error start"
        },
        "Teams":
        {
            "type": String,
            "status": Number,
            "code": "String - error header from failed request",
            "message": "String - error message from failed request",
            "date": "String - date of error start"
        }
    }
 ```

**Connections:**
 * GET: `<host url>/api/pull/admin/connections`
 * Sends JSON data on GET request
 * returns:
 ```
    {
        "data": Number,
        "teams": Number,
        "time": "String - eg: '17:04:53' "
    }
 ```

**Deprecated Endpoints:**
 * `<host url>/api/pull/agentsonline`
 * `<host url>/api/pull/queue`
 * `<host url>/api/pull/inboundreport`

## Endnotes

**TestDatabase** and **Frontend** both have their own README.md in their own respective repositories.

### Further Development Thoughts

Could add tests.
Could add data validation for information sent by database to avoid any problems with corrupted data sent by database.
Could improve logging.
Could separate database calls/cache information recieved to allow scaling without excess requests to database.
Could improve frontend filter selection and allow choosing what parts of dashboard is shown

# Author

**Oliver Martikainen**
