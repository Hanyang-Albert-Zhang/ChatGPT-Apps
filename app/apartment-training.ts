import type {Profile} from './fitness';
import {exerciseKey,TrainingExercise} from './exercise-library';
import additions from './apartment-exercises.json';

// Seven disjoint daily slots. The same slot returns only after seven days,
// including across a week/month boundary, goal changes and unload weeks.
export const mobilityRotation=[
 ['Shoulder circles','Hip circles','Walking knee hugs'],
 ['Leg swings','Thoracic rotation','Ankle circles'],
 ['Wall slide','Adductor rock-back','Wrist circles'],
 ['World’s greatest stretch','Scapular push-up','Standing hip abduction'],
 ['Cat–cow','Dynamic hamstring sweep','Standing trunk side bend'],
 ['Hip flexor mobility','Seated trunk rotation','Standing quadriceps mobilization'],
 ['Chest opener','Seated hamstring mobility','Supported heel-to-toe walk']
];
export const warmRotation=['Treadmill warm-up','Rowing machine warm-up','Elliptical trainer warm-up','Stairmaster warm-up','Gentle marching','Standing punch interval','Step jack'];
export const coreRotation=[['Dead bug','Cable Pallof press'],['Bird dog','Reverse crunch'],['Plank','Cable wood chop'],['Side plank','Supine heel tap'],['Dumbbell suitcase hold','Bent-knee fallout'],['Bear hover','Standing cable lift'],['Seated knee tuck','Modified curl-up']];
const reserved=new Set([...mobilityRotation.flat(),...warmRotation,...coreRotation.flat()].map(exerciseKey));
const mainNames=[
 'Dumbbell bench press','Incline dumbbell press','Dumbbell chest fly','Dumbbell row','Bodyweight squat','Reverse lunge','Push-up',
 'Dumbbell biceps curl','Hammer curl','Dumbbell overhead press','Dumbbell lateral raise','Dumbbell triceps kickback','Overhead triceps extension',
 'Dumbbell Romanian deadlift','Goblet squat','Glute bridge','Standing calf raise','Dumbbell thruster','Farmer carry',
 'Dumbbell floor press','Incline push-up','Dumbbell squeeze press','Alternating dumbbell curl','Concentration curl','Incline dumbbell curl','Seated dumbbell curl',
 'Chest-supported dumbbell row','Bent-over two-dumbbell row','Dumbbell reverse fly','Prone Y raise','Dumbbell pullover','Lying dumbbell triceps extension',
 'Close-grip incline push-up','Seated dumbbell shoulder press','Dumbbell front raise','Dumbbell shrug','Dumbbell split squat','Walking dumbbell lunge',
 'Lateral lunge','Single-leg Romanian deadlift','Sumo goblet squat','Single-leg glute bridge','Side-lying hip abduction','Wall sit',
 'Bodyweight good morning','Alternating reverse lunge to knee drive','Dumbbell squat to calf raise','Lateral step-over',
 'Dumbbell deadlift','Dumbbell suitcase carry','Cable standing row','Cable chest press','Cable fly','Cable triceps pressdown','Cable biceps curl',
 'Cable face pull','Half-kneeling cable pulldown','Cable pull-through','Cable split-stance press','Incline cable lateral raise',
 'Treadmill run / walk','Rowing machine intervals','Elliptical intervals','Stairmaster steady climb'
];
const allowed=new Set([...mainNames,...reserved,...additions.map(e=>e.name)].map(exerciseKey));
export function apartmentCompatible(e:{name:string;equipment?:string}){
 const text=exerciseKey(e.name+' '+(e.equipment||''));
 if(/\b(barbell|smith|kettlebell|sled|ski erg|wall ball|medicine ball|box|bosu|trx|band|jump|plyometric|bike|cycling|leg press|leg curl machine)\b/.test(text))return false;
 return allowed.has(exerciseKey(e.name));
}
export const apartmentEquipment='Apartment gym: dumbbells 5–50 lb per hand, bench, treadmill, elliptical, rower, Stairmaster and Inspire Fitness FTX cables.';
export const apartmentPurpose={
 'HYROX conditioning':'Indoor HYROX-inspired conditioning adapted to this gym: treadmill, rower, dumbbell carries, lunges and cable stations. Cable and dumbbell substitutions do not replicate race sleds, ski erg or wall balls.',
 '1RM strength practice':'Submaximal dumbbell press, squat and hinge practice within 5–50 lb per hand. This apartment route builds strength technique; it does not test or estimate a barbell one-repetition maximum.'
};
const replacements:Record<string,string>={
 'Rowing machine warm-up':'Rowing machine intervals','Elliptical trainer warm-up':'Elliptical intervals','Treadmill warm-up':'Treadmill run / walk','Stairmaster warm-up':'Stairmaster steady climb','Run / walk':'Treadmill run / walk','Brisk walk':'Treadmill run / walk','Stationary cycling':'Elliptical intervals','Ski ergometer':'Half-kneeling cable pulldown',
 'Sled push':'Cable split-stance press','Sled pull':'Cable standing row','Wall ball squat throw':'Dumbbell thruster',
 'Barbell bench press':'Dumbbell bench press','Barbell back squat':'Goblet squat','Barbell deadlift':'Dumbbell deadlift',
 'Kettlebell deadlift':'Dumbbell deadlift','Kettlebell sumo deadlift':'Dumbbell deadlift','Kettlebell suitcase carry':'Dumbbell suitcase carry','Step-up':'Reverse lunge',
 'High knees':'Elliptical intervals','Jumping jacks':'Stairmaster steady climb','Mountain climber':'Cable split-stance press'
};
const titles:Record<string,string>={'Run and ski stations':'Treadmill and cable stations','Sled and lunge strength':'Cable and lunge strength','Run and row stations':'Treadmill and row stations','Cycling intervals':'Elliptical intervals','Bench press practice':'Dumbbell press practice','Squat practice':'Dumbbell squat practice','Deadlift practice':'Dumbbell hinge practice'};
export function apartmentPlan(p:Profile,date:string,all:TrainingExercise[],original:ReturnType<typeof import('./training-program').createDayPlan>){
 const day=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7,goal=p.training,recovery=original.recovery,deload=original.deload,strength=['Maximal strength','1RM strength practice'].includes(goal);
 const id=(name:string)=>{const i=all.findIndex(e=>exerciseKey(e.name)===exerciseKey(name));if(i<0)throw Error('Missing apartment exercise '+name);return i;};
 const preparation=[...mobilityRotation[day],warmRotation[day]].map(id),core=coreRotation[day].map(id),used=new Set([...preparation,...core]);
 const eligible=mainNames.map(id).filter(i=>!reserved.has(exerciseKey(all[i].name))&&(!strength||['strength','hold'].includes(all[i].type)));
 const primary:number[]=[];
 const append=(i:number)=>{if(!used.has(i)){primary.push(i);used.add(i);return true;}return false;};
 const fill=(group:string,seed:number)=>{const pool=eligible.filter(i=>!used.has(i)&&(!recovery||all[i].type!=='interval')),match=pool.filter(i=>all[i].group===group),options=match.length?match:pool;return options.length?append(options[((seed%options.length)+options.length)%options.length]):false;};
 if(recovery){['Bodyweight good morning','Side-lying hip abduction','Single-leg glute bridge'].forEach(n=>append(id(n)));}
 else{
  for(const old of original.primary as number[]){const e=all[old],name=replacements[e.name]||e.name,i=id(name);if(eligible.includes(i))append(i);else fill(e.group,old+day+original.week*3);}
  // FTX work is part of the regular route, rather than only a search result.
  const cable=(goal==='Muscular hypertrophy'||goal==='Stabilization & muscular endurance')?['Cable chest press','Cable standing row','Cable face pull','Cable fly','Cable triceps pressdown','Incline cable lateral raise'][day]:goal==='Weight management'?['Cable standing row','Cable split-stance press','Cable chest press','Cable pull-through','Cable biceps curl','Cable triceps pressdown'][day]:null;
  if(cable&&!primary.includes(id(cable))){used.delete(primary[primary.length-1]);primary[primary.length-1]=id(cable);used.add(id(cable));}
  const target=original.mainCount;for(let i=0;primary.length<target&&i<100;i++)fill('',day*7+original.week*13+i);
 }
 const minutes=original.minutes,dynamic=3,warmMinutes=recovery?3:minutes>=75?8:5,cool=3,coreMinutes=recovery?3:minutes===30?2:minutes>=75?6:4,main=minutes-dynamic-warmMinutes-cool,primaryMinutes=main-coreMinutes;
 const runId=id('Treadmill run / walk'),runIndex=primary.indexOf(runId),runMinutes=runIndex>=0?(original.runMode?primaryMinutes*(day===5?.7:.6):Math.min(10,primaryMinutes*.25)):0,nonRun=primary.filter(i=>i!==runId),otherMinutes=primaryMinutes-runMinutes;
 // Existing profile values may exceed the available dumbbell rack. Never
 // rewrite the profile; cap only the plan and log prefill. Zero means user choice.
 const raw=Number(original.kg||0),load=raw>0?Math.max(5,Math.min(50,Math.floor(raw*2.2046226218/5)*5))/2.2046226218:0;
 const rest=strength?(deload?90:150):deload?60:original.prescriptions[0]?.rest||60,reps=strength?(deload?6:4):original.reps,sets=recovery||deload?1:original.sets;
 const prescriptions=[...preparation,...primary,...core].map(i=>{const e=all[i],section=preparation.includes(i)?'preparation':core.includes(i)?'core':'main',time=section==='preparation'?(i===preparation[3]?warmMinutes:1):section==='core'?coreMinutes/2:i===runId?runMinutes:otherMinutes/nonRun.length,dumbbell=/dumbbell|goblet|farmer|hammer curl|concentration curl/i.test(e.name),kg=dumbbell&&section==='main'?load:0,intervalMain=section==='main'&&goal==='HIIT conditioning'&&[0,3].includes(day)&&!deload&&e.type==='cardio';
  return {id:i,section,minutes:time,sets:e.type==='strength'?Math.max(1,Math.min(sets,Math.floor((time*60+rest)/(reps*3+rest+15)))):1,reps:e.type==='strength'?reps:0,seconds:e.type==='hold'?20:e.type==='interval'||intervalMain?20:0,rest,kg,miles:i===runId?Math.min(original.miles||0,Math.floor(runMinutes/(Number(p.runPace)||12)*10)/10):0,
   note:section==='preparation'?'Easy preparation; stay comfortable and leave energy for the main session.':section==='core'?'Brace gently and keep breathing. Shorten the set before form changes.':recovery?'Optional easy recovery. Use body weight and a comfortable range.':deload?'Unload week: use lighter resistance, fewer sets and an easy pace.':/Cable|cable/.test(e.name)?'FTX: secure the pulley height and handles before starting. Choose the stack setting yourself; cable resistance is not a per-hand dumbbell weight.':strength?'Submaximal technique work; stop with two repetitions in reserve. Do not test a maximum.':(e.type==='interval'||intervalMain)?'Controlled intervals: 20 seconds work, 40 seconds easy. Reduce speed before form changes.':'Use controlled repetitions and leave about two repetitions in reserve.'};
 });
 const purpose=(apartmentPurpose as Record<string,string>)[goal]||original.purpose;
 return {...original,title:titles[original.title]||original.title,purpose,preparation,primary,core,ids:[...preparation,...primary,...core],prescriptions,mainCount:primary.length,dynamic,warmMinutes,coreMinutes,main,primaryMinutes,reps,sets,kg:load,miles:prescriptions.reduce((n,s)=>n+s.miles,0)};
}

