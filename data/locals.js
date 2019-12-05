/**
 * Used to store slowly updated data, eg "Teams" and "Services" at the moment.
 * If app was scaled this should be replaced with something more elaborate.
 */

let AgentsOnline  // same as API AgentsOnline
let Queue //same as API GeneralQueue
let Teams //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}
let Services //{ServiceName, ServiceId} - used to add ServiceId to Report
let InboundReport //{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}
let Errors //backend can report database or other errors to frontend
let Connections
let Data



module.export = {
    AgentsOnline, Queue, Teams, Services, InboundReport, Errors, Connections, Data
}