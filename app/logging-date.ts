export function easternDate(value:Date|number=new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);}
export function validLogDate(value:string,today=easternDate()) {if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const parsed=new Date(value+'T12:00:00Z');return Number.isFinite(+parsed)&&parsed.toISOString().slice(0,10)===value&&value<=today;}
export function entryLogXp(entry:{date:string;payload:any}) {if(entry.payload?._planId)return 20;const loggedAt=entry.payload?._loggedAt;if(typeof loggedAt!=='number'||!Number.isFinite(loggedAt))return 20;return entry.date<easternDate(loggedAt)?10:20;}

