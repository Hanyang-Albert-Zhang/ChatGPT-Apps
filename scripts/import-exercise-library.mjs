import {writeFile} from 'node:fs/promises';
const nasmUrl='https://www.nasm.org/resource-center/exercise-library';
const dbUrl='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const responses=await Promise.all([fetch('https://www.nasm.org/documents/exercises.json'),fetch(dbUrl)]);
if(responses.some(r=>!r.ok))throw Error('Could not read exercise sources: '+responses.map(r=>r.status));
const nasm=await responses[0].json(),dataset=await responses[1].json();
const names=new Map();
for(const item of nasm.data){const name=item.Title;if(!name)continue;const slug=name.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');const url=nasmUrl+'/'+slug;names.set(url,{id:'nasm:'+slug,name,source:'NASM',url,category:/stretch|foam roll/i.test(name)?'stretching':'strength',equipment:item.Equipment||'',muscles:(item['Body Part']||'').split(',').map(s=>s.trim()).filter(Boolean)});}
if(names.size<10)throw Error('NASM index needs review; no partial catalog written.');
const entries=[...names.values(),...dataset.map(e=>({id:'fedb:'+e.id,name:e.name,source:'Free Exercise DB',url:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/'+encodeURIComponent(e.id)+'.json',category:e.category,equipment:e.equipment||'',muscles:e.primaryMuscles||[]}))];
await writeFile(new URL('../app/exercise-catalog.json',import.meta.url),JSON.stringify(entries));
await writeFile(new URL('../docs/exercise-library-sources.md',import.meta.url),'# Exercise name index\n\nImported '+new Date().toISOString().slice(0,10)+'.\n\n- NASM: '+nasmUrl+' ('+names.size+' publicly linked exercise names; names and source links only).\n- Free Exercise DB: '+dbUrl+' ('+dataset.length+' entries; Unlicense/public domain). License: https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md\n\nFitDiet searches this local index and links back to the sources. It does not send user searches or workout data to these providers. Refresh with `node scripts/import-exercise-library.mjs`.\n');
console.log(JSON.stringify({nasm:names.size,freeExerciseDb:dataset.length,total:entries.length}));
