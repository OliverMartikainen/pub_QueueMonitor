let AgentsOnline  // same as API AgentsOnline
let Queue //same as API GeneralQueue
let Teams //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
let Services //{ServiceName, ServiceId} - used to add ServiceId to Report
let InboundReport //{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}



module.export = {
    AgentsOnline, Queue, Teams, Services, InboundReport
}