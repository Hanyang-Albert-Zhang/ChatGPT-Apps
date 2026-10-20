import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
const base='http://127.0.0.1:8787',id='meal_update_'+randomUUID(),other='meal_other_'+randomUUID(),description='300g test bok choy '+randomUUID().slice(0,6),today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
async function call(path,body,user=id,status=200){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Origin:base,'Content-Type':'application/json','oai-authenticated-user-id':user,'oai-authenticated-user-email':user+'@example.test'},...(body?{body:JSON.stringify(body)}:{})}),text=await r.text();assert.equal(r.status,status,text);return JSON.parse(text);}
assert.equal((await call('/api/saved-foods?q='+encodeURIComponent(description))).foods.length,0);
const meal=await call('/api/records',{kind:'meal',date:today,payload:{name:'Lunch meal',description,calories:350,carbs:20,protein:18,fiber:7,fat:21}});assert.equal(meal.payload.name,'Lunch meal');
const saved=await call('/api/saved-foods?q='+encodeURIComponent(description));assert(saved.foods.some(x=>x.description===description));assert.equal((await call('/api/saved-foods?q='+encodeURIComponent(description),null,other)).foods.length,0);
const match=await call('/api/food-search?q='+encodeURIComponent(description));assert.equal(match.products[0].per100.calories,350);assert(match.products[0].url.startsWith("https://"));assert.equal(match.servings,1);assert.equal(match.requiresConfirmation,true);
const edited=await call('/api/records',{id:meal.id,kind:'meal',date:'2025-01-01',payload:meal.payload});assert.equal(edited.date,'2025-01-01');assert.equal(edited.rewards.mealXp,10);
await call('/api/records',{id:meal.id,kind:'meal',date:'2099-01-01',payload:meal.payload},id,400);await call('/api/records',{id:meal.id,kind:'meal',date:today,payload:meal.payload},other,404);
const workout=await call('/api/records',{kind:'workout',date:today,payload:{name:'Walk',movementType:'cardio',minutes:20,miles:1}}),moved=await call('/api/records',{id:workout.id,kind:'workout',date:'2025-01-02',payload:workout.payload});assert.equal(moved.date,'2025-01-02');assert.equal(moved.rewards.workoutXp,10);
await call('/api/records',{id:workout.id,kind:'workout',date:'2099-01-01',payload:workout.payload},id,400);
console.log('PASS meal updates: private submit-only description search, independent meal name, saved-portion confirmation, editable meal/workout dates, future denial and ownership.');

