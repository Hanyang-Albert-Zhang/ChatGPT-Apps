import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
const base='http://127.0.0.1:8787',id='calendar_'+randomUUID(),other='other_'+randomUUID(),admin='admin_'+randomUUID();
function headers(user=id){return {'Content-Type':'application/json',Origin:base,'oai-authenticated-user-id':user,'oai-authenticated-user-email':user===admin?'hanyang.zhang@alumni.wfu.edu':user+'@example.test','oai-authenticated-user-full-name':'Calendar Tester','oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8'};}
async function call(path,body,user=id,status=200,method=body?'POST':'GET'){const r=await fetch(base+path,{method,headers:headers(user),...(body?{body:JSON.stringify(body)}:{})}),raw=await r.text();let d;try{d=JSON.parse(raw);}catch{throw Error(path+" "+r.status+" "+JSON.stringify(body)+" "+raw);}assert.equal(r.status,status,JSON.stringify(d));return d;}
await call('/api/account');await call('/api/account',null,other);
const payload={name:'Seediva test sprout press '+randomUUID().slice(0,5),movementType:'strength',sets:3,reps:8,weight:20,weightUnit:'lb',minutes:15,miles:0,notes:'Private test note'};
const future=await call('/api/training-calendar',{action:'add',date:'2099-01-01',payload});await call('/api/training-calendar',{action:'complete',id:future.id,checked:true},id,400);
await call('/api/training-calendar',{action:'add',date:'2025-02-29',payload},id,400);
const past=await call('/api/training-calendar',{action:'add',date:'2025-01-01',payload});await call('/api/training-calendar',{action:'complete',id:past.id,checked:true},other,404);
await call('/api/training-calendar',{action:'complete',id:past.id,checked:true});await call('/api/training-calendar',{action:'complete',id:past.id,checked:true});
let records=(await call('/api/records')).records,logs=records.filter(x=>x.kind==='workout');assert.equal(logs.length,1);assert.equal(logs[0].date,'2025-01-01');assert.equal(logs[0].payload.sets,3);assert.equal(logs[0].payload._planId,past.id);
const {moduleUrl}=await import('./load-app-module.mjs');const {rewardsFor}=await import(await moduleUrl('rewards'));assert.equal(rewardsFor(records).workoutXp,20);
await call('/api/training-calendar',{action:'complete',id:past.id,checked:false});records=(await call('/api/records')).records;assert.equal(records.filter(x=>x.kind==='workout').length,0);assert.equal(rewardsFor(records).workoutXp,0);
await call('/api/training-calendar',{action:'complete',id:past.id,checked:true});await call('/api/training-calendar',{action:'remove',id:past.id});assert.equal((await call('/api/records')).records.filter(x=>x.kind==='workout').length,0);
const shared=await call('/api/exercise-search?q='+encodeURIComponent(payload.name),null,other);assert(shared.exercises.some(x=>x.name===payload.name&&x.source==='Community exercise names'));assert(!JSON.stringify(shared).includes('Private test note'));
await call('/api/admin',{action:'access',id,mode:'none',pages:[],removed:false},other,403);
await call('/api/admin',null,admin);
await call('/api/admin',{action:'access',id,mode:'selected',pages:['Food diary'],removed:false},admin);await call('/api/training-calendar',null,id,401);await call('/api/records',{kind:'workout',date:'2025-01-01',payload},id,403);await call('/api/records',{kind:'meal',date:'2025-01-01',payload:{name:'Allowed meal'}});
await call('/api/admin',{action:'access',id,mode:'none',pages:[],removed:true},admin);await call('/api/records',null,id,401);assert.equal((await call('/api/account')).user.access.removed,true);
await call('/api/admin',{action:'access',id,mode:'all',pages:[],removed:false},admin);await call('/api/training-calendar');
await call('/api/admin',{action:'invite',name:'Invited',email:other+'@example.test',mode:'selected',pages:['Nutrition advice'],removed:false},admin);assert.equal((await call('/api/account',null,other)).user.access.mode,'selected');await call('/api/training-calendar',null,other,401);
await call('/api/admin',{action:'access',id:admin,mode:'none',pages:[],removed:true},admin,400);
console.log('PASS calendar/access: future planning, completion date/fields, idempotency, ownership, 20 XP and reversal, shared names without private notes, selected/denied/restored access, email invitation policy, owner protection.');


