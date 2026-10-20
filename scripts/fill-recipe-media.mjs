import fs from 'node:fs/promises';
const file=new URL('../app/recipe-media.json',import.meta.url),missingFile=new URL('../app/recipe-media-missing.json',import.meta.url),media=JSON.parse(await fs.readFile(file,'utf8')),missing=JSON.parse(await fs.readFile(missingFile,'utf8'));
const aliases={
'japanese-29':['steamed sweet potato','satsumaimo'],
'korean-16':['vegan bibimbap','vegetarian bibimbimbap','vegetable bibimbap'],
'thai-6':['gaeng som','sour curry vegetable'],
'thai-22':['tao hu song kreung','tofu song kreung'],
'thai-26':['pad tua ngok','bean sprout stir fry'],
'vietnamese-7':['dau que xao','garlic green bean'],
'vietnamese-26':['chao dau xanh','mung bean porridge'],
'malaysian-13':['sup dhal','dhal soup'],
'mediterranean-9':['horta','Greek greens'],
'mediterranean-30':['whole wheat primavera','whole grain primavera'],
'american-11':['farro vegetable','farro bowl'],
'american-16':['pear walnut oatmeal','pear porridge'],
'american-18':['sweet potato black bean casserole','sweet potato black bean bake'],
'american-28':['chicken vegetable traybake','chicken vegetable sheet pan'],
'american-30':['whole wheat vegetable pasta','whole grain vegetable pasta'],
'vegetarian-8':['spinach ricotta whole wheat','spinach ricotta pasta'],
'vegetarian-10':['lentil tomato pasta','lentil pasta sauce'],
'vegetarian-18':['portobello bean','mushroom bean bake'],
'vegetarian-19':['chickpea frittata','chickpea vegetable omelette'],
'vegetarian-20':['broccoli cheese frittata','broccoli cheddar frittata'],
'vegetarian-25':['savory oatmeal','savoury oats'],
'vegetarian-27':['pear almond yogurt','pear yogurt bowl'],
'vegan-2':['red lentil carrot stew','red lentil carrot soup'],
'vegan-5':['split pea vegetable soup','split pea vegetable stew'],
'vegan-7':['tempeh broccoli','broccoli tempeh stir fry'],
'vegan-8':['tofu cabbage stir fry','cabbage tofu'],
'vegan-9':['baked tofu mushroom','tofu mushroom bake'],
'vegan-11':['chickpea oat patties','chickpea oat burger'],
'vegan-12':['white bean herb dip','white bean herb spread'],
'vegan-14':['carrot lentil dip','carrot lentil hummus'],
'vegan-18':['bulgur chickpea parsley','bulgur chickpea salad'],
'vegan-22':['whole wheat walnut pasta','whole grain walnut pasta'],
'vegan-23':['pea basil pasta','pea pesto pasta'],
'vegan-25':['berry chia pudding','berries chia pudding'],
'vegan-28':['roasted cauliflower chickpea','cauliflower chickpea traybake'],
'vegan-30':['Brussels sprout white bean salad','Brussels bean salad'],
'dash-1':['lemon lentil salad','herb lentil salad'],
'dash-2':['no salt chickpea soup','low sodium chickpea soup'],
'dash-7':['apple oat bran','apple bran porridge'],
'dash-12':['beet barley salad','beetroot barley salad'],
'dash-16':['herb cauliflower roast','roasted cauliflower herbs'],
'dash-19':['kale white bean garlic','garlic white beans kale'],
'dash-21':['pea carrot barley soup','vegetable barley soup peas'],
'dash-25':['herb chicken vegetable bake','herb chicken vegetables roast'],
'dash-30':['walnut apple coleslaw','apple walnut cabbage slaw'],
'keto-7':['tuna celery lettuce','tuna salad lettuce cup'],
'keto-11':['lemon fish broccoli','fish broccoli lemon'],
'keto-17':['eggplant tahini','aubergine tahini'],
'keto-25':['flax chia porridge','flaxseed chia porridge'],
'keto-26':['Greek yogurt walnut','yogurt walnut bowl'],
'keto-27':['avocado cucumber bowl','avocado cucumber salad'],
'keto-28':['roasted radish herb','radish roast herb'],
'mexican-13':['quelites ajo','quelites garlic'],
'ecuadorian-8':['habas queso','fava bean cheese'],
'ecuadorian-9':['mote queso','hominy cheese'],
'ecuadorian-15':['sopa zapallo','sopa calabaza ecuatoriana'],
'ecuadorian-18':['repe arveja','repe guineo'],
'ecuadorian-24':['encocado camaron','encocado camarones'],
'puerto-rican-2':['habichuelas rosadas','habichuelas guisadas'],
'puerto-rican-7':['lentejas guisadas','lentejas puertorriquenas'],
'puerto-rican-20':['viandas hervidas','viandas boricua']};
Object.assign(aliases,{'vegetarian-27':['pear yogurt bowl','pear yoghurt bowl'],'dash-7':['apple bran porridge','apple oat bran porridge'],'ecuadorian-8':['habas queso Ecuador','habas con queso ecuatorianas'],'ecuadorian-9':['mote queso Ecuador','mote con queso ecuatoriano'],'puerto-rican-20':['como hervir viandas','viandas hervidas receta'],'malaysian-13':['sup kacang dhal','sup dal','dhal soup'],'vegan-22':['walnut pasta vegan','whole wheat walnut pasta'],'vegan-25':['berry chia pudding','berries chia pudding','chia seed pudding berries'],'dash-2':['chickpea vegetable soup low sodium','chickpea soup no salt'],'dash-21':['barley carrot pea soup','vegetable barley soup'],'keto-11':['fish broccoli lemon','lemon fish broccoli bake'],'mexican-13':['quelites ajo','quelites garlic','quelites salteados'],'ecuadorian-15':['sopa de zapallo','crema zapallo ecuatoriana'],'puerto-rican-7':['lentejas guisadas','lentejas boricuas']});
Object.assign(aliases,{'dash-2':['chickpea vegetable soup','garbanzo vegetable soup'],'keto-11':['lemon baked cod','lemon baked fish'],'mexican-13':['stewed quelites','quelites recipe'],'puerto-rican-7':['stewed lentils','lentil stew sofrito'],'dash-7':['oat bran apple','oat bran apples'],'ecuadorian-8':['habas queso'],'puerto-rican-20':['boiled root vegetables','boil viandas']});
const rejected={'vegetarian-27':'Pear almond yogurt bowl','dash-7':'Apple bran porridge','ecuadorian-8':'Habas con queso','ecuadorian-9':'Mote con queso','puerto-rican-20':'Viandas hervidas'};
if(process.argv.includes('--audit-fix'))for(const [id,name]of Object.entries(rejected)){delete media[id];if(!missing.some(r=>r.id===id))missing.push({id,name});}
const normalize=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ');
async function request(u){let err;for(let i=0;i<3;i++){try{return await fetch(u,{headers:{Connection:'close'},signal:AbortSignal.timeout(12000)});}catch(e){err=e;}}throw err;}
const audit=[];
async function find(r){if(media[r.id]?.videoId)return;for(const query of aliases[r.id]??[r.name]){let attempts={id:r.id,query,candidates:[],reason:'No matching title'};try{const html=await request('https://www.youtube.com/results?search_query='+encodeURIComponent(query+' recipe')).then(x=>x.text());const marker='var ytInitialData = ',start=html.indexOf(marker);if(start<0){attempts.reason='No public results metadata';continue;}const part=html.slice(start+marker.length),tree=JSON.parse(part.slice(0,part.indexOf(';</script>'))),videos=[];const walk=x=>{if(!x||typeof x!=='object')return;if(x.videoRenderer)videos.push(x.videoRenderer);for(const v of Object.values(x))if(typeof v==='object')walk(v);};walk(tree);const words=normalize(query).split(' ').filter(Boolean);for(const v of videos.slice(0,30)){const title=(v.title?.runs??[]).map(x=>x.text).join('');attempts.candidates.push(title);if(!words.every(w=>normalize(title).includes(w)))continue;if(/muffins?|cake|cookies?/i.test(title)&&!/muffins?|cake|cookies?/i.test(r.name))continue;if(r.id==='ecuadorian-9'&&/yam|Colombia/i.test(title))continue;if(r.id==='puerto-rican-20'&&/bacalao/i.test(title))continue;const videoSource='https://www.youtube.com/watch?v='+v.videoId;const response=await request('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(videoSource));if(!response.ok){attempts.reason='Matched title but embedding disabled/unavailable';continue;}const o=await response.json();media[r.id]={...media[r.id],videoId:v.videoId,videoTitle:o.title,videoSource};if(!media[r.id].image)Object.assign(media[r.id],{image:o.thumbnail_url,imageSource:videoSource,imageCredit:o.author_name,imageLicense:'YouTube video thumbnail · external media'});console.log('FOUND',r.name,'→',o.title);attempts.reason='Verified';audit.push(attempts);return;}}catch(e){attempts.reason=e.message;}audit.push(attempts);}}
let i=0;await Promise.all(Array.from({length:3},async()=>{while(i<missing.length){await find(missing[i++]);await fs.writeFile(file,JSON.stringify(media,null,2)+'\n');}}));
await fs.writeFile(missingFile,JSON.stringify(missing.filter(r=>!media[r.id]?.videoId),null,2)+'\n');await fs.writeFile(new URL('../app/recipe-media-attempts.json',import.meta.url),JSON.stringify(audit,null,2)+'\n');console.log('Remaining',missing.filter(r=>!media[r.id]?.videoId));
