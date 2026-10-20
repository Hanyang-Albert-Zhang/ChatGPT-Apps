import {entryLogXp} from './logging-date';
import {challengesFor} from './challenges';
export const rankBands = [
 ['Apprentice',[0,3000,4500],'#8a9b9c'],
 ['Challenger',[6000,12000,22000],'#ad7949'],
 ['Warrior',[34000,48000,60000],'#a97043'],
 ['Veteran',[72000,84000,96000],'#c69b35'],
 ['Elite',[118000,145000,178000],'#5caaa6'],
 ['Master',[216000,260000,309000],'#9168bc'],
 ['Champion',[364000,424000,490000],'#cba336'],
 ['Legend',[561000,638000,720000],'#b56c99'],
 ['Mystic',[808000,901000,1000000],'#716dcc'],
] as const;
export const divisions=['I','II','III'] as const;
export const tiers=rankBands.flatMap(([rank,thresholds,color],rankIndex)=>thresholds.map((xp,divisionIndex)=>({name:rank+' '+divisions[divisionIndex],rank,division:divisions[divisionIndex],rankIndex,divisionIndex,xp,color})));
export const peakStep=50000;
export function tierForLevel(level:number){if(level<=27)return {...tiers[Math.max(0,level-1)],peak:0};const peak=Math.max(1,Math.trunc(level)-27);return {name:'Peak '+peak,rank:'Peak',division:String(peak),rankIndex:9,divisionIndex:0,xp:1000000+peak*peakStep,color:'#716dcc',peak};}
export function progressionForXp(value:number){const xp=Number.isFinite(value)?Math.max(0,value):0,peak=xp>=1050000?Math.floor((xp-1000000)/peakStep):0,level=peak?27+peak:tiers.reduce((a,t,i)=>xp>=t.xp?i+1:a,1),tier=tierForLevel(level),next=tierForLevel(level+1);return {level,peak,levelLabel:peak?'Peak '+peak:'Level '+level,tier,next,progress:Math.max(0,Math.min(100,(xp-tier.xp)/(next.xp-tier.xp)*100))};}
export function journeyMilestones(xp:number){const current=progressionForXp(xp),levels=Array.from({length:37},(_,i)=>i+1);if(current.peak>10)levels.push(current.level,current.level+1);return [...new Set(levels)].map(level=>({...tierForLevel(level),level}));}
export function rewardsFor(rows:{kind:string;date:string;payload:any}[]){const days=new Map<string,{meal:number;workout:number}>();for(const r of rows){const d=days.get(r.date)||{meal:0,workout:0};if(r.kind==='meal')d.meal+=entryLogXp(r);if(r.kind==='workout')d.workout+=entryLogXp(r);days.set(r.date,d);}let mealXp=0,workoutXp=0;for(const d of days.values()){mealXp+=Math.min(200,d.meal);workoutXp+=Math.min(200,d.workout);}const badges=challengesFor(rows),badgeXp=badges.filter(b=>b.earned).reduce((s,b)=>s+b.xp,0);const groupXp=rows.filter(r=>r.kind==='groupChallengeAward').reduce((s,r)=>s+Math.max(0,Math.min(2000,Number(r.payload.xp)||0)),0);const leaderboardXp=rows.filter(r=>r.kind==='leaderboardAward').reduce((s,r)=>s+Math.max(0,Math.min(1000,Number(r.payload.xp)||0)),0);const xp=mealXp+workoutXp+badgeXp+groupXp+leaderboardXp;return{xp,...progressionForXp(xp),mealXp,workoutXp,badgeXp,groupXp,leaderboardXp,badges};}
