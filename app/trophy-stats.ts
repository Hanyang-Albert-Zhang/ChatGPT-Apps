import {isCardioWorkout} from './challenges';
type Row={kind:string;date:string;payload:any};
const positive=(v:any)=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
export function easternDay(time:number){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(time);}
export function weightLoad(p:any){
 if(p.weightScope==='bodyWeight')return 0;
 const perHand=p.weightScope==='perHand'||(!p.weightScope&&/dumbbell/i.test(p.name||'')&&!/single|one.arm|goblet/i.test(p.name||''));
 return positive(p.weight)*(p.weightUnit==='kg'?2.2046226218:1)*(perHand?2:1);
}
export function trophyStats(rows:Row[],today=easternDay(Date.now())){
 const result={minutes:0,runningMiles:0,heaviestLoad:0,todayMiles:0,todayVolume:0,runWalkMiles:0,cardioMiles:0,prs:{bench:0,squat:0,deadlift:0},totalStrength:0};
 for(const r of rows){if(r.kind!=='workout')continue;const p=r.payload||{},name=String(p.name||'');
 const cardio=p.movementType!=='strength';
 const run=cardio&&(p.cardioType==='run'||(!p.cardioType&&/\b(run|running|jog|jogging)\b/i.test(name)));
 const walk=cardio&&(p.cardioType==='walk'||(!p.cardioType&&/\b(walk|walking)\b/i.test(name)));
 const strength=p.movementType==='strength'||(!p.movementType&&!/\b(run|running|jog|jogging|walk|walking|bike|cycling|rowing|elliptical)\b/i.test(name));
 result.minutes+=positive(p.minutes);if(isCardioWorkout(p))result.cardioMiles+=positive(p.miles);if(run)result.runningMiles+=positive(p.miles);if(run||walk)result.runWalkMiles+=positive(p.miles);
 if(r.date===today&&(run||walk))result.todayMiles+=positive(p.miles);
 if(strength){const load=weightLoad(p);result.heaviestLoad=Math.max(result.heaviestLoad,load);if(/\b(?:bench|chest)[ -]*press\b/i.test(name))result.prs.bench=Math.max(result.prs.bench,load);if(/\bsquats?\b/i.test(name))result.prs.squat=Math.max(result.prs.squat,load);if(/\bdead[ -]?lifts?\b/i.test(name))result.prs.deadlift=Math.max(result.prs.deadlift,load);if(r.date===today)result.todayVolume+=load*positive(p.sets)*positive(p.reps);}
 }result.totalStrength=result.prs.bench+result.prs.squat+result.prs.deadlift;return result;
}
export const statNumber=(n:number)=>n.toLocaleString('en-US',{maximumFractionDigits:1});
