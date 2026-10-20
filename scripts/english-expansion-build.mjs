import fs from 'node:fs';
const text=fs.readFileSync('app/diet-guide-data.ts','utf8');
const collections={};
for(const c of text.matchAll(/collection\('([^']+)'[^`]+`([^`]+)`\)/g)) collections[c[1]]=c[2].trim().split('\n').filter(Boolean).map((line,i)=>{const[name,foods,method]=line.split('|');return{id:c[1]+'-'+(i+1),name,ingredients:foods.split(','),method};});
if(process.argv.includes('--list')) for(const [id,rows]of Object.entries(collections))console.log(id+'\n'+rows.map(r=>r.name).join('\n')+'\n');
const picks={
mediterranean:['vegetarian-2','vegetarian-3','vegetarian-4','vegetarian-5','vegetarian-6','vegetarian-7','vegetarian-12','vegetarian-13','vegetarian-14','vegetarian-15','vegetarian-16','vegetarian-17','vegetarian-21','vegetarian-22','vegetarian-23','vegetarian-28','vegetarian-29','vegetarian-30','vegan-12','vegan-14'],
american:['vegetarian-1','vegetarian-3','vegetarian-4','vegetarian-5','vegetarian-6','vegetarian-7','vegetarian-8','vegetarian-9','vegetarian-10','vegetarian-11','vegetarian-12','vegetarian-13','vegetarian-14','vegetarian-15','vegetarian-16','vegetarian-18','vegetarian-20','vegetarian-24','vegetarian-25','vegetarian-30'],
vegetarian:['mediterranean-1','mediterranean-2','mediterranean-3','mediterranean-4','mediterranean-5','mediterranean-6','mediterranean-7','mediterranean-8','mediterranean-9','mediterranean-10','mediterranean-11','mediterranean-12','mediterranean-13','mediterranean-14','mediterranean-15','mediterranean-16','mediterranean-17','mediterranean-18','mediterranean-19','mediterranean-20'],
vegan:['mediterranean-1','mediterranean-2','mediterranean-3','mediterranean-4','mediterranean-5','mediterranean-7','mediterranean-8','mediterranean-9','mediterranean-10','mediterranean-11','mediterranean-12','mediterranean-13','mediterranean-14','mediterranean-15','mediterranean-16','mediterranean-17','mediterranean-18','mediterranean-19','mediterranean-20','mediterranean-21'],
dash:['american-1','american-3','american-4','american-5','american-7','american-8','american-9','american-10','american-11','american-12','american-13','american-14','american-15','american-16','american-17','american-18','american-20','american-21','american-22','american-24'],
keto:['chinese-1','chinese-2','chinese-6','chinese-7','chinese-13','chinese-17','chinese-23','chinese-24','chinese-27','japanese-15','japanese-16','japanese-18','japanese-23','japanese-24','japanese-25','japanese-26','thai-18','vegetarian-20','vegetarian-22','american-21']};
const original=Object.values(collections).flat();
const media=JSON.parse(fs.readFileSync('app/recipe-media.json','utf8'));
const translations={...JSON.parse(fs.readFileSync('app/diet-translations.json','utf8')),...JSON.parse(fs.readFileSync('app/ui-translations-extra.json','utf8'))};
const out={},outMedia={},outTranslations={};
for(const [id,ids]of Object.entries(picks))out[id]=ids.map((sourceId,i)=>{
 const source=original.find(r=>r.id===sourceId);if(!source)throw Error(sourceId);
 const recipe={...source,id:id+'-'+(i+31),fiberFoods:source.ingredients.filter(s=>/beans?|lentils?|chickpeas?|peas|cabbage|broccoli|greens|spinach|bok choy|eggplant|oats|barley|quinoa|rice|berries|apple|pear|chia|nuts|almond|walnut|artichoke|cauliflower|asparagus|beet|carrot|squash|sweet potato|corn|millet|bulgur|farro/i.test(s))};
 if(id==='dash')recipe.ingredients=recipe.ingredients.map(s=>/broth|canned/i.test(s)?'no-salt-added '+s:s);
 for(const key of [recipe.name,...recipe.ingredients])if(translations[key])outTranslations[key]=translations[key];
 outMedia[recipe.id]={...media[sourceId]};
 return recipe;
});
if(!process.argv.includes('--list')){
 fs.writeFileSync('app/diet-expansion-english.json',JSON.stringify(out,null,2)+'\n');
 fs.writeFileSync('app/diet-expansion-english-media.json',JSON.stringify(outMedia,null,2)+'\n');
 fs.writeFileSync('app/diet-expansion-english-translations.json',JSON.stringify(outTranslations,null,2)+'\n');
 console.log('Created',Object.values(out).flat().length,'recipes; missing translations',Object.values(out).flat().flatMap(r=>[r.name,...r.ingredients]).filter(s=>!outTranslations[s]));
}
