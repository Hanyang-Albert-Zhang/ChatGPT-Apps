
export const measurementKeys=['shoulder','chest','waist','hip'] as const;
export type MeasurementKey=typeof measurementKeys[number];
export function measurementWeek(now=new Date()){const key=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);const d=new Date(key+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
export function nextMeasurementWeek(week:string){const d=new Date(week+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+7);return d.toISOString().slice(0,10);}
export function measurementTrend(values:{week:string;value:number}[]){const sorted=[...values].sort((a,b)=>a.week.localeCompare(b.week));if(sorted.length<2)return null;const first=sorted[0],last=sorted.at(-1)!,x=sorted.map(v=>(Date.parse(v.week)-Date.parse(first.week))/604800000),y=sorted.map(v=>v.value),mean=(v:number[])=>v.reduce((a,b)=>a+b,0)/v.length,mx=mean(x),my=mean(y),den=x.reduce((a,v)=>a+(v-mx)**2,0),slope=den?x.reduce((a,v,i)=>a+(v-mx)*(y[i]-my),0)/den:0;return {change:last.value-first.value,percent:100*(last.value-first.value)/first.value,slope,first,last};}
