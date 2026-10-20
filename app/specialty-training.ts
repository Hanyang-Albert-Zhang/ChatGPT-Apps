import type {Profile} from './fitness';
import {exerciseKey,TrainingExercise} from './exercise-library';
export const specialtySpecs:Record<string,{purpose:string;reps:number;rest:number}>={
 'HYROX conditioning':{purpose:'Scaled running and functional stations inspired by the official HYROX format. Practice carries, sleds, rowing, lunges and wall balls across the week; this is not a full race simulation.',reps:10,rest:60},
 '1RM strength practice':{purpose:'Submaximal squat, bench press and deadlift practice for experienced lifters. Choose your own working load, use safeties and a spotter, and leave two repetitions in reserve. No automatic maximal attempts.',reps:3,rest:150},
 'HIIT conditioning':{purpose:'Two interval days alternate with easy aerobic work, strength and recovery. Work intervals are controlled, not all-out sprints. Build an aerobic base first and choose a low-impact option when needed.',reps:12,rest:60},
 'Mobility & balance':{purpose:'Controlled range of motion, supported balance, postural strength and comfortable walking. Use nearby support and progress movement control before resistance.',reps:10,rest:45}
};
const routes:Record<string,string[][]>={
 'HYROX conditioning':[
 ['Run / walk','Ski ergometer','Farmer carry','Goblet squat','Dumbbell row','Step-up'],
 ['Sled push','Sled pull','Walking dumbbell lunge','Dumbbell Romanian deadlift','Glute bridge','Standing calf raise'],
 ['Brisk walk','Chest-supported dumbbell row','Incline push-up','Kettlebell suitcase carry','Bodyweight squat','Bird dog'],
 ['Run / walk','Rowing machine intervals','Wall ball squat throw','Farmer carry','Walking dumbbell lunge','Step-up'],
 ['Ski ergometer','Goblet squat','Dumbbell bench press','Sled pull','Dumbbell row','Standing calf raise'],
 ['Run / walk','Rowing machine intervals','Farmer carry','Wall ball squat throw','Sled push','Walking dumbbell lunge']],
 '1RM strength practice':[
 ['Barbell bench press','Chest-supported dumbbell row','Dumbbell overhead press','Close-grip incline push-up','Dumbbell biceps curl','Dumbbell reverse fly'],
 ['Barbell back squat','Dumbbell Romanian deadlift','Step-up','Glute bridge','Standing calf raise','Dumbbell split squat'],
 ['Brisk walk','Thoracic rotation','Hip flexor mobility','Supported heel-to-toe walk','Ankle circles','Shoulder circles'],
 ['Barbell deadlift','Dumbbell row','Goblet squat','Farmer carry','Glute bridge','Standing calf raise'],
 ['Dumbbell floor press','Incline push-up','Chest-supported dumbbell row','Dumbbell lateral raise','Hammer curl','Bird dog'],
 ['Goblet squat','Single-leg Romanian deadlift','Glute bridge','Standing calf raise','Step-up','Wall sit']],
 'HIIT conditioning':[
 ['Stationary cycling','Step jack','Mountain climber','Standing punch interval','High knees','Lateral step-over'],
 ['Goblet squat','Dumbbell bench press','Dumbbell row','Dumbbell Romanian deadlift','Step-up','Standing calf raise'],
 ['Brisk walk','Hip flexor mobility','Thoracic rotation','Shoulder circles','Cat–cow','Ankle circles'],
 ['Rowing machine intervals','Lateral step-over','Step jack','Standing punch interval','Alternating reverse lunge to knee drive','Mountain climber'],
 ['Dumbbell floor press','Dumbbell split squat','Chest-supported dumbbell row','Glute bridge','Dumbbell lateral raise','Standing calf raise'],
 ['Stationary cycling','Brisk walk','Supported heel-to-toe walk','Hip circles','Seated hamstring mobility','Child’s pose breathing']],
 'Mobility & balance':[
 ['Supported heel-to-toe walk','Shoulder circles','Thoracic rotation','Bird dog','Glute bridge','Standing calf raise'],
 ['Step-up','Single-leg Romanian deadlift','Standing hip abduction','Hip flexor mobility','Ankle circles','Brisk walk'],
 ['Cat–cow','Chest opener','Dumbbell row','Incline push-up','Seated trunk rotation','Shoulder circles'],
 ['Brisk walk','Supported heel-to-toe walk','Leg swings','Walking knee hugs','Standing calf raise','Glute bridge'],
 ['Bodyweight good morning','Side-lying hip abduction','Bird dog','Step-up','Thoracic rotation','Chest opener'],
 ['Hip circles','Seated hamstring mobility','Ankle circles','Gentle marching','Supported heel-to-toe walk','Child’s pose breathing']]
};
const titles:Record<string,string[]>={
 'HYROX conditioning':['Run and ski stations','Sled and lunge strength','Easy hybrid technique','Run and row stations','Station strength and control','Scaled hybrid circuit','Recovery & mobility'],
 '1RM strength practice':['Bench press practice','Squat practice','Active recovery and bracing','Deadlift practice','Press technique and assistance','Lower-body assistance','Recovery & mobility'],
 'HIIT conditioning':['Cycling intervals','Strength between intervals','Easy aerobic recovery','Rowing intervals','Full-body support strength','Easy movement and mobility','Recovery & mobility'],
 'Mobility & balance':['Posture and supported balance','Hip and ankle control','Upper-body mobility','Walking and gait practice','Controlled full-body strength','Comfortable mobility flow','Recovery & mobility']
};
export function specialtyPlan(p:Profile,date:string,all:TrainingExercise[]){
 const day=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7,start=new Date(p.start+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
 const w=Math.max(0,Math.floor((Date.parse(date+'T12:00:00Z')-+start)/604800000)),deload=w%4===3,recovery=day===6,strength=p.training==='1RM strength practice',hiit=p.training==='HIIT conditioning',hyrox=p.training==='HYROX conditioning',mobility=p.training==='Mobility & balance',intervalDay=hiit&&[0,3].includes(day)&&!deload,spec=specialtySpecs[p.training],minutes=recovery?Math.min(p.duration,45):p.duration;
 const id=(name:string)=>{const found=all.findIndex(e=>exerciseKey(e.name)===exerciseKey(name));if(found<0)throw Error('Missing specialty exercise '+name);return found;};
 let names=recovery?['Shoulder circles','Cat–cow','Ankle circles','Hip flexor mobility','Thoracic rotation','Child’s pose breathing']:routes[p.training][day];
 if(deload&&!recovery){const gentle:Record<string,string[]>={
 'HYROX conditioning':['Brisk walk','Goblet squat','Kettlebell suitcase carry','Incline push-up','Glute bridge','Thoracic rotation'],
 '1RM strength practice':['Dumbbell floor press','Bodyweight squat','Kettlebell deadlift','Chest-supported dumbbell row','Glute bridge','Bird dog'],
 'HIIT conditioning':['Brisk walk','Stationary cycling','Step jack','Glute bridge','Shoulder circles','Hip flexor mobility'],
 'Mobility & balance':['Gentle marching','Chest opener','Seated trunk rotation','Ankle circles','Hip circles','Supported heel-to-toe walk']};names=gentle[p.training];}
 const count=recovery?6:Math.min(names.length,minutes<=30?3:minutes<=45?4:minutes<=60?5:6),primary=[...new Set(names.slice(0,count).map(id))],preparation=recovery?[]:['Shoulder circles','Hip circles','Walking knee hugs','Treadmill warm-up'].filter(n=>!primary.includes(id(n))).map(id),core=recovery?[]:['Dead bug','Plank','Bird dog','Side plank'].map(id).filter(i=>!primary.includes(i)).slice(0,2),dynamic=recovery?0:preparation.filter(i=>all[i].type!=='cardio').length,warmMinutes=recovery?0:5,cool=3,main=minutes-dynamic-warmMinutes-cool,coreMinutes=recovery?0:4,primaryMinutes=main-coreMinutes,rest=deload?60:spec.rest,reps=strength?(deload?5:3):spec.reps,sets=deload||p.progress==='Reduce'?1:strength?3:2,kg=!strength&&!mobility?Number(p.baseWeight||0)*(deload?.6:p.progress==='Reduce'?.8:1):0;
 const prescriptions=[...preparation,...primary,...core].map(i=>{const e=all[i],section=preparation.includes(i)?'preparation':core.includes(i)?'core':'main',time=section==='preparation'?(e.type==='cardio'?warmMinutes:1):section==='core'?coreMinutes/core.length:primaryMinutes/primary.length,barbell=/^Barbell/.test(e.name),timed=section==='main'&&(intervalDay||hyrox&&['cardio','interval','hold'].includes(e.type)),workSets=e.type==='strength'?Math.max(1,Math.min(sets,Math.floor((time*60+rest)/(reps*3+rest+15)))):1;
 return {id:i,section,minutes:time,sets:workSets,reps:e.type==='strength'?reps:0,seconds:e.type==='hold'?20:timed?20:0,rest,kg:barbell?0:/dumbbell|goblet|farmer|kettlebell/i.test(e.name)?kg:0,miles:0,note:section!=='main'?'Move comfortably and keep breathing.':strength&&barbell?'Submaximal technique sets. Choose a practiced load and stop with two repetitions in reserve; use safeties or a spotter.':intervalDay?'Controlled intervals: 20 seconds work, 40 seconds easy. Recover longer if form or breathing is not ready.':deload?'Unload week: easy technique, fewer sets and lighter resistance. No maximal or all-out efforts.':hyrox?'Scaled station practice. Keep transitions controlled and take recovery before the next station.':mobility?'Use nearby support, move slowly and stay within a comfortable range.':'Conversational effort or controlled strength work. Leave recovery before the next hard session.'};});
 return {title:titles[p.training][day],purpose:spec.purpose,ids:[...preparation,...primary,...core],primary,core,preparation,mainCount:primary.length,coreMinutes,primaryMinutes,week:w+1,deload,reps,sets,kg,minutes,recovery,day,dynamic,warmMinutes,cool,main,prescriptions,miles:0,runType:'Easy',phase:w%4+1,runMode:false};
}
