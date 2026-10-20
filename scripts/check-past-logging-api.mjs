import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {moduleUrl} from './load-app-module.mjs';
const {easternDate}=await import(await moduleUrl('logging-date'));
const base=process.env.SEEDIVA_TEST_ORIGIN||'http://127.0.0.1:8787',id='pastlog_'+randomUUID(),today=easternDate(),previous=new Date(today+'T12:00:00Z');previous.setUTCDate(previous.getUTCDate()-1);const yesterday=previous.toISOString().slice(0,10);
const origin=new URL(base);if(!['127.0.0.1','localhost','[::1]'].includes(origin.hostname))throw Error('API test requires a loopback test server.');
const headers={'oai-authenticated-user-id':id,'oai-authenticated-user-email':id+'@example.test','oai-authenticated-user-full-name':'Date Test','oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8',Origin:base,'Content-Type':'application/json'};
async function call(body,status=200){const r=await fetch(base+'/api/records',{method:'POST',headers,body:JSON.stringify(body)}),d=await r.json();assert.equal(r.status,status,JSON.stringify(d));return d;}
for(const kind of ['meal','workout']){await call({kind,date:'2099-01-01',payload:{}},400);await call({kind,date:'2025-02-29',payload:{}},400);}
const meal=await call({kind:'meal',date:yesterday,payload:{name:'Past meal',calories:100,_loggedAt:0}});assert.equal(meal.date,yesterday);assert.equal(meal.rewards.mealXp,10);assert(meal.payload._loggedAt>Date.now()-60000);
const edit=await call({id:meal.id,kind:'meal',date:today,payload:{name:'Edited past meal',calories:150,_loggedAt:0}});assert.equal(edit.date,today);assert.equal(edit.payload._loggedAt,meal.payload._loggedAt);assert.equal(edit.rewards.mealXp,20);
const workout=await call({kind:'workout',date:yesterday,payload:{name:'Past walk',minutes:10,movementType:'cardio',cardioType:'walk'}});assert.equal(workout.date,yesterday);assert.equal(workout.rewards.workoutXp,10);
const current=await call({kind:'meal',date:today,payload:{name:'Current meal',calories:100}});assert.equal(current.rewards.mealXp,40);
console.log('PASS API: past meal/workout dates retained, 10 XP late/20 XP today, forged timestamps ignored, editable dates recalculate XP, future/impossible dates denied.');
