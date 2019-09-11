const setTeams = (teams, agents, profiles) => {
    if (agents.length != profiles.length) {
        console.log('Agents count mismatch', agents.length, profiles.length)
    }

    const AgentProfile = (profile) => {
        const agent = agents.find(agent => agent.AgentId === profile.AgentId)
        return ({
            'AgentName': `${agent.LastName} ${agent.FirstName}`, //name used in options
            'AgentId': profile.AgentId,
            'TeamName': agent.TeamName, 
            'ServiceIds': profile.Profiles.map(list => list.ServiceId) //list used to filter queue
        })
    }

    //each has an ALL -profile with team index id(rename to ALL_TEAMNAME_PROFILES later)
    const TeamProfile = (TeamName, AgentProfiles) => {
        return ({
            'TeamName' : TeamName,
            'AgentProfiles': AgentProfiles
        })
    }

    const agentProfiles = profiles.map(profile => AgentProfile(profile))
    console.log(agentProfiles)

    //each profile has {TeamName, AgentId, AgentName, ServiceIds[]}
    profiles.forEach(profile => {
        agent = agents.find(agent => agent.AgentId === profile.AgentId)
        profile.TeamName = agent.TeamName
        profile.ServiceIds = profile.Profiles.map(list => list.ServiceId) //list used to filter queue
        profile.AgentName = `${agent.LastName} ${agent.FirstName}` //name used in options
        delete profile.Profiles
    })

    const teamServices = (profiles) => {
        var allServices = []
        profiles.forEach(profile => allServices = [...allServices, ...profile.ServiceIds])
        return allServices.filter((item, index) => allServices.indexOf(item) === index) //removes duplicates - indexOf returns first item, if index is different == duplicate
    }

    //Each team has {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
    teams.forEach((team, index) => {
        team.Profiles = profiles.filter(profile => profile.TeamName === team.TeamName)
        teamProfile = {
            TeamName: team.TeamName,
            AgentId: index, //Could cause issues if database has same agentid - shouldnt though 
            AgentName: 'ALL',
            ServiceIds: teamServices(team.Profiles) //all teams services in one profile
        }
        team.Profiles.push(teamProfile)
    })
    return teams
}

//return [{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}]
const setInboundReport = (report_db, services) => {
    const findServiceId = (ServiceName) => services.find(service => service.ServiceName === ServiceName).ServiceId

    const ServiceReport = (report) => {
     return ({
         'ServiceName' : (report.ServiceName !== '20099') ? report.ServiceName : 'ALL_Services',
         'ServiceId' : (report.ServiceName !== '20099') ? findServiceId(report.ServiceName) : -1,
         'ContactsPieces' : report.ContactsPieces,
         'ProcessedPieces' : report.ProcessedPieces
     })
    }
    return report = report_db.map(report => ServiceReport(report))
}

module.exports = {setTeams, setInboundReport}