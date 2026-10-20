
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import ts from 'typescript';import {randomUUID} from 'node:crypto';
import {moduleUrl} from './load-app-module.mjs';
const {measurementWeek,measurementTrend}=await import(await moduleUrl('body-measurement-utils'));
assert.equal(measurementWeek(new Date('2026-10-19T03:59:59Z')),'2026-10-12');assert.equal(measurementWeek(new Date('2026-10-19T04:00:00Z')),'2026-10-19');
assert.equal(measurementWeek(new Date('2026-11-02T04:59:59Z')),'2026-10-26');assert.equal(measurementWeek(new Date('2026-11-02T05:00:00Z')),'2026-11-02');
assert.equal(measurementTrend([{week:'2026-10-05',value:30},{week:'2026-10-19',value:34}]).slope,2);
const {healthMetrics,healthGrade}=await import(await moduleUrl('health-metrics'));
for(const [n,g] of [[100,'SSS'],[99,'SS'],[95,'SS'],[94,'S'],[90,'S'],[89,'A'],[85,'A'],[84,'B'],[80,'B'],[79,'C'],[70,'C'],[69,'D'],[60,'D'],[59,'F']])assert.equal(healthGrade(n),g);
const profile={age:26,weight:80,height:180,sex:'male',target:2000,goal:'Maintain weight',activity:1.55,zigzag:false};assert.equal(healthMetrics([],profile,'2026-10-13').score,null);
const sample=Array.from({length:28},(_,i)=>({kind:'meal',date:new Date(Date.UTC(2026,8,16+i)).toISOString().slice(0,10),payload:{fiber:38,protein:96,calories:2000}}));for(let i=0;i<8;i++)sample.push({kind:'workout',date:sample[i].date,payload:{movementType:'strength',minutes:75}});
const weights=Array.from({length:21},(_,i)=>({date:new Date(Date.UTC(2026,8,23+i)).toISOString().slice(0,10),weightKg:80})),measurements=[{key:'waist',week:'2026-09-28',value:34},{key:'waist',week:'2026-10-05',value:34}];assert.equal(healthMetrics(sample,profile,'2026-10-13').score,null);const full=healthMetrics(sample,profile,'2026-10-13',weights,measurements);assert.equal(full.score,100);assert.equal(full.grade,'SSS');assert.equal(full.components.find(c=>c.name==='Fiber goal').target,38);assert.equal(healthMetrics(sample,{...profile,sex:'female',age:60},'2026-10-13').components.find(c=>c.name==='Fiber goal').target,21);assert.equal(healthMetrics(sample,null,'2026-10-13').score,null);
const origin='http://127.0.0.1:8787',tag=randomUUID(),a={id:'measure_a_'+tag,name:'Measurement A'},b={id:'measure_b_'+tag,name:'Measurement B'};const headers=u=>({...u?{'oai-authenticated-user-id':u.id,'oai-authenticated-user-full-name':u.name,'oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8','oai-authenticated-user-email':u.id+'@example.test'}:{},Origin:origin,'Content-Type':'application/json',Connection:'close'});
async function call(u,body,status=200){const r=await fetch(origin+'/api/body-measurements',{headers:headers(u),...(body?{method:'POST',body:JSON.stringify(body)}:{})}),d=await r.json();assert.equal(r.status,status,JSON.stringify(d));return d;}
await call(a,{key:'waist',value:34.52,week:'2099-01-01'});await call(a,{key:'waist',value:35},409);await call(a,{key:'hip',value:39});await call(a,{key:'bust',value:40},400);await call(a,{key:'shoulder',value:0},400);
const concurrent=await Promise.all([45,46].map(value=>fetch(origin+'/api/body-measurements',{method:'POST',headers:headers(a),body:JSON.stringify({key:'shoulder',value})})));assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
const own=await call(a);assert.equal(own.measurements.length,3);assert.equal(own.measurements.find(r=>r.key==='waist').value,34.52);assert(own.measurements.every(r=>r.week===own.week));assert.equal((await call(b)).measurements.length,0);

const patch=async(user,body,status=200)=>{const r=await fetch(origin+'/api/body-measurements',{method:'PATCH',headers:headers(user),body:JSON.stringify(body)});assert.equal(r.status,status,await r.text());};
const waist=own.measurements.find(r=>r.key==='waist');
await patch(b,{entries:[{id:waist.id,value:40}]},404);
await patch(a,{entries:[{id:waist.id,value:33.25}],week:'2099-01-01'});
const edited=await call(a);assert.equal(edited.measurements.find(r=>r.id===waist.id).value,33.25);assert.equal(edited.measurements.find(r=>r.id===waist.id).week,own.week);
await patch(a,{entries:[{id:waist.id,value:0}]},400);
await patch(a,{entries:[{id:waist.id,value:34},{id:waist.id,value:35}]},400);
const removed=await fetch(origin+'/api/body-measurements',{method:'DELETE',headers:headers(a),body:JSON.stringify({week:own.week})});assert.equal(removed.status,200);const afterDelete=await call(a);assert(afterDelete.measurements.every(r=>r.deletedAt));await call(a,{key:'waist',value:34},409);await patch(a,{entries:[{id:waist.id,value:34}]},404);assert.equal((await call(b)).measurements.length,0);
await call(a,{key:'highHip',value:34},400);
await call(null,null,401);

console.log('PASS: Monday Eastern boundaries including DST; week-spaced trend regression; all grade thresholds; sparse data withheld, capped score, age/sex nutrition targets; server weekly locks and concurrent duplicates; owned measurement isolation and validation; owned historical edits preserve week; removed entries excluded but weekly slots stay locked; High Hip rejected.');
