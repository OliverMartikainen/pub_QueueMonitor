(this.webpackJsonpqueue_monitor_front=this.webpackJsonpqueue_monitor_front||[]).push([[0],[,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(8),c=n.n(r),s=(n(13),n(2)),i=n(1),a=n(5),o=(n(14),n(15),n(16),n(0)),l=function(e){var t=e.agent,n=e.size,r=e.censor,c=new Date(1e3*t.Duration).toISOString().substr(11,8),s="biggest"===n?30:12,i=r?t.AgentFirstName:t.AgentName.substr(0,s);return Object(o.jsxs)("div",{className:"agent",id:t.status,children:[Object(o.jsx)("div",{className:"agent-name",children:i}),Object(o.jsxs)("div",{className:"agent-status",children:[c," ",t.Reason]})]})},u=function(e){var t,n=e.agents,r=e.censor,c=(t=n.length)<5?"biggest":t<11?"big":"normal",s=n.map((function(e,t){return Object(o.jsx)(l,{agent:e,size:c,censor:r},t)}));return Object(o.jsx)("div",{className:"agent-grid ".concat(c),id:"content",children:s})},d=(n(18),function(e){var t=e.idStatus,n=e.idNumber,r=e.status,c=e.count;return Object(o.jsxs)("div",{className:"agent-count",children:[Object(o.jsx)("div",{className:"status",id:t,children:r}),Object(o.jsx)("div",{className:"number",id:n,children:c})]})}),j=function(e){var t=e.statusCount;return Object(o.jsxs)("div",{className:"agent-header",children:[Object(o.jsx)(d,{idStatus:"center",idNumber:"left",status:"FREE: ",count:t.free}),Object(o.jsx)(d,{idStatus:"center",idNumber:"left",status:"CALL: ",count:t.call}),Object(o.jsx)(d,{idStatus:"center",idNumber:"left",status:"BUSY: ",count:t.busy}),Object(o.jsx)(d,{idStatus:"center",idNumber:"left",status:"TOTAL: ",count:t.total})]})},m=["J\xc4LKIKIRJAUS","PUHELU (Sis\xe4\xe4n)","PUHELU (Ulos)","S\xc4HK\xd6POSTI (Sis\xe4\xe4n)","S\xc4HK\xd6POSTI (Ulos)","WRAPUP TIME","CALL (In)","CALL (Out)"],v=["Login","Sis\xe4\xe4nkirjaus"],b=function(e){var t=e.agents,n=e.censor,r=v,c=m,s=t.reduce((function(e,t){return e.total++,r.includes(t.Reason)?(e.free++,t.status="free",e):c.includes(t.Reason)?(e.call++,t.status="call",e):(t.status="busy",e.busy++,e)}),{free:0,call:0,busy:0,total:0}),i=0!==t.length?"":"NO AGENTS ONLINE";return Object(o.jsx)("div",{id:"agent-section",children:Object(o.jsxs)("div",{id:"agent-container",children:[Object(o.jsx)(j,{statusCount:s}),Object(o.jsxs)("div",{id:"agent-list",children:[Object(o.jsx)(u,{agents:t,censor:n}),Object(o.jsx)("div",{id:"agent-background",children:i})]})]})})},O=(n(19),n(20),function(e){var t=e.item,n=t.MaxQueueTime,r=Math.floor(n/3600),c=Math.floor(n/60)-60*r,s=n-60*c-3600*r,i="PBX"===t.ContactType?function(e){return e<120?"green":e<600?"yellow":"red"}(n):"email";return Object(o.jsxs)("div",{className:"queue-row",children:[Object(o.jsx)("div",{className:"service-name",children:t.ServiceName}),Object(o.jsx)("div",{className:"service-channel",id:i,children:"PBX"===t.ContactType?"CALL":t.ContactType}),Object(o.jsx)("div",{className:"service-length",id:i,children:t.QueueLength}),Object(o.jsxs)("div",{className:"service-time",id:i,children:[r<10?"0".concat(r):r,":",c<10?"0".concat(c):c,":",s<10?"0".concat(s):s]})]})}),h=(n(21),n.p+"static/media/VIPAlarm.9b4881d5.mp3"),f=function(e){var t=e.startTime,n=Object(i.useState)(t),r=Object(s.a)(n,2),c=r[0],a=r[1];if(Object(i.useEffect)((function(){setTimeout((function(){a(c+1)}),1e3)}),[c]),c>20){var l=new Date(1e3*(c-20)).toISOString().substr(11,8);return Object(o.jsxs)("div",{className:"timer red",children:["-",l]})}var u=new Date(1e3*(20-c)).toISOString().substr(11,8);return Object(o.jsx)("div",{className:"timer blue",children:u})},S=function(e){var t=e.callShown,n=Object(i.useState)("alarm-yellow"),r=Object(s.a)(n,2),c=r[0],a=r[1],l="alarm-yellow"!==c?"alarm-yellow":"alarm-white";return Object(i.useEffect)((function(){setTimeout((function(){a(l)}),1e3)}),[l]),Object(o.jsxs)("div",{className:"vip-alarm-modal ".concat(c),children:[Object(o.jsx)("audio",{src:h,autoPlay:!0,loop:!0}),Object(o.jsx)("div",{children:"VIP CALL"}),Object(o.jsx)("div",{className:"call-name",children:t.ServiceName}),Object(o.jsx)(f,{startTime:t.MaxQueueTime})]})},x=function(e){var t=e.vipCalls;if(0===t.length)return null;var n=t[0];return Object(o.jsx)(S,{callShown:n})},g=(n(22),function(){return Object(o.jsx)("div",{className:"medium-alarm-header",children:Object(o.jsx)("div",{children:"MEDIUM ALARM CALLS:"})})}),A=function(e){var t=e.ServiceName,n=e.MaxQueueTime,r=new Date(1e3*n).toISOString().substr(11,8),c="";return c=t.length>14?t.substr(0,14)+"...":t,Object(o.jsxs)("div",{className:"medium-alarm-row",children:[Object(o.jsx)("div",{children:c}),Object(o.jsx)("div",{}),Object(o.jsx)("div",{children:r})]})},N=function(e){var t=e.mediumAlarmCalls.map((function(e,t){return Object(o.jsx)(A,{ServiceName:e.ServiceName,MaxQueueTime:e.MaxQueueTime},t)}));return Object(o.jsxs)("div",{className:"medium-alarm-modal",children:[Object(o.jsx)(g,{}),t]})},E=function(e){var t=e.mediumAlarmCalls;return 0===t.length?null:Object(o.jsx)(N,{mediumAlarmCalls:t})},I=(n(23),function(){return Object(o.jsxs)("div",{id:"queue-header",children:[Object(o.jsx)("div",{id:"header-name",children:"SERVICE NAME"}),Object(o.jsx)("div",{id:"header-channel",children:"TYPE"}),Object(o.jsx)("div",{id:"header-length",children:"#"}),Object(o.jsx)("div",{id:"header-time",children:"WAIT"})]})}),w=function(e,t){return e.MaxQueueTime<t.MaxQueueTime?1:e.MaxQueueTime>t.MaxQueueTime?-1:0},p=function(e){return e.map((function(e,t){return Object(o.jsx)(O,{item:e},t)}))},T=function(e){var t=e.text;return Object(o.jsx)("div",{className:"list-background",children:t})},L=function(e){var t=e.queue,n=e.activeAlarms,r=[],c=[];t&&(r=t.filter((function(e){return"PBX"!==e.ContactType})).sort(w),c=t.filter((function(e){return"PBX"===e.ContactType})).sort(w));var s=0!==r.length?null:Object(o.jsx)(T,{text:"NO EMAILS"}),i=0!==c.length?null:Object(o.jsx)(T,{text:"NO CALLS"}),a=c.filter((function(e){return 1===n[e.ServiceId]})),l=c.filter((function(e){return 2===n[e.ServiceId]}));return Object(o.jsx)("div",{id:"queue-section",children:Object(o.jsxs)("div",{id:"queue-container",children:[Object(o.jsx)(I,{}),Object(o.jsx)("div",{id:"call-list",children:i||p(c)}),Object(o.jsx)("div",{id:"email-list",children:s||p(r)}),Object(o.jsx)(E,{mediumAlarmCalls:a}),Object(o.jsx)(x,{vipCalls:l})]})})},C="50% 50%",P={showQueue:!0,showAgents:!0,gridStyle:C},y=function(e,t,n){var r=Object(a.a)({},t);r[e]=!r[e],r.showQueue&&r.showAgents?r.gridStyle=C:r.gridStyle="100%";try{window.localStorage.setItem("dashboardColumns",JSON.stringify(r)),n(r)}catch(c){console.log("Dashboard switch failure"),window.localStorage.removeItem("dashboardColumns"),n(P)}},M=function(e){var t=e.queue,n=e.activeAlarms,r=e.agents,c=e.censor,a=Object(i.useState)(function(){var e=localStorage.getItem("dashboardColumns");if(e)try{return JSON.parse(e)}catch(t){return console.log("Dashboard switch failure"),window.localStorage.removeItem("dashboardColumns"),P}return P}()),l=Object(s.a)(a,2),u=l[0],d=l[1],j=function(e){return e?"shown":"not-shown"},m={"--grid-columns":u.gridStyle},v=u.showQueue?"HIDE QUEUE":"SHOW QUEUE",O=u.showAgents?"HIDE AGENTS":"SHOW AGENTS";return Object(o.jsxs)("div",{id:"dashboard",style:m,children:[Object(o.jsx)("div",{id:"dashboard-options",children:Object(o.jsxs)("div",{id:"dashboard-options-modal",children:[Object(o.jsx)("button",{className:j(u.showQueue),onClick:function(){return y("showQueue",u,d)},children:v}),Object(o.jsx)("button",{className:j(u.showAgents),onClick:function(){return y("showAgents",u,d)},children:O})]})}),u.showQueue&&Object(o.jsx)(L,{queue:t,activeAlarms:n}),u.showAgents&&Object(o.jsx)(b,{agents:r,censor:c})]})},R=n(3),U=function(e,t){var n=e.reduce((function(e,n){return t.includes(n.ServiceId)&&(e.Answered+=n.ProcessedPieces,e.Received+=n.ContactsPieces),e}),{Answered:0,Received:0}),r="".concat(n.Answered,"/").concat(n.Received),c="".concat(Math.round(n.Answered/n.Received*100),"%");return{stats:r,ratio:"NaN %"!==c?c:""}},D=(n(24),function(e){var t=e.type,n=e.stats;return Object(o.jsxs)("div",{className:"stats-count",children:[Object(o.jsxs)("div",{children:[t,": ",n.stats]}),Object(o.jsx)("div",{children:n.ratio})]})}),Q=function(e){var t=e.name,n=e.statsPBX,r=e.statsEmail;return Object(o.jsxs)("div",{className:"stats-row",children:[Object(o.jsx)("div",{children:t}),Object(o.jsx)(D,{type:"Calls",stats:n}),Object(o.jsx)(D,{type:"Emails",stats:r})]})},B=function(e){var t,n=e.teamServicesIndex,r=e.activeTeam,c=e.teams,s=e.report,i="NONE",a={stats:"0/0",ratio:""},l={stats:"0/0",ratio:""};if(console.log(s),0!==c.length&&0!==(null===s||void 0===s||null===(t=s.reportPBX)||void 0===t?void 0:t.length))if(r.includes("ALL TEAMS"))a=U(s.reportPBX,[-1]),l=U(s.reportEmail,[-1]),i="ALL TEAMS";else{var u=r.reduce((function(e,t){var r=n[t];return r?{activeIdsPBX:[].concat(Object(R.a)(e.activeIdsPBX),Object(R.a)(r.pbxServiceIds)),activeIdsEmail:[].concat(Object(R.a)(e.activeIdsEmail),Object(R.a)(r.emailServiceIds))}:(console.error("MISSING TEAMD SERVICE IDS FOR",t),e)}),{activeIdsPBX:[],activeIdsEmail:[]}),d=u.activeIdsPBX,j=u.activeIdsEmail;a=U(s.reportPBX,d),l=U(s.reportEmail,j),i=r.length>1?"".concat(r[0]," + ").concat(r.length-1):r[0]||"NONE"}return Object(o.jsx)("div",{className:"statistics",children:Object(o.jsx)(Q,{name:i,statsPBX:a,statsEmail:l})})},F=(n(25),function(e,t){return 0===t.length||0===e.length?[]:t.find((function(e){return"ALL TEAMS"===e.TeamName})).Profiles.filter((function(t){return e.includes(t.AgentId)}))}),H=function(e,t){if(0===t.length||0===e.length)return[];return F(e,t).reduce((function(e,t){return[].concat(Object(R.a)(e),Object(R.a)(t.ServiceIds))}),[])},k=function(e,t){return 0===e.length||0===t.length?[]:e.filter((function(e){return t.includes(e.ServiceId)}))},_=function(e,t){var n=t[e];return void 0===n?0:n},V=k,X=function(e,t){var n=[];return e.forEach((function(e){var r;n.push.apply(n,Object(R.a)((r=e,0===t.length?[]:t.find((function(e){return e.TeamName===r})).Profiles)))})),n},q=H,J=F,G=function(e,t,n){var r=H(t,n);return e.filter((function(e){return r.includes(e.ServiceId)}))},K=function(e,t){return t.includes("ALL TEAMS")?e:e.filter((function(e){return t.includes(e.Team)}))},W=function(e){var t=e.list,n=e.column,r=e.type,c=e.header,a=Object(i.useState)(""),l=Object(s.a)(a,2),u=l[0],d=l[1],j=t?t.filter((function(e){return e.props.children.toLowerCase().includes(u.toLowerCase())})):t,m={gridColumn:n};return Object(o.jsxs)("div",{className:"modal-list",style:m,children:[Object(o.jsxs)("div",{className:"modal-title",children:[Object(o.jsx)("h3",{children:r}),Object(o.jsx)("h3",{children:c}),"Search: ",Object(o.jsx)("input",{value:u,onChange:function(e){return d(e.target.value)}})]}),Object(o.jsx)("div",{className:"modal-search",children:j})]})},Y=function(e){var t=e.activeTeamProfiles,n=e.activeTeam,r=e.teamsList,c=e.changeTeam,s=e.activeProfileId,i=e.changeProfile,a=e.showModal,l=J(s,r),u=r?r.map((function(e,t){return Object(o.jsx)("button",{className:(r=e.TeamName,n.includes(r)?"Selected":"Unselected"),onClick:function(){return c(e.TeamName)},children:e.TeamName},t);var r})):[],d=function(e){return s.includes(e.AgentId)?"Selected":"Unselected"},j=function(e,t){return e.sort((function(e,n){return t.includes(e.AgentId)?-1:t.includes(n.AgentId)?1:"ALL TEAMS"===e.AgentName?-1:"ALL TEAMS"===n.AgentName?1:e.AgentName<n.AgentName?-1:1}))}(t,s).map((function(e,t){return Object(o.jsx)("button",{className:d(e),onClick:function(){return i(e.AgentId)},children:e.AgentName},t)})),m=a?"show":"hide",v=0===n.length?"NONE":n.length>1?"".concat(n[0]," +").concat(n.length-1):n[0],b=0===l.length?"NONE":l.length>1?"".concat(l[0].AgentName," +").concat(l.length):l[0].AgentName;return Object(o.jsxs)("div",{className:"modal-box",id:m,children:[Object(o.jsx)(W,{list:u,column:1,type:"TEAM:",header:v}),Object(o.jsx)(W,{list:j,column:2,type:"PROFILE:",header:b})]})},z=(n(26),function(e){var t=e.showHelp?"show":"hide",n=window.sessionStorage.getItem("serverVersion");return Object(o.jsxs)("div",{className:"help-modal",id:t,children:[Object(o.jsx)("p",{children:Object(o.jsxs)("b",{children:["VERSION: ",n]})}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:" CHOOSE FILTERS"})," button:",Object(o.jsx)("br",{}),"- Use it to select different filters for the CALL and EMAIL queues, and the Agents shown.",Object(o.jsx)("br",{}),"- Selected PROFILE's determine the QUEUE filter.",Object(o.jsx)("br",{}),"- Selected TEAM's determine the AGENT filter.",Object(o.jsx)("br",{}),"Filter selection clarity will be improved in future."]}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:"REMOVE FILTERS"})," button:",Object(o.jsx)("br",{}),"- Use it to remove all selected filters."]}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:"SERVICE ALARMS"})," button:",Object(o.jsx)("br",{}),"- Shows all active service channels. Your CHOOSE FILTERS --\x3e PROFILE's determine these.",Object(o.jsx)("br",{}),"- All services shown here will be shown in QUEUE if an email or call comes from it.",Object(o.jsx)("br",{}),Object(o.jsx)("br",{}),"You can choose the alarm level of the CALLS of each service (emails not affected).",Object(o.jsx)("br",{}),"- NORMAL alarm is the default level - it is shown only in CALL section.",Object(o.jsx)("br",{}),"- MEDIUM alarm will show the call as a separate larger RED box.",Object(o.jsx)("br",{}),"- VIP alarm will trigger a screen wide flasing display with 20 second countdown and sound alarm.",Object(o.jsx)("br",{}),Object(o.jsx)("i",{children:"*NOTE for sound to work you need to allow autoplay in browser/click it once/use Chrome for less issues"})]}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:" CENSOR"})," button:",Object(o.jsx)("br",{}),"- Hides shows only 1st letter of Service Names and hides lastnames of Agents."]}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:"ERROR MESSAGE/LIGHT"}),":",Object(o.jsx)("br",{}),"- The status light is green when connection is good and everything is working.",Object(o.jsx)("br",{}),"- The status light is yellow when the browser cannot connect to the server. Either you need to change your connection or the server is down.",Object(o.jsx)("br",{}),"- The status light is red when the server cannot connect to the database. Contact admin."]}),Object(o.jsxs)("p",{children:[Object(o.jsx)("b",{children:"SHOW/HIDE QUEUE or AGENTS"})," dashboards:",Object(o.jsx)("br",{}),"- Hover over top center.",Object(o.jsx)("br",{}),"- Click the buttons"]})]})}),Z=(n(27),function(e){var t=e.error,n=200===t.status?"green":503===t.status?"yellow":"red",r="",c="Connection normal";return 200!==t.status&&(r="CONNECTION PROBLEMS",503===t.status&&(c="Server connection problems!"),502===t.status&&(c="Database connection problems!")),Object(o.jsxs)("div",{className:"error-board",children:[Object(o.jsxs)("div",{className:"error-status",children:[Object(o.jsx)("button",{id:n}),Object(o.jsxs)("div",{className:"error-explain",id:"message".concat(n),children:["Connection status: ",t.status,Object(o.jsx)("br",{}),c]})]}),Object(o.jsx)("div",{className:"error-message",id:"message".concat(n),children:r})]})}),$=(n(28),function(e){var t=e.ServiceAlarmType,n=e.changeAlarmsButtonFunc,r=function(e){var t={0:"Unselected",1:"Unselected",2:"Unselected"};return t[e]="Selected",t}(t);return Object(o.jsxs)("div",{children:[Object(o.jsx)("button",{className:r[0],onClick:function(){n(0)},children:"Normal Alarm"}),Object(o.jsx)("button",{className:r[1],onClick:function(){n(1)},children:"Medium Alarm"}),Object(o.jsx)("button",{className:r[2],onClick:function(){n(2)},children:"VIP Alarm"})]})}),ee=function(e){var t=e.ServiceName,n=e.ServiceId,r=e.ServiceAlarmType,c=e.activeAlarms,s=e.setActiveAlarms;return Object(o.jsxs)("div",{className:"service-modal-item",children:[Object(o.jsxs)("div",{children:[t," "]}),Object(o.jsxs)("div",{children:[n," "]}),Object(o.jsx)("div",{}),Object(o.jsx)($,{ServiceAlarmType:r,changeAlarmsButtonFunc:function(e){return function(e,t,n,r){var c=function(e,t,n){return 0===t?(delete n[e],Object(a.a)({},n)):(n[e]=t,Object(a.a)({},n))}(e,t,n);window.localStorage.setItem("activeAlarms",JSON.stringify(c)),r(c)}(n,e,c,s)}})]})},te=function(e){var t=e.completeActiveServices,n=e.activeAlarms,r=e.setActiveAlarms,c=Object(i.useState)(""),a=Object(s.a)(c,2),l=a[0],u=a[1],d=(0===t.length?[]:t.filter((function(e){return t=e.ServiceName,n=l,t.toLocaleLowerCase().includes(n.toLocaleLowerCase());var t,n}))).map((function(e,t){return Object(o.jsx)(ee,{ServiceName:e.ServiceName,ServiceId:e.ServiceId,ServiceAlarmType:e.AlarmType,activeAlarms:n,setActiveAlarms:r},t)}));return Object(o.jsxs)("div",{id:"service-modal-list",children:[Object(o.jsxs)("div",{id:"service-modal-title",children:[Object(o.jsx)("h3",{children:"Choose services alarm type - all active service shown"}),"Search: ",Object(o.jsx)("input",{value:l,onChange:function(e){return u(e.target.value)}})]}),Object(o.jsxs)("div",{id:"service-modal-search",children:[Object(o.jsxs)("div",{className:"service-modal-item",children:[Object(o.jsx)("div",{children:"Service Name "}),Object(o.jsx)("div",{children:"Service ID "}),Object(o.jsx)("div",{}),Object(o.jsx)("div",{children:"ALARM TYPES"})]}),d]})]})},ne=function(e){var t=e.services,n=e.showModal,r=e.activeServiceIds,c=e.activeAlarms,s=e.setActiveAlarms;if(!n)return null;var i=function(e,t){var n=[];return e.forEach((function(e){var r={ServiceName:e.ServiceName,ServiceId:e.ServiceId,AlarmType:_(e.ServiceId,t)};n.push(r)})),n}(V(t,r),c),a=n?"show":"hide";return Object(o.jsx)("div",{id:"service-modal-box",className:a,children:Object(o.jsx)(te,{completeActiveServices:i,activeAlarms:c,setActiveAlarms:s})})},re=(n(29),function(e){var t=Object(i.useState)(!1),n=Object(s.a)(t,2),r=n[0],c=n[1],a=Object(i.useState)(!1),l=Object(s.a)(a,2),u=l[0],d=l[1],j=Object(i.useState)(!1),m=Object(s.a)(j,2),v=m[0],b=m[1],O=e.activeTeam,h=e.teams,f=e.changeTeam,S=e.activeProfileId,x=e.changeProfile,g=e.services,A=e.censor,N=e.setCensor,E=e.connectionStatus,I=e.activeAlarms,w=e.setActiveAlarms,p=e.report,T=e.teamServicesIndex,L=function(e){return e?"Selected":"Unselected"},C=A?"On":"OFF",P=X(O,h),y=q(S,h);return Object(o.jsxs)("div",{id:"options-section",children:[Object(o.jsx)(Y,{activeTeamProfiles:P,activeTeam:O,teamsList:h,changeTeam:f,activeProfileId:S,changeProfile:x,showModal:r}),Object(o.jsx)(z,{showHelp:u}),Object(o.jsx)(ne,{services:g,showModal:v,activeServiceIds:y,activeAlarms:I,setActiveAlarms:w}),Object(o.jsxs)("div",{id:"option-buttons-container",children:[Object(o.jsx)("button",{className:L(r),onClick:function(){return c(!r)},children:"CHOOSE FILTERS"}),Object(o.jsx)("button",{className:"Unselected",onClick:function(){f("")},children:"REMOVE FILTERS"}),Object(o.jsx)("button",{className:L(v),onClick:function(){return b(!v)},children:"SERVICE ALARMS"}),Object(o.jsxs)("button",{className:L(A),onClick:N,children:["CENSOR: ",C]}),Object(o.jsx)("button",{className:L(u),onClick:function(){return d(!u)},children:"HELP"}),Object(o.jsx)(Z,{error:E})]}),Object(o.jsx)(B,{teamServicesIndex:T,activeTeam:O,teams:h,report:p})]})});Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_BACKEND_URL:"http://localhost:3001/api"}).REACT_APP_BACKEND_ORIGIN;var ce="".concat("./api","/push"),se=function(){return new EventSource("".concat(ce,"/dataUpdates"))},ie=function(){return new EventSource("".concat(ce,"/teamUpdates"))},ae=function e(t,n){var r=se();return r.onopen=function(){var e=(new Date).toISOString().substr(11,8);console.log("dataUpdates OPEN:",e)},r.onerror=function(){var c=(new Date).toISOString().substr(11,8);console.log("dataUpdates ERROR: ",c),n(503),r.close(),setTimeout((function(){return e(t,n)}),1e4)},r.onmessage=function(e){try{var r=JSON.parse(e.data);if(200!==r.status){var c=(new Date).toISOString();return n(r.status),void console.log("TEAM UPDATE FAILED",r.status,c)}t({agents:r.agentsOnline,queue:r.queue,report:{reportPBX:r.reportPBX,reportEmail:r.reportEmail}}),n(200)}catch(s){console.error(s)}},r},oe=function e(t){var n=ie();return n.onopen=function(){var e=(new Date).toISOString().substr(11,8);console.log("teamUpdates OPEN:",e)},n.onerror=function(){var r=(new Date).toISOString().substr(11,8);console.log("teamUpdates ERROR: ",r),n.close(),setTimeout((function(){return e(t)}),1e4)},n.onmessage=function(e){try{var n=JSON.parse(e.data);if(200!==n.status){var r=(new Date).toISOString().substr(11,8);return void console.log("TEAM UPDATE FAILED",n.status,r)}var c=window.sessionStorage.getItem("serverVersion");c&&c!==n.serverVersion&&(console.log("New version available",n.serverVersion,"old version:",c),setTimeout((function(){window.location.reload()}),5e3)),window.sessionStorage.setItem("serverVersion",n.serverVersion),t({teams:n.teams,services:n.services,teamServicesIndex:n.teamServicesIndex})}catch(s){console.error(s)}},n},le=(n(30),function(){var e=window.localStorage.getItem("activeProfileId");return e?e.split(",").map((function(e){return parseInt(e)})):[]}),ue=function(){var e=window.localStorage.getItem("activeTeam");return e?e.split(","):[]},de=function(){var e=window.localStorage.getItem("activeAlarms");return void 0!==e&&e?JSON.parse(e):{}},je=function(){var e=Object(i.useState)(ue),t=Object(s.a)(e,2),n=t[0],r=t[1],c=Object(i.useState)(de),a=Object(s.a)(c,2),l=a[0],u=a[1],d=Object(i.useState)(le),j=Object(s.a)(d,2),m=j[0],v=j[1],b=Object(i.useState)({queue:[],agents:[],report:{reportPBX:[],reportEmail:[]}}),O=Object(s.a)(b,2),h=O[0],f=O[1],S=Object(i.useState)({teams:[],services:[],teamServicesIndex:{}}),x=Object(s.a)(S,2),g=x[0],A=x[1],N=Object(i.useState)({status:200,errorStart:""}),E=Object(s.a)(N,2),I=E[0],w=E[1],p=Object(i.useState)(200),T=Object(s.a)(p,2),L=T[0],C=T[1],P=Object(i.useState)(!1),y=Object(s.a)(P,2),U=y[0],D=y[1];Object(i.useEffect)((function(){var e=oe(A),t=ae(f,C);return function(){e.close(),t.close()}}),[]),Object(i.useEffect)((function(){!function(e,t,n){t.status!==e&&n({status:e,time:(new Date).toISOString()})}(L,I,w)}),[L,I]);var Q=h.queue,B=h.agents,F=h.report,H=g.teams,k=g.services,_=g.teamServicesIndex,V=function(e,t,n,r){if(!t||0===t.length||0===e.length||0===r.length)return[];try{var c=K(t,e).sort((function(e,t){return e.AgentName<t.AgentName?-1:1}));return n?function(e,t){return e.forEach((function(e){var n=t.find((function(t){return t.AgentId===e.AgentId}));e.AgentFirstName=n.AgentFirstName})),e}(c,r.find((function(e){return"ALL TEAMS"===e.TeamName})).Profiles):c}catch(s){return console.log("a",e,"b",t,"c",n,"d",r),console.error("Wild AgentSorting error",s),[]}}(n,B,U,H),X=function(e,t,n,r){try{if(0===t.length||0===e.length||0===n.length)return[];var c=G(e,t,n);return r?function(e){var t=[];return e.forEach((function(e){var n,r={ServiceId:e.ServiceId,ServiceName:(n=e.ServiceName,n[0]),ContactType:e.ContactType,MaxQueueTime:e.MaxQueueTime,QueueLength:e.QueueLength};t.push(r)})),t}(c):c}catch(s){return console.error("QueueProfile error:",t,s),e}}(Q,m,H,U),q=function(e){return function(e,t,n){var r=function(e){window.localStorage.setItem("activeProfileId",e.toString()),n(e)};if(""!==e){if(t.includes(1))return 1===e?void r([]):void r([e]);r(1!==e?t.includes(e)?t.filter((function(t){return t!==e})):[].concat(Object(R.a)(t),[e]):[e])}else r([])}(e,m,v)};return Object(o.jsxs)("div",{id:"main",children:[Object(o.jsx)(M,{queue:X,activeAlarms:l,agents:V,censor:U}),Object(o.jsx)(re,{activeTeam:n,teams:H,changeTeam:function(e){return function(e,t,n,r){var c=function(e){window.localStorage.setItem("activeTeam",e.toString()),n(e)};if(""===e)return r(""),void c([]);if(t.includes("ALL TEAMS"))return"ALL TEAMS"===e?void c([]):void c([e]);c("ALL TEAMS"!==e?t.includes(e)?t.filter((function(t){return t!==e})):[].concat(Object(R.a)(t),[e]):[e])}(e,n,r,q)},activeProfileId:m,changeProfile:q,services:k,teamServicesIndex:_,censor:U,setCensor:function(){return D(!U)},report:F,connectionStatus:I,activeAlarms:l,setActiveAlarms:u})]})};c.a.render(Object(o.jsx)(je,{}),document.getElementById("root"))}],[[31,1,2]]]);
//# sourceMappingURL=main.6fee1244.chunk.js.map