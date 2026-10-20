import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=await fs.readFile(new URL('app/diet-guide-data.ts',root),'utf8');
const recipes=[];
for(const c of source.matchAll(/collection\('([^']+)'[^`]+`([^`]+)`\)/g)) c[2].trim().split('\n').filter(Boolean).forEach((row,i)=>recipes.push({id:c[1]+'-'+(i+1),name:row.split('|')[0]}));
const clean=x=>String(x??'').replace(/<[^>]*>/g,'').replace(/&[^;]+;/g,' ').trim();
const normalize=x=>clean(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const out=JSON.parse(await fs.readFile(new URL('app/recipe-media.json',root),'utf8').catch(()=>'{}'));
const aliases={'japanese-29':'steamed Japanese sweet potato','korean-16':'vegetarian bibimbap','indian-14':'cabbage peas sabzi','thai-2':'Thai grilled eggplant salad','thai-6':'Thai sour curry vegetables','thai-11':'chicken larb','thai-13':'Thai winged bean salad','thai-14':'Thai glass noodle salad','thai-21':'Thai basil tofu','thai-22':'Thai tofu mixed vegetables','thai-23':'Thai acacia omelette','thai-25':'Thai pomelo salad','thai-26':'Thai bean sprout stir fry','thai-27':'Thai eggplant stir fry','vietnamese-7':'Vietnamese garlic green beans','vietnamese-26':'Vietnamese mung bean porridge','malaysian-13':'Malaysian dal soup','mediterranean-9':'Greek boiled greens','mexican-2':'Mexican black beans','mexican-7':'calabacitas corn','mexican-13':'quelites garlic','ecuadorian-24':'encocado camarones','puerto-rican-20':'boiled viandas'};
let commonsBlocked=false;
async function request(url){let error;for(let i=0;i<3;i++){try{return await fetch(url,{headers:{Connection:'close'},signal:AbortSignal.timeout(15000)});}catch(e){error=e;}}throw error;}
async function json(url){const r=await request(url);if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
async function collect(r){
 const media={...(out[r.id]??{})};
 try{
 if(commonsBlocked)throw Error('Commons cooling down');const q=new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:'"'+r.name+'"',gsrnamespace:'6',gsrlimit:'4',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640'});
 const data=await json('https://commons.wikimedia.org/w/api.php?'+q);
 const names=normalize(r.name).split(' ').filter(x=>!['and','with','the'].includes(x));
 const pages=Object.values(data.query?.pages??{}).sort((a,b)=>a.index-b.index);
 for(const p of pages){const info=p.imageinfo?.[0],meta=info?.extmetadata;if(!info||!meta)continue;const title=normalize(p.title.replace(/^File:/,'').replace(/\.[^.]+$/,''));
 if(!names.every(n=>title.includes(n)))continue;
 const license=clean(meta.LicenseShortName?.value);if(!/CC|Public domain/i.test(license))continue;
 Object.assign(media,{image:(info.thumburl||info.url).split('?')[0],imageSource:info.descriptionurl,imageCredit:clean(meta.Artist?.value)||'Wikimedia Commons contributor',imageLicense:license});break;
 }
 }catch(e){if(e.message==='HTTP 429')commonsBlocked=true;}
 try{
 const query=aliases[r.id]||r.name;const html=await request('https://www.youtube.com/results?search_query='+encodeURIComponent(query+' recipe')).then(x=>x.text());
 const marker='var ytInitialData = ';const start=html.indexOf(marker);if(start>=0){const part=html.slice(start+marker.length);const end=part.indexOf(';</script>');const tree=JSON.parse(part.slice(0,end));
 const videos=[];const walk=x=>{if(!x||typeof x!=='object')return;if(x.videoRenderer)videos.push(x.videoRenderer);for(const v of Object.values(x))if(typeof v==='object')walk(v);};walk(tree);
 const words=normalize(query).split(' ').filter(x=>!['and','with','the'].includes(x));
 for(const v of videos.slice(0,6)){const title=(v.title?.runs??[]).map(x=>x.text).join('');if(!words.every(w=>normalize(title).includes(w)))continue;
 let data;try{data=await json('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+v.videoId));}catch{continue;}
 Object.assign(media,{videoId:v.videoId,videoTitle:data.title,videoSource:'https://www.youtube.com/watch?v='+v.videoId});break;}
 }
 }catch(e){if(process.argv.includes('--debug'))console.log('youtube',r.name,e.message);}
 if(media.videoId&&!media.image)Object.assign(media,{image:'https://i.ytimg.com/vi/'+media.videoId+'/hqdefault.jpg',imageSource:media.videoSource,imageCredit:media.videoTitle,imageLicense:'YouTube video thumbnail · external media'});
 if(Object.keys(media).length)out[r.id]=media;
}
if(process.argv.includes('--probe')){console.log('recipes',recipes.length);console.log((await fetch('https://www.youtube.com/results?search_query=garlic+bok+choy+recipe').then(x=>x.text())).slice(0,200));process.exit();}
let index=0;await Promise.all(Array.from({length:4},async()=>{while(index<recipes.length){const r=recipes[index++];if(out[r.id]?.videoId){const m=out[r.id];if(!m.image)Object.assign(m,{image:'https://i.ytimg.com/vi/'+m.videoId+'/hqdefault.jpg',imageSource:m.videoSource,imageCredit:m.videoTitle,imageLicense:'YouTube video thumbnail · external media'});continue;}await collect(r);if(index%30===0)console.log(index, 'checked;',Object.values(out).filter(x=>x.image).length,'photos;',Object.values(out).filter(x=>x.videoId).length,'videos');await fs.writeFile(new URL('app/recipe-media.json',root),JSON.stringify(out,null,2)+'\n');}}));
console.log(JSON.stringify({recipes:recipes.length,photos:Object.values(out).filter(x=>x.image).length,videos:Object.values(out).filter(x=>x.videoId).length}));
