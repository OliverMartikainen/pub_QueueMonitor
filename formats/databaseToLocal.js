
//could add reports to this, but then i'd be doing this every update not every 1h
//or could update this every 1h but update reports part every 6s to avoid making these calculations
const setTeams = (teams_db, agents_db, profiles_db) => {
    if (agents_db.length != profiles_db.length) {
        console.log('Agents count mismatch', agents_db.length, profiles_db.length)
    }

    //frontend expects this structure - if changed OptionsSection needs change
    const AgentProfile = (profile) => {
        const agent = agents_db.find(agent => agent.AgentId === profile.AgentId) //connects profile with agent & Team
        return ({
            'AgentName': `${agent.LastName} ${agent.FirstName}`, //name used in options
            'AgentId': profile.AgentId,
            'TeamName': agent.TeamName,
            'ServiceIds': profile.Profiles.map(list => list.ServiceId) //list used to filter queue
        })
    }
    const TeamProfile = (team, AgentProfiles) => {
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

    //const TeamSorter
    //const ProfileSorter 

    /*ABOVE HELPER FUNCTIONS - BELOW DATA TRANSFORMATION PROCESS*/

    const AgentProfiles = profiles_db.map(profile => AgentProfile(profile))
    const TeamProfiles = teams_db.map(team => TeamProfile(team, AgentProfiles))
    const allTeams = 'ALL TEAMS' //name of TEAM with all profiles
    TeamProfiles.unshift({ 'TeamName': allTeams, 'Profiles': AgentProfiles })

    //Add an ALL TEAMNAME PROFILES for each team
    TeamProfiles.forEach((team, index) => {
        ALL_TEAM = {
            'AgentName': (team.TeamName !== allTeams) ? (`ALL ${team.TeamName}`) : allTeams, //frontend StatsCounter & OptionsSection (eg Profile sorting) depend on this format - changing this requires changes there
            'AgentId': index, //Could cause issues if database has same agentid - agentid seem to start from 20000 though
            'TeamName': team.TeamName,
            'ServiceIds': ALL_TEAM_services(team.Profiles) //all teams services in one profile
        }
        team.Profiles.unshift(ALL_TEAM)
    })
    //Add all ALL TEAMNAME profiles to ALL TEAMS team
    const allTeamsProfile = TeamProfiles.find(t => t.TeamName === allTeams)
    TeamProfiles.forEach(t => {
        if (t.TeamName !== allTeams) {
            const tAll = t.Profiles.find(p => p.AgentName === `ALL ${t.TeamName}`)
            allTeamsProfile.Profiles.unshift({
                'AgentName': tAll.AgentName,
                'AgentId': tAll.AgentId,
                'TeamName': t.TeamName, //needed to give correct teamname
                'ServiceIds': tAll.ServiceIds,
            })
        }
    })
    return TeamProfiles
}

//return [{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}]
const setInboundReport = (report_db, services) => {
    const findServiceId = (ServiceName) => services.find(service => service.ServiceName === ServiceName).ServiceId
    const ServiceReport = (report) => {
        ServiceName = report.Time
        return ({
            'ServiceName': (ServiceName !== '20099') ? ServiceName : 'ALL_Services',
            'ServiceId': (ServiceName !== '20099') ? findServiceId(ServiceName) : -1,
            'ContactsPieces': report.ContactsPieces,
            'ProcessedPieces': report.ProcessedPieces
        })
    }
    //ATM 'ServiceName' Ulossoitto is not counted into any team or service profile - causes difference in OC report number
    return report_db.map(report => ServiceReport(report))
}

module.exports = { setTeams, setInboundReport }