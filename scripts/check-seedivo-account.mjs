import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
const origin='http://127.0.0.1:8787',id='locale-qa-'+randomUUID(),other='locale-qa-'+randomUUID();
const headers=(who=id)=>({'oai-authenticated-user-id':who,'oai-authenticated-user-email':who+'@example.test','oai-authenticated-user-full-name':'Locale Tester','oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8','Content-Type':'application/json',Origin:origin,Connection:'close'});
async function account(body,who=id,status=200){const response=await fetch(origin+'/api/account',{headers:headers(who),signal:AbortSignal.timeout(15000),...(body?{method:'POST',body:JSON.stringify(body)}:{})}),data=await response.json();assert.equal(response.status,status,JSON.stringify(data));return data.user;}
assert.equal((await account()).language,'en');
await account({preferredName:'Cedar'});let saved=await account({language:'zh-CN'});assert.equal(saved.preferredName,'Cedar');assert.equal(saved.language,'zh-CN');
saved=await account({preferredName:'Sprout'});assert.equal(saved.language,'zh-CN');assert.equal(saved.name,'Sprout');
saved=await account({language:'es'});assert.equal(saved.name,'Sprout');assert.equal((await account()).language,'es');assert.equal((await account()).preferredName,'Sprout');
assert.equal((await account(undefined,other)).language,'en');assert.equal((await account(undefined,other)).preferredName,'');
await account({language:'fr'},id,400);assert.equal((await account()).language,'es');
console.log('Account preference and authorization checks passed; checking exercise lookup.');
const exercise=await (await fetch(origin+'/api/exercise-search?q='+encodeURIComponent('卧推')+'&lang=zh-CN',{headers:{Connection:'close'},signal:AbortSignal.timeout(15000)})).json();assert(exercise.exercises.some(e=>/bench press/i.test(e.name)));
console.log('Chinese exercise lookup passed; checking Spanish lookup.');
const spanishExercise=await (await fetch(origin+'/api/exercise-search?q=sentadillas&lang=es',{headers:{Connection:'close'},signal:AbortSignal.timeout(15000)})).json();assert(spanishExercise.exercises.some(e=>/squat/i.test(e.name)));
console.log('Spanish exercise lookup passed; checking food lookup.');
const food=await (await fetch(origin+'/api/food-search?q='+encodeURIComponent('1 水煮蛋')+'&lang=zh-CN',{headers:headers()})).json();assert(food.products.some(p=>/egg/i.test(p.name)));assert.equal(food.grams,50);
const anonymous=await fetch(origin+'/api/account',{method:'POST',headers:{'Content-Type':'application/json',Connection:'close'},body:JSON.stringify({language:'es'})});assert.equal(anonymous.status,401);await anonymous.arrayBuffer();
const foreignOptions={method:'POST',headers:{'oai-authenticated-user-id':'locale-origin-'+randomUUID(),'oai-authenticated-user-email':'origin@example.test','Content-Type':'application/json',Connection:'close',Origin:'https://other.example'},body:JSON.stringify({language:'es'})};
let foreign=await fetch(origin+'/api/account',foreignOptions),foreignBody=await foreign.text();
if(foreign.status===503&&foreignBody.includes('worker restarted')){foreign=await fetch(origin+'/api/account',foreignOptions);foreignBody=await foreign.text();}
assert.equal(foreign.status,403,foreignBody);
console.log('PASS: default English; persisted Chinese/Spanish and name independently; account isolation; invalid language, anonymous and foreign-origin writes denied; multilingual exercise and food search preserves canonical records and portion.');
