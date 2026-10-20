import assert from 'node:assert/strict';
import fs from 'node:fs';
import {moduleUrl} from './load-app-module.mjs';
const {translate,catalogLabel}=await import(await moduleUrl('locale-core'));
const {searchExercises}=await import(await moduleUrl('exercise-search'));
const catalog=JSON.parse(fs.readFileSync('app/exercise-catalog.json'));
for(const lang of ['zh-CN','es'])for(const e of catalog.filter(x=>/^(Barbell Bench Press|Bodyweight Squat|Push-Up)$/i.test(x.name))){const label=catalogLabel(e.name,lang);assert.notEqual(label,e.name);assert(searchExercises(label,'All sources',lang,label).some(x=>x.id===e.id),label);}
for(const file of ['diet-translations','ui-translations-extra','catalog-terms'])for(const [key,pair] of Object.entries(JSON.parse(fs.readFileSync('app/'+file+'.json')))){assert(Array.isArray(pair)&&pair.length===2,key);assert(pair.every(v=>typeof v==='string'&&v.trim()),key);}
const media=JSON.parse(fs.readFileSync('app/recipe-media.json'));assert.equal(Object.keys(media).length,540);for(const m of Object.values(media)){assert(m.image.startsWith('https://'));assert(/^[\w-]{11}$/.test(m.videoId));assert(m.imageSource&&m.imageCredit&&m.imageLicense&&m.videoSource);}
const seedy=fs.readFileSync('app/seedy.tsx','utf8');assert.equal((seedy.match(/recent:true/g)||[]).length,10);assert.equal((seedy.match(/recent:false/g)||[]).length,10);assert(seedy.indexOf('seedy-feedback')>seedy.indexOf('Explore all features'));
for(const lang of ['zh-CN','es'])for(const text of ['Watch the cooking technique','Log a meal','Open my inbox','Leave feedback'])assert.notEqual(translate(text,lang),text);
console.log('PASS: 540 media resources, translation pair integrity, localized exercise searches, 20 tips / 10 recent, feedback placement.');
