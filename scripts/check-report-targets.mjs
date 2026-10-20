
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import ts from 'typescript';
import {moduleUrl} from './load-app-module.mjs';
const {reportTargets,dailyReportTargets,liftedVolume,strengthMinutes,strengthTrainingDays}=await import(await moduleUrl('report-targets'));const {reportPeriod}=await import(await moduleUrl('report-period'));
const p={age:26,weight:80,height:180,sex:'male',activity:1.55,target:2000,goal:'Maintain weight',training:'Muscular hypertrophy',duration:60,start:'2024-01-01',baseWeight:10,progress:'Hold'};
let seven=reportTargets(p,reportPeriod('2024-01-07',7));assert.deepEqual(seven.calories,Array(7).fill(2000));assert.deepEqual(seven.protein,Array(7).fill(96));assert.deepEqual(seven.fiber,Array(7).fill(38));assert(Math.abs(seven.minutes.reduce((a,b)=>a+b,0)-150)<1e-9);
const year=reportTargets(p,reportPeriod('2024-10-13',365));assert.equal(year.calories.length,12);assert.equal(year.calories[1],29*2000);assert.equal(year.protein[0],31*96);assert(Math.abs(year.minutes[1]-29*150/7)<1e-8);
const ninety=reportTargets(p,reportPeriod('2024-04-01',90));assert.equal(ninety.calories.at(-1),6*2000);assert.equal(ninety.calories.reduce((a,b)=>a+b,0),90*2000);
const zig=reportTargets({...p,zigzag:true,weekendExtra:250},reportPeriod('2024-01-07',7));assert.equal(zig.calories.reduce((a,b)=>a+b,0),14000);assert.equal(zig.calories[0],1900);assert.equal(zig.calories[6],2250);
assert.equal(dailyReportTargets({...p,sex:'female',age:60},'2024-01-01').fiber,21);assert.equal(dailyReportTargets({...p,sex:'male',age:60},'2024-01-01').fiber,30);
assert.equal(liftedVolume({movementType:'strength',sets:3,reps:10,weight:90,weightUnit:'lb',weightScope:'twoHands'}),2700);
assert.equal(liftedVolume({movementType:'strength',sets:3,reps:10,weight:45,weightUnit:'lb',weightScope:'perHand'}),2700);
assert.equal(liftedVolume({movementType:'strength',sets:3,reps:10,weight:45,weightUnit:'lb',weightScope:'oneHand'}),1350);
assert.equal(liftedVolume({movementType:'strength',sets:3,reps:10,weight:100,weightScope:'bodyWeight'}),0);assert.equal(liftedVolume({movementType:'cardio',sets:3,reps:10,weight:100}),0);
assert(Math.abs(liftedVolume({movementType:'strength',sets:1,reps:1,weight:10,weightUnit:'kg',weightScope:'total'})-22.046226218)<1e-8);
assert.equal(dailyReportTargets(p,'2023-12-31').volume,null);assert(dailyReportTargets(p,'2024-01-01').volume>0);assert.equal(dailyReportTargets({...p,baseWeight:0},'2024-01-01').volume,null);
assert(reportTargets(null,reportPeriod('2024-01-07',7)).calories.every(v=>v===null));

assert.equal(strengthMinutes({movementType:'strength',minutes:12,weightScope:'bodyWeight'}),12);
assert.equal(strengthMinutes({movementType:'cardio',minutes:70}),0);
assert.equal(strengthMinutes({name:'Bench press',minutes:20}),20);
assert.equal(strengthMinutes({name:'Walk',minutes:70}),0);
assert.equal(strengthMinutes({movementType:'strength',minutes:-5}),0);
assert.equal(strengthMinutes({movementType:'strength',minutes:Infinity}),0);
assert.equal(dailyReportTargets({...p,baseWeight:0},'2024-01-01').strength>0,true);
assert.equal(dailyReportTargets(p,'2023-12-31').strength,null);
for(const range of [7,28,90,365]){const period=reportPeriod('2024-10-13',range),targets=reportTargets(p,period),logged=[{kind:'workout',date:'2024-10-12',payload:{strengthMinutes:10}},{kind:'workout',date:'2024-10-12',payload:{strengthMinutes:20}},{kind:'workout',date:'2024-10-13',payload:{strengthMinutes:15}}];assert.equal(period.values(logged,'workout','strengthMinutes').reduce((a,b)=>a+b,0),45);assert.equal(targets.strength.length,period.buckets.length);const expected=period.days.reduce((sum,date)=>sum+(dailyReportTargets(p,date).strength||0),0);assert(Math.abs(targets.strength.reduce((sum,n)=>sum+(n||0),0)-expected)<1e-6);}
console.log('PASS: daily/weekly/monthly target sums, leap-year months, partial weeks, zigzag budget, age/sex fiber and weight-relative protein, volume units/hand scope/bodyweight/cardio exclusion, plan-only references and missing-profile handling; strength/bodyweight minutes, cardio exclusion, and strength targets across all filters.');

assert.equal(strengthTrainingDays([{kind:'workout',date:'2026-10-13',payload:{movementType:'strength',sets:3,reps:8,minutes:0}},{kind:'workout',date:'2026-10-13',payload:{movementType:'strength',sets:2,reps:10}},{kind:'workout',date:'2026-10-14',payload:{movementType:'strength',weightScope:'bodyWeight'}},{kind:'workout',date:'2026-10-15',payload:{movementType:'cardio',minutes:30}}]),2,'Strength days must include strength logs without duration and deduplicate dates');
