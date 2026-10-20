import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {moduleUrl} from './load-app-module.mjs';
const {dayPlan,exercises,trainingGoals,defaults}=await import(await moduleUrl('fitness')),{apartmentCompatible}=await import(await moduleUrl('apartment-training')),{translate,catalogLabel,englishQuery}=await import(await moduleUrl('locale-core')),{searchExercises}=await import(await moduleUrl('exercise-search'));
const demos=JSON.parse(await fs.readFile(new URL('../app/human-demos.json',import.meta.url),'utf8')),base={...defaults,start:'2026-10-12',baseWeight:100,progress:'Progress',baseMiles:12,runPace:10};let checks=0;
for(const training of trainingGoals)for(const duration of [30,45,60,75,90])for(let offset=0;offset<56;offset++){
 const date=new Date(Date.UTC(2026,9,12+offset)).toISOString().slice(0,10),p=dayPlan({...base,training,duration},date);checks++;
 assert.equal(new Set(p.ids).size,p.ids.length,training+' duplicate session');assert(p.ids.every(i=>apartmentCompatible(exercises[i])),training+' unavailable equipment');
 assert(p.ids.every(i=>demos[exercises[i].name]),'Missing media '+p.ids.filter(i=>!demos[exercises[i].name]).map(i=>exercises[i].name));
 assert(Math.abs(p.prescriptions.reduce((n,s)=>n+s.minutes,0)+p.cool-p.minutes)<1e-6,'time budget');
 assert(p.prescriptions.every(s=>Number.isFinite(s.minutes)&&s.minutes>0&&s.kg*2.2046226218<=50.000001),'load/time');
 for(let prior=1;prior<7;prior++){const other=dayPlan({...base,training,duration},new Date(Date.UTC(2026,9,12+offset-prior)).toISOString().slice(0,10));assert([...p.preparation,...p.core].every(id=>![...other.preparation,...other.core].includes(id)),training+' repeated within week');}
 for(const lang of ['zh-CN','es'])for(const id of p.ids){const e=exercises[id];assert.notEqual(catalogLabel(e.name,lang),e.name,'name '+e.name);assert.notEqual(translate(e.cue,lang),e.cue,'cue '+e.name);}
}
for(const lang of ['en','zh-CN','es']){const query=catalogLabel('Cable standing row',lang),result=searchExercises(englishQuery(query,lang),'All sources',lang,query,true);assert(result.some(e=>e.name==='Cable standing row'),'localized FTX search');assert(result.every(apartmentCompatible));}
for(const name of ['Barbell bench press','Kettlebell deadlift','Smith machine squat','Box jump','Ski ergometer','Sled push','Stationary cycling','Leg press'])assert(!apartmentCompatible({name}));
const low=dayPlan({...base,training:'Muscular hypertrophy',duration:60,baseWeight:1},'2026-10-12');assert(low.prescriptions.every(s=>!s.kg||s.kg*2.2046226218>=4.99999));
const cable=dayPlan({...base,training:'Muscular hypertrophy',duration:60},'2026-10-12');assert(cable.ids.some(i=>/Cable/i.test(exercises[i].name)));assert(cable.prescriptions.filter(s=>/cable/i.test(exercises[s.id].name)).every(s=>s.kg===0));
const coach=await fs.readFile(new URL('../app/movement-sources.tsx',import.meta.url),'utf8');for(const name of ['NASM','ACE Fitness','Dr. John Rusin','Squat University','Paul Carter','Lee Boyce','Prehab'])assert(coach.includes(name));
console.log('PASS: '+checks+' plans, exact budgets, apartment-only equipment, 5–50 lb dumbbells, 7-day nonrepeating preparation/core, media coverage, three-language search and exercise translations, seven coach sources.');
