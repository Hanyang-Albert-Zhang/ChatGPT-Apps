import fs from 'node:fs/promises';
const file='app/diet-expansion-english.json',out=JSON.parse(await fs.readFile(file,'utf8')),media=JSON.parse(await fs.readFile('app/diet-expansion-english-media.json','utf8'));
const evidence={};let index=0;const recipes=Object.values(out).flat(),unique=[...new Map(recipes.map(r=>[r.name,r])).values()];
async function request(url){return fetch(url,{signal:AbortSignal.timeout(25000)});}
async function one(r){try{
 const m=media[r.id];const html=await request(m.videoSource).then(r=>r.text());
 const start=html.indexOf('var ytInitialPlayerResponse = ');if(start<0)return;
 const part=html.slice(start+30),end=part.indexOf(';</script>');let data;try{data=JSON.parse(part.slice(0,end));}catch{return;}
 const desc=data.videoDetails?.shortDescription||'';
 const urls=[...desc.matchAll(/https?:\/\/[^\s<>]+/g)].map(m=>m[0].replace(/[).,]+$/,''));
 const candidates=urls.filter(u=>!/(youtube|youtu.be|instagram|facebook|tiktok|amazon|amzn|patreon|twitter|pinterest|kit.co|bit.ly|linktr|subscribe|shop|merch|newsletter|discord|soundcloud|music|epidemic|substack)/i.test(u));
 for(const url of candidates.slice(0,6))try{const response=await request(url);if(!response.ok)continue;const body=await response.text();if(!/recipeIngredient|recipeInstructions|Ingredients|ingredients/.test(body))continue;const title=body.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]||'';const words=r.name.toLowerCase().replace(/[^a-z ]/g,'').split(' ').filter(w=>w.length>3&&!['with','whole','grain','vegetable','roasted'].includes(w));if(!words.some(w=>title.toLowerCase().includes(w)))continue;evidence[r.name]={url:response.url,title,checkedAt:'2026-10-19',video:m.videoSource};break;}catch{}
 }catch{}
}
await Promise.all(Array.from({length:5},async()=>{while(index<unique.length){const r=unique[index++];await one(r);if(index%10===0)console.log(index+'/'+unique.length,Object.keys(evidence).length,'publisher recipes');await fs.writeFile('scripts/english-expansion-source-evidence.json',JSON.stringify(evidence,null,2));}}));
for(const r of recipes)if(evidence[r.name])r.recipeSource=evidence[r.name].url;
await fs.writeFile(file,JSON.stringify(out,null,2)+'\n');
console.log('Sources',recipes.filter(r=>r.recipeSource).length,'/',recipes.length,'Missing:',unique.filter(r=>!evidence[r.name]).map(r=>r.name));
