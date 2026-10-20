
import {Profile,calorieTarget,dailyTarget,dayPlan,exercises} from './fitness';import {weightLoad} from './trophy-stats';import {movementType} from './workout-utils';
export function strengthMinutes(p:any){const minutes=Number(p.minutes);return movementType(p)==='strength'&&Number.isFinite(minutes)?Math.max(0,minutes):0;}
export function liftedVolume(p:any){return movementType(p)==='strength'?weightLoad(p)*Math.max(0,Number(p.sets)||0)*Math.max(0,Number(p.reps)||0):0;}
export function dailyReportTargets(profile:Profile|null,date:string){
 let calories:number|null=null,protein:number|null=null,fiber:number|null=null,volume:number|null=null,strength:number|null=null;
 if(profile){const estimated=calorieTarget(profile).target,goal=Number(profile.target)||estimated;if(goal>0)calories=dailyTarget({...profile,target:goal},date);if(profile.weight>0)protein=profile.weight*1.2;if(profile.age>=18)fiber=profile.sex==='male'?(profile.age<=50?38:30):(profile.age<=50?25:21);
 if(profile.start&&date>=profile.start)strength=dayPlan(profile,date).prescriptions.filter(p=>['strength','hold'].includes(exercises[p.id].type)).reduce((sum,p)=>sum+p.minutes,0);
 if(profile.baseWeight>0&&profile.start&&date>=profile.start){volume=dayPlan(profile,date).prescriptions.reduce((sum,p)=>{const name=exercises[p.id].name;if(!p.kg||!p.reps)return sum;const single=/single|one.arm|goblet|kettlebell|concentration/i.test(name);return sum+p.sets*p.reps*p.kg*2.2046226218*(single?1:2);},0);}
 }
 return {calories,protein,fiber,minutes:150/7,volume,strength};
}
export function reportTargets(profile:Profile|null,period:{days:string[];buckets:string[];end:string}){
 const rows=period.days.map(date=>({date,...dailyReportTargets(profile,date)}));
 const sum=(key:'calories'|'protein'|'fiber'|'minutes'|'volume'|'strength')=>period.buckets.map((start,i)=>{const end=period.buckets[i+1]||new Date(Date.parse(period.end)+86400000).toISOString().slice(0,10),group=rows.filter(r=>r.date>=start&&r.date<end);return group.length&&group.every(r=>r[key]!==null)?group.reduce((s,r)=>s+r[key]!,0):null;});
 return {calories:sum('calories'),protein:sum('protein'),fiber:sum('fiber'),minutes:sum('minutes'),volume:sum('volume'),strength:sum('strength')};
}

export function strengthTrainingDays(rows:any[]){return new Set(rows.filter(r=>r.kind==='workout'&&movementType(r.payload)==='strength').map(r=>r.date)).size;}
