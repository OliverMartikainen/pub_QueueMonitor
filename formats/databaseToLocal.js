/**
 * Function that creates the Teams json data sent to frontend in "teamUpdates" stream
 * Requires matching data from several different endpoints in database (mostly to do with Agent.FirstName and ServiceIds)
 * - some data sources only uses AgentNames, others only AgentId, etc.
 * 
 * params are all the unchanged data recieved from database (endpoints /teams, /agents, /profiles)
 * const Teams = 
 * {
 *      TeamName: String,
 *      Profiles:   {
 *                      AgentName: String,
 *                      AgentFirstName: String,
 *                      AgentId: Number,
 *                      ServiceIds: [Numbers]
 *                  }
 * }
 * 
 * @param {*} teams_db 
 * @param {*} agents_db 
 * @param {*} profiles_db
 * @return {Teams}
 */
const setTeams = (teams_db, agents_db, profiles_db) => {
    if (agents_db.length != profiles_db.length) {
        console.log('Agents count mismatch', agents_db.length, profiles_db.length)
        /* Frozen agents not returned in agents_db, but their profiles are returned in probiles_db, causes mismatch */
    }

    //frontend expects this structure - if changed OptionsSection needs change
    const AgentProfiler = (profile) => {
        /* !! as of 29.9.2020 All 'frozen' agents will not be returned in agents_db,
        but their profiles will still be returned in profiles_db --> this will result in agents being not found*/
        const agent = agents_db.find(agent => agent.AgentId === profile.AgentId) //connects profile with agent & Team
        if (!agent) {
            //console.log(`NO AGENT MATCH FOR PROFILE WITH AGENTID: ${profile.AgentId}`) 
            //"Agents count mismatch" log above tells us if there are "NO AGENT MATCH" events.
            return null
        }

        return ({
            'AgentName': `${agent.LastName} ${agent.FirstName}`, //name used in frontend options
            'AgentFirstName': agent.FirstName, //for frontend "Censor"
            'AgentId': profile.AgentId,
            'TeamName': agent.TeamName,
            'ServiceIds': profile.Profiles.map(list => list.ServiceId) //list used to filter queue in fronted
        })
    }
    const TeamProfiler = (team, AgentProfiles) => {
        const teamProfiles = AgentProfiles.filter(p => p.TeamName === team.TeamName)
        return ({
            'TeamName': team.TeamName,
            'Profiles': teamProfiles
        })
    }
    const ALL_TEAM_services = (profiles) => { //gathers all service ids in 1 team
        var allServices = []
        profiles.forEach(profile => allServices = [...allServices, ...profile.ServiceIds])
        return allServices.filter((item, index) => allServices.indexOf(item) === index) //removes duplicates - indexOf returns first item, if index is different == duplicate
    }

    //const TeamSorter - could do sorting in backend atm done in frontend
    //const ProfileSorter 

    /*ABOVE HELPER FUNCTIONS - BELOW DATA TRANSFORMATION PROCESS*/

    const AgentProfiles = profiles_db.reduce((arr, profile) => {
        const agentProfile = AgentProfiler(profile)
        if(agentProfile) arr.push(agentProfile) //else ignore --> profile.agentId didnt match any agent in agent_db
        return arr
    }, [])
    const TeamProfiles = teams_db.map(team => TeamProfiler(team, AgentProfiles))
    const allCombinedProfile = {
        'AgentName': 'ALL TEAMS', //name used in options
        'AgentFirstName': 'ALL TEAMS',
        'AgentId': 1,
        'TeamName': 'ALL TEAMS',
        'ServiceIds': ALL_TEAM_services(AgentProfiles) //list used to filter queue
    }
    const allTeamsTeam = {
        'TeamName': 'ALL TEAMS', //TeamName 'ALL TEAMS' bugs all Profiles.AgentId in frontend - dont know reason, this is workaround
        'Profiles': [...AgentProfiles]
    }

    //Add an ALL TEAMNAME PROFILES for each team
    TeamProfiles.forEach((team, index) => {
        const teamCombinedProfile = {
            'AgentName': `ALL ${team.TeamName}`, //frontend StatsCounter & OptionsSection (eg Profile sorting) depend on this format - changing this requires changes there
            'AgentFirstName': `ALL ${team.TeamName}`,
            'AgentId': index + 2, //Could cause issues if database has same agentid - agentid seem to start from 20000 though
            'TeamName': team.TeamName,
            'ServiceIds': ALL_TEAM_services(team.Profiles) //all teams services in one profile
        }
        team.Profiles.unshift(teamCombinedProfile)
        allTeamsTeam.Profiles.unshift(teamCombinedProfile) //adds the teamCombined to ALL TEAMS team
    })

    allTeamsTeam.Profiles.unshift(allCombinedProfile) //adds profile with all serviceIds to ALL TEAM team
    TeamProfiles.unshift(allTeamsTeam) //adds ALL TEAM team to the teams list

    return TeamProfiles
}

/**
 * Function to create InboundReport that is part of "dataUpdates"
 * database InboundReport has too much info and lacks ServiceId, so need "Services" to match ServiceName to ServiceId 
 * 
 * @param {*} report_db //from database /inboundreport
 * @param {*} services  //from database /services
 * @return {InboundReport} = [{String, Numb, Numb, Numb}] === [{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}]
 */
const setInboundReport = (report_db, services) => {
    if (!services || !report_db) { //can happen when starting server
        //console.log('Serivces missing, report was not formed')
        return []
    }
    const findServiceId = (ServiceName) => services.find(service => service.ServiceName === ServiceName).ServiceId  //
    const ServiceReport = (report) => {
        const ServiceName = report.Time
        return ({
            'ServiceName': (ServiceName !== '20099') ? ServiceName : 'ALL_Services', //20099 ServiceId that has total stats for all services
            'ServiceId': (ServiceName !== '20099') ? findServiceId(ServiceName) : -1,
            'ContactsPieces': report.ContactsPieces,
            'ProcessedPieces': report.ProcessedPieces
        })
    }
    //ATM 'ServiceName' Ulossoitto is not counted into any team or service profile - causes difference in OC report number
    return report_db.map(report => ServiceReport(report))
}

module.exports = { setTeams, setInboundReport }