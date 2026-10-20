import fs from 'node:fs/promises';
const evidence=JSON.parse(await fs.readFile('scripts/english-expansion-source-evidence.json','utf8'));
const links={
'Pumpkin white bean soup':'https://cookeatlivelove.com/healthy-pumpkin-soup-recipe-with-white-beans/',
'Beet lentil bowl':'https://www.lentils.org/recipe/beet-lentil-salad/',
'Lentil stuffed eggplant':'https://minimalistbaker.com/moroccan-lentil-stuffed-eggplant/',
'Spinach ricotta whole-grain pasta':'https://www.budgetbytes.com/easy-spinach-ricotta-pasta/',
'Loubieh bi zeit':'https://www.linsfood.com/loubieh-bi-zeit-fasolia/',
'Fakes salad':'https://www.themediterraneandish.com/french-lentil-salad-recipe/',
'Pasta e fagioli':'https://www.themediterraneandish.com/vegetarian-pasta-fagioli-recipe/',
'Sweet potato black bean bake':'https://www.lazycatkitchen.com/sweet-potato-black-bean-bake/',
'Pla neung manao':'https://tastythais.com/thai-steamed-fish-with-lime/',
};
for(const [name,url]of Object.entries(links)){
 try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=await r.text();if(!r.ok)throw Error(r.status);evidence[name]={url:r.url,title:html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]||name,sourceKind:'variation',checkedAt:'2026-10-19'};}catch(e){console.log('Failed',name,e.message);}
}
const indexed={
'Garlic bok choy':['https://thewoksoflife.com/garlic-baby-bok-choy/','Garlic Baby Bok Choy Stir Fry'],
'Smashed cucumber salad':['https://thewoksoflife.com/smashed-asian-cucumber-salad/','Smashed Asian Cucumber Salad'],
'Garlic broccoli':['https://iheartumami.com/broccoli-with-garlic-sauce/','Broccoli With Garlic Sauce'],
'Shiitake bok choy':['https://thewoksoflife.com/braised-chinese-mushrooms-bok-choy/','Braised Chinese Mushrooms with Bok Choy'],
'Steamed eggplant':['https://thewoksoflife.com/steamed-chinese-eggplant-spicy/','Steamed Chinese Eggplant with Spicy Lao Gan Ma'],
'Chinese chive and egg':['https://thewoksoflife.com/chinese-chives-eggs/','Chinese Chives & Eggs Stir Fry'],
'Steamed fish with ginger':['https://thewoksoflife.com/cantonese-steamed-fish/','Cantonese Steamed Fish']};
for(const[name,[url,title]]of Object.entries(indexed))evidence[name]={url,title,checkedAt:'2026-10-19',verification:'Primary publisher page indexed in web search; direct fetch blocked by publisher security',sourceKind:'variation'};
await fs.writeFile('scripts/english-expansion-source-evidence.json',JSON.stringify(evidence,null,2)+'\n');
const file='app/diet-expansion-english.json',out=JSON.parse(await fs.readFile(file,'utf8'));
for(const r of Object.values(out).flat())if(evidence[r.name]){r.recipeSource=evidence[r.name].url;r.sourceKind='variation';}
await fs.writeFile(file,JSON.stringify(out,null,2)+'\n');console.log('Remaining',Object.values(out).flat().filter(r=>!r.recipeSource).map(r=>[r.id,r.name]));
