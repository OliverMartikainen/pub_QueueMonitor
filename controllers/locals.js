//replace with cache storaging for scaling?

let AgentsOnline  // same as API AgentsOnline
let Queue //same as API GeneralQueue
let Teams //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
let Services //{ServiceName, ServiceId} - used to add ServiceId to Report
let InboundReport //{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}
let Errors //backend can report database or other errors to frontend
let Connections



module.export = {
    AgentsOnline, Queue, Teams, Services, InboundReport, Errors, Connections
}