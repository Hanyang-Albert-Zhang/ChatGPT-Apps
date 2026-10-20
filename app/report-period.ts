export function reportPeriod(date:string,range:number){
 const year=date.slice(0,4),start=range===365?year+'-01-01':new Date(Date.parse(date+'T12:00:00Z')-(range-1)*86400000).toISOString().slice(0,10),end=range===365?year+'-12-31':date;
 const days=Array.from({length:Math.round((Date.parse(end)-Date.parse(start))/86400000)+1},(_,i)=>new Date(Date.parse(start)+i*86400000).toISOString().slice(0,10));
 const buckets=range===365?Array.from({length:12},(_,i)=>year+'-'+String(i+1).padStart(2,'0')+'-01'):range===7?days:days.filter((_,i)=>i%7===0);
 const labels=buckets.map(d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',month:'short',...(range===365?{}:{day:'numeric'})}));
 return {start,end,days,buckets,labels,counts:(rows:any[],kind:string)=>buckets.map((d,i)=>rows.filter(r=>r.kind===kind&&r.date>=d&&r.date<(buckets[i+1]||new Date(Date.parse(end)+86400000).toISOString().slice(0,10))).length),values:(rows:any[],kind:string,key:string)=>buckets.map((d,i)=>rows.filter(r=>r.kind===kind&&r.date>=d&&r.date<(buckets[i+1]||new Date(Date.parse(end)+86400000).toISOString().slice(0,10))).reduce((s,r)=>s+(Number(r.payload[key])||0),0))};
}
