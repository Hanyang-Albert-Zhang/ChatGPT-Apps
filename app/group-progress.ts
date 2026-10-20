import {isCardioWorkout} from './challenges';
import {groupChallengeTemplates} from './group-challenge-templates';
import {easternDay} from './trophy-stats';
import {movementType} from './workout-utils';
const n=(v:any)=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
export function groupProgress(templateId:string,rows:any[],startsAt:number,endsAt:number){
 const t=groupChallengeTemplates.find(t=>t.id===templateId)!;
 const submitted=(r:any)=>n(r.kind==='dailyWeight'?r.payload.loggedAt:r.payload._loggedAt),updated=(r:any)=>r.kind==='dailyWeight'?submitted(r):Math.max(n(r.payload._updatedAt),submitted(r));
 const logs=rows.filter(r=>['meal','workout','dailyWeight'].includes(r.kind)&&submitted(r)>=startsAt&&submitted(r)<endsAt&&updated(r)<endsAt).sort((a,b)=>updated(a)-updated(b)||a.id.localeCompare(b.id));
 let value=0,completedAt:number|null=null;const days=new Set<string>(),names=new Set<string>(),fibers=new Map<string,number>(),big3={bench:0,squat:0,deadlift:0},balanced=new Map<string,Set<string>>();
 for(const r of logs){const p=r.payload,time=updated(r),day=easternDay(submitted(r)),name=String(p.name||'').toLowerCase(),cardio=movementType(p)==='cardio',run=cardio&&(p.cardioType==='run'||(!p.cardioType&&/\b(run|running|jog|jogging)\b/.test(name))),walk=cardio&&(p.cardioType==='walk'||(!p.cardioType&&/\b(walk|walking)\b/.test(name))),bike=cardio&&(p.cardioType==='indoor-bike'||p.cardioType==='bike'||(!p.cardioType&&/bike|cycling/.test(name)));
 switch(t.metric){
 case 'cardioMiles':if(r.kind==='workout'&&isCardioWorkout(p))value+=n(p.miles);break;
 case 'floors':if(r.kind==='workout'&&cardio&&p.cardioType==='stairmaster')value+=n(p.floors);break;
 case 'weightDays':if(r.kind==='dailyWeight'&&n(p.weightKg)>0)days.add(day);value=days.size;break;
 case 'runMiles':if(r.kind==='workout'&&run)value+=n(p.miles);break;
 case 'walkMiles':if(r.kind==='workout'&&walk)value+=n(p.miles);break;
 case 'runWalkMiles':if(r.kind==='workout'&&(run||walk))value+=n(p.miles);break;
 case 'bikeMiles':if(r.kind==='workout'&&bike)value+=n(p.miles);break;
 case 'minutes':if(r.kind==='workout')value+=n(p.minutes);break;
 case 'sets':if(r.kind==='workout'&&!cardio)value+=n(p.sets);break;
 case 'workoutDays':if(r.kind==='workout')days.add(day);value=days.size;break;
 case 'foodDays':if(r.kind==='meal')days.add(day);value=days.size;break;
 case 'proteinDays':if(r.kind==='meal'&&n(p.protein)>0)days.add(day);value=days.size;break;
 case 'mealCount':if(r.kind==='meal')value++;break;
 case 'fiberTotal':if(r.kind==='meal')value+=n(p.fiber);break;
 case 'foodVariety':if(r.kind==='meal')names.add(name.trim());value=names.size;break;
 case 'variety':if(r.kind==='workout')names.add(name.trim());value=names.size;break;
 case 'balancedDays':{if(r.kind==='dailyWeight')break;const kinds=balanced.get(day)||new Set<string>();kinds.add(r.kind);balanced.set(day,kinds);value=[...balanced.values()].filter(k=>k.size===2).length;break;}
 case 'fiberStreak':if(r.kind==='meal')fibers.set(day,(fibers.get(day)||0)+n(p.fiber));{let streak=0,best=0,last='';for(const [d,f] of [...fibers].sort(([a],[b])=>a.localeCompare(b))){streak=f>=25?(last&&Date.parse(d)-Date.parse(last)===86400000?streak+1:1):0;best=Math.max(best,streak);last=d;}value=best;}break;
 case 'big3Reps':if(r.kind==='workout'&&!cardio){const reps=n(p.sets)*n(p.reps);if(/\b(?:bench|chest)[ -]*press\b/.test(name))big3.bench+=reps;if(/\bsquats?\b/.test(name))big3.squat+=reps;if(/\bdead[ -]?lifts?\b/.test(name))big3.deadlift+=reps;}value=Math.min(big3.bench,big3.squat,big3.deadlift);break;
 }
 if(value+1e-8>=t.target&&completedAt===null)completedAt=time;
 }return {value:Math.round(value*100)/100,completedAt,hasProgress:value>0||(t.metric==='big3Reps'&&Object.values(big3).some(v=>v>0)),breakdown:t.metric==='big3Reps'?big3:undefined};
}
