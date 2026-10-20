import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const origin='http://127.0.0.1:8787',a='seediva-'+randomUUID(),b='seediva-'+randomUUID();
const headers=id=>({'oai-authenticated-user-id':id,'oai-authenticated-user-email':id+'@example.test','Content-Type':'application/json',Origin:origin,Connection:'close'});
async function call(path,body,id=a,status=200){const r=await fetch(origin+path,{headers:headers(id),signal:AbortSignal.timeout(20000),...(body?{method:'POST',body:JSON.stringify(body)}:{})});const d=await r.json();assert.equal(r.status,status,JSON.stringify(d));return d;}
assert.equal((await call('/api/account')).user.onboardingEligible,true);
await call('/api/account',{preferredName:'Cedar',language:'es',onboardingComplete:true});
assert.equal((await call('/api/account')).user.onboardingEligible,false);
for(let id=0;id<15;id++){await call('/api/account',{avatar:{kind:'preset',id}});assert.deepEqual((await call('/api/account')).user.avatar,{kind:'preset',id});}
await call('/api/account',{avatar:{kind:'preset',id:15}},a,400);
await call('/api/account',{avatar:{kind:'preset',id:-1}},a,400);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6nS8AAAAASUVORK5CYII=','base64'),form=new FormData();form.set('photo',new Blob([png],{type:'image/png'}),'test.png');
const cleanHeaders=headers(a);delete cleanHeaders['Content-Type'];const upload=await fetch(origin+'/api/avatar-photo',{method:'POST',headers:cleanHeaders,body:form});assert.equal(upload.status,200);const {photoId}=await upload.json();
await call('/api/account',{avatar:{kind:'photo',id:photoId}});
for(const [id,status] of [[a,200],[b,404]]){const r=await fetch(origin+'/api/avatar-photo?id='+encodeURIComponent(photoId),{headers:headers(id)});assert.equal(r.status,status);await r.arrayBuffer();}
await call('/api/account',{avatar:{kind:'photo',id:photoId}},b,400);
const saved=(await call('/api/account')).user;assert.equal(saved.name,'Cedar');assert.equal(saved.language,'es');assert.equal(saved.onboardingEligible,false);
assert.equal((await call('/api/account',undefined,b)).user.onboardingEligible,true);
await call('/api/weights',{weight:70},b);assert.equal((await call('/api/account',undefined,b)).user.onboardingEligible,false);
const anon=await fetch(origin+'/api/avatar-photo?id='+encodeURIComponent(photoId));assert.equal(anon.status,401);await anon.arrayBuffer();
console.log('PASS: onboarding eligibility and durable completion; all 15 presets; invalid avatars denied; owner-only photo access/assignment; preferences preserved; weight history excludes onboarding.');
