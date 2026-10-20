export type ChallengeRow={kind:string;date:string;payload:any};
export const badgeRewards=[300,1000,3000,10000,30000] as const;
const definitions=[
 ['first-miles','First Five','Cardio distance',1,'miles',5,'Log 5 cumulative cardio miles.'],
 ['hundred-miler','Hundred Miler','Cardio distance',2,'miles',100,'Log 100 cumulative cardio miles.'],
 ['five-hundred-miler','Five Hundred Miler','Cardio distance',3,'miles',500,'Log 500 cumulative cardio miles.'],
 ['thousand-miler','Thousand Miler','Cardio distance',4,'miles',1000,'Log 1,000 cumulative cardio miles.'],
 ['distance-legend','Distance Legend','Cardio distance',5,'miles',5000,'Log 5,000 cumulative cardio miles.'],
 ['perfect-exercise-week','Perfect Exercise Week','Exercise consistency',1,'workoutStreak',7,'Log a workout on 7 consecutive dates. Recovery sessions count.'],
 ['exercise-fortnight','Exercise Fortnight','Exercise consistency',2,'workoutStreak',14,'Log a workout on 14 consecutive dates. Recovery sessions count.'],
 ['exercise-month','Exercise Month','Exercise consistency',3,'workoutStreak',30,'Log a workout on 30 consecutive dates. Recovery sessions count.'],
 ['exercise-season','Exercise Season','Exercise consistency',4,'workoutStreak',90,'Log a workout on 90 consecutive dates. Recovery sessions count.'],
 ['exercise-year','Year of Movement','Exercise consistency',5,'workoutStreak',365,'Log a workout on 365 consecutive dates. Recovery sessions count.'],
 ['food-week','Mindful Food Week','Food consistency',1,'foodStreak',7,'Log at least one food entry on 7 consecutive dates.'],
 ['food-fortnight','Food Fortnight','Food consistency',2,'foodStreak',14,'Log at least one food entry on 14 consecutive dates.'],
 ['food-month','Mindful Food Month','Food consistency',3,'foodStreak',30,'Log at least one food entry on 30 consecutive dates.'],
 ['food-season','Mindful Food Season','Food consistency',4,'foodStreak',90,'Log at least one food entry on 90 consecutive dates.'],
 ['food-year','Year of Mindful Meals','Food consistency',5,'foodStreak',365,'Log at least one food entry on 365 consecutive dates.'],
 ['movement-explorer','Movement Explorer','Exercise variety',1,'variety',5,'Log 5 different named exercises or workouts.'],
 ['movement-adventurer','Movement Adventurer','Exercise variety',2,'variety',10,'Log 10 different named exercises or workouts.'],
 ['movement-collector','Movement Collector','Exercise variety',3,'variety',25,'Log 25 different named exercises or workouts.'],
 ['movement-master','Movement Master','Exercise variety',4,'variety',50,'Log 50 different named exercises or workouts.'],
 ['movement-legend','Movement Legend','Exercise variety',5,'variety',75,'Log 75 different named exercises or workouts.'],
 ['first-workout','First Workout','Workout milestones',1,'workoutDays',1,'Log your first workout.'],
 ['first-food','First Food Entry','Food milestones',1,'foodDays',1,'Log your first food entry.'],
 ['three-workout-days','Getting Moving','Workout milestones',1,'workoutDays',3,'Log workouts on 3 distinct dates.'],
 ['ten-workout-days','Ten Days Strong','Workout milestones',1,'workoutDays',10,'Log workouts on 10 distinct dates.'],
 ['three-food-days','Diary Starter','Food milestones',1,'foodDays',3,'Log food on 3 distinct dates.'],
 ['ten-food-days','Mindful Ten','Food milestones',1,'foodDays',10,'Log food on 10 distinct dates.'],
 ['thirty-minutes','Time to Move','Training time',1,'minutes',30,'Log 30 cumulative workout minutes.'],
 ['sixty-minutes','First Hour','Training time',1,'minutes',60,'Log 60 cumulative workout minutes.'],
 ['one-fifty-minutes','Building Momentum','Training time',1,'minutes',150,'Log 150 cumulative workout minutes.'],
 ['ten-sets','Strength Starter','Strength',1,'sets',10,'Log 10 cumulative strength sets.'],
 ['twenty-five-sets','Set Builder','Strength',1,'sets',25,'Log 25 cumulative strength sets.'],
 ['three-run-days','Cardio Regular','Cardio distance',1,'cardioDays',3,'Log cardio workouts on 3 distinct dates.'],
 ['walking-start','Walk This Way','Walking',1,'walkMinutes',30,'Log 30 cumulative walking minutes.'],
 ['cycling-start','Pedal Power','Cycling',1,'bikeMinutes',30,'Log 30 cumulative cycling minutes.'],
 ['recovery-start','Recovery Matters','Recovery',1,'recoveryDays',3,'Log recovery, mobility, stretching or yoga on 3 distinct dates.'],
 ['balanced-start','Better Together','Daily balance',1,'balancedDays',3,'Log both food and a workout on 3 distinct dates.'],
 ['workout-twenty-five','Quarter Century','Workout milestones',2,'workoutDays',25,'Log workouts on 25 distinct dates.'],
 ['food-twenty-five','Diary Devotee','Food milestones',2,'foodDays',25,'Log food on 25 distinct dates.'],
 ['five-hundred-minutes','Time Investor','Training time',2,'minutes',500,'Log 500 cumulative workout minutes.'],
 ['hundred-sets','Century of Sets','Strength',2,'sets',100,'Log 100 cumulative strength sets.'],
 ['monthly-twenty-five','Monthly Mile Maker','Cardio distance',2,'monthlyMiles',25,'Log 25 cardio miles within one Eastern-time calendar month.'],
 ['balanced-fourteen','Balanced Fortnight','Daily balance',2,'balancedDays',14,'Log both food and a workout on 14 distinct dates; they need not be consecutive.'],
 ['workout-hundred','Hundred Active Days','Workout milestones',3,'workoutDays',100,'Log workouts on 100 distinct dates.'],
 ['food-hundred','Hundred Mindful Days','Food milestones',3,'foodDays',100,'Log food on 100 distinct dates.'],
 ['twenty-five-hundred-minutes','Hours of Dedication','Training time',3,'minutes',2500,'Log 2,500 cumulative workout minutes.'],
 ['five-hundred-sets','Iron Commitment','Strength',3,'sets',500,'Log 500 cumulative strength sets.'],
 ['monthly-fifty','Monthly Road Warrior','Cardio distance',3,'monthlyMiles',50,'Log 50 cardio miles within one Eastern-time calendar month.'],
 ['balanced-sixty','Balanced Journey','Daily balance',3,'balancedDays',60,'Log both food and a workout on 60 distinct dates; they need not be consecutive.'],
 ['ten-thousand-minutes','Time Champion','Training time',4,'minutes',10000,'Log 10,000 cumulative workout minutes.'],
 ['fifty-thousand-minutes','Lifetime Momentum','Training time',5,'minutes',50000,'Log 50,000 cumulative workout minutes.'],
 ...([1,7,30,90,365] as const).flatMap((target,i)=>[
 ['weight-count-'+target,['First Weigh-in','Seven Check-ins','Thirty Check-ins','Ninety Check-ins','365 Check-ins'][i],'Weight check-ins',i+1,'weightEntries',target,'Record '+target+' daily weight check-in'+(target===1?'':'s')+'. One check-in per date counts.'],
 ['meal-count-'+target,['First Meal Log','Seven Meal Logs','Thirty Meal Logs','Ninety Meal Logs','365 Meal Logs'][i],'Food entry count',i+1,'foodEntries',target,'Save '+target+' food entr'+(target===1?'y':'ies')+'. Separate meal entries count; dates need not be consecutive.'],
 ['workout-count-'+target,['First Exercise Log','Seven Exercise Logs','Thirty Exercise Logs','Ninety Exercise Logs','365 Exercise Logs'][i],'Workout entry count',i+1,'workoutEntries',target,'Save '+target+' workout entr'+(target===1?'y':'ies')+'. Separate workout entries count; dates need not be consecutive.'],
 ['weight-streak-'+[7,14,30,90,365][i],['Weight Week','Weight Fortnight','Weight Month','Weight Season','Weight Year'][i],'Weight consistency',i+1,'weightStreak',[7,14,30,90,365][i],'Record weight on '+[7,14,30,90,365][i]+' consecutive dates.']
 ] as const),
] as const;
export const challengeDefinitions=definitions.map(([id,name,category,level,metric,target,description],artIndex)=>({id,name,category,level,metric,target,description,artIndex,xp:badgeRewards[level-1]}));
export const metricLabels:Record<string,string>={miles:'cardio miles',monthlyMiles:'cardio miles (best month)',workoutStreak:'consecutive workout dates (best streak)',foodStreak:'consecutive food dates (best streak)',variety:'different moves',workoutDays:'workout dates',foodDays:'food dates',minutes:'workout minutes',sets:'strength sets',cardioDays:'cardio dates',weightEntries:'weight check-ins',foodEntries:'food entries',workoutEntries:'workout entries',weightStreak:'consecutive weight dates (best streak)',walkMinutes:'walking minutes',bikeMinutes:'cycling minutes',recoveryDays:'recovery dates',balancedDays:'dates with both logs'};
export function isRunningWorkout(name:string){return /\b(run|running|jog|jogging|marathon)\b/i.test(name)&&! /\b(walk|walking|bike|cycling|swim|swimming|elliptical)\b/i.test(name);}
export function isCardioWorkout(p:any){if(p.movementType==='strength')return false;if(p.movementType==='cardio'||['run','walk','indoor-bike','bike','stairmaster','rowing','elliptical'].includes(p.cardioType))return true;return /\b(run|running|jog|jogging|walk|walking|hike|hiking|bike|biking|cycling|cycle|stairmaster|stairs|elliptical|elliptor|rowing|swim|swimming)\b/i.test(String(p.name||''))||/跑|走|步行|楼梯|椭圆|骑行|游泳|划船/.test(String(p.name||''));}
function validDate(s:string){const time=Date.parse(s+'T12:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===s;}
export function challengesFor(rows:ChallengeRow[]){
 const days=new Map<string,ChallengeRow[]>();for(const r of rows){if(['meal','workout','dailyWeight','weightCheckIn'].includes(r.kind)&&validDate(r.date)){const d=days.get(r.date)||[];d.push(r);days.set(r.date,d);}}
 let weightEntries=0,foodEntries=0,workoutEntries=0,weightStreak=0,maxWeight=0,lastWeight='';
 let miles=0,foodStreak=0,workoutStreak=0,maxFood=0,maxWorkout=0,lastFood='',lastWorkout='',workoutDays=0,foodDays=0,minutes=0,sets=0,cardioDays=0,walkMinutes=0,bikeMinutes=0,recoveryDays=0,balancedDays=0,monthlyMiles=0;const months=new Map<string,number>(),variety=new Set<string>(),qualified=new Map<string,string>();
 const positive=(n:any)=>Number.isFinite(Number(n))&&Number(n)>0?Number(n):0;
 const values=()=>({weightEntries,foodEntries,workoutEntries,weightStreak:maxWeight,miles,workoutStreak:maxWorkout,foodStreak:maxFood,variety:variety.size,workoutDays,foodDays,minutes,sets,cardioDays,walkMinutes,bikeMinutes,recoveryDays,balancedDays,monthlyMiles});
 const consecutive=(a:string,b:string)=>!!a&&Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z')===86400000;
 for(const [date,logs] of [...days].sort(([a],[b])=>a.localeCompare(b))){
  const weight=logs.some(r=>r.kind==='weightCheckIn'||r.kind==='dailyWeight'&&positive(r.payload.weightKg));if(weight){weightEntries++;weightStreak=consecutive(lastWeight,date)?weightStreak+1:1;lastWeight=date;maxWeight=Math.max(maxWeight,weightStreak);}
  foodEntries+=logs.filter(r=>r.kind==='meal').length;workoutEntries+=logs.filter(r=>r.kind==='workout').length;
  const food=logs.some(r=>r.kind==='meal'),workout=logs.some(r=>r.kind==='workout');
  if(food){foodDays++;foodStreak=consecutive(lastFood,date)?foodStreak+1:1;lastFood=date;maxFood=Math.max(maxFood,foodStreak);}
  if(workout){workoutDays++;workoutStreak=consecutive(lastWorkout,date)?workoutStreak+1:1;lastWorkout=date;maxWorkout=Math.max(maxWorkout,workoutStreak);}
  if(food&&workout)balancedDays++;
  let ran=false,recovered=false;
  for(const r of logs.filter(r=>r.kind==='workout')){const p=r.payload,name=String(p.name||'').trim().replace(/\s+/g,' ').toLowerCase();if(name&&name!=='workout')variety.add(name);const duration=positive(p.minutes);minutes+=duration;if(p.movementType==='strength'||(!p.movementType&&positive(p.sets)))sets+=positive(p.sets);
   if(isCardioWorkout(p)){ran=true;const distance=positive(p.miles);miles+=distance;const month=date.slice(0,7),total=(months.get(month)||0)+distance;months.set(month,total);monthlyMiles=Math.max(monthlyMiles,total);}
   if(p.movementType!=='strength'&&(p.cardioType==='walk'||(!p.cardioType||p.cardioType==='other')&&/\b(walk|walking|hike|hiking)\b/.test(name)))walkMinutes+=duration;
   if(p.movementType!=='strength'&&(p.cardioType==='indoor-bike'||!p.cardioType&&/\b(bike|biking|cycling|cycle)\b/.test(name)))bikeMinutes+=duration;
   if(/\b(recovery|mobility|stretch|stretching|yoga)\b/.test(name))recovered=true;
  }
  if(ran)cardioDays++;if(recovered)recoveryDays++;
  const current=values();for(const b of challengeDefinitions){if(!qualified.has(b.id)&&current[b.metric]+1e-8>=b.target)qualified.set(b.id,date);}
 }
 const totals=values();
 const awards=new Map(rows.filter(r=>r.kind==='challengeBadge').map(r=>[r.payload.badgeId,r.payload]));
 return challengeDefinitions.map(b=>({...b,value:Math.round(totals[b.metric]*100)/100,progress:Math.min(100,totals[b.metric]/b.target*100),earned:qualified.has(b.id),qualifiedOn:qualified.get(b.id)||null,earnedOn:qualified.has(b.id)?awards.get(b.id)?.earnedOn||qualified.get(b.id):null}));
}
