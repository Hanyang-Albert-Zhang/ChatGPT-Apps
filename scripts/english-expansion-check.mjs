import fs from 'node:fs/promises';
const file='app/diet-expansion-english.json',out=JSON.parse(await fs.readFile(file,'utf8')),media=JSON.parse(await fs.readFile('app/diet-expansion-english-media.json','utf8')),trFile='app/diet-expansion-english-translations.json',tr=JSON.parse(await fs.readFile(trFile,'utf8'));
const eFile='scripts/english-expansion-source-evidence.json',e=JSON.parse(await fs.readFile(eFile,'utf8'));
e['Bitter melon with egg']={url:'https://omnivorescookbook.com/bitter-melon-with-eggs/',title:'Bitter Melon with Eggs (5 Ingredients Recipe)',checkedAt:'2026-10-19',verification:'Primary publisher web search result',sourceKind:'variation'};
out.keto.find(r=>r.name==='Bitter melon with egg').recipeSource=e['Bitter melon with egg'].url;
for(const r of out.dash){r.ingredients=r.ingredients.map(s=>s==='milk'?'low-fat milk':s==='cheddar'?'reduced-sodium cheddar':s);}
Object.assign(tr,{'low-fat milk':['低脂牛奶','leche baja en grasa'],'reduced-sodium cheddar':['减钠切达奶酪','queso cheddar reducido en sodio']});
for(const[id,rows]of Object.entries(out)){if(rows.length!==20||new Set(rows.map(r=>r.name)).size!==20)throw Error('Count '+id);for(const r of rows){if(!r.recipeSource||!media[r.id]?.image||!media[r.id]?.videoId)throw Error('Coverage '+r.id);for(const s of[r.name,...r.ingredients])if(!tr[s])throw Error('Missing translation '+s);}}
await fs.writeFile(file,JSON.stringify(out,null,2)+'\n');await fs.writeFile(trFile,JSON.stringify(tr,null,2)+'\n');await fs.writeFile(eFile,JSON.stringify(e,null,2)+'\n');
let index=0;const videos=[...new Set(Object.values(media).map(m=>m.videoId))],bad=[];
await Promise.all(Array.from({length:5},async()=>{while(index<videos.length){const id=videos[index++];try{const r=await fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+id),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(r.status);const data=await r.json();if(data.type!=='video')throw Error(data.type);}catch(err){bad.push([id,err.message]);}}}));
console.log(JSON.stringify({recipes:120,collections:Object.keys(out).length,photos:Object.keys(media).length,videos:videos.length,failedOembed:bad,recipeSources:120,translations:Object.keys(tr).length}));
