export type NutritionProduct={id:string;name:string;source:string;url:string;per100:Record<string,number|null>;servingGrams?:number;servingLabel?:string;perServing?:Record<string,number|null>;description?:string;aliases?:string};
export function parseFoodInput(input:string){
 let text=input.toLowerCase().replace(/^(?:i ate|i had|i am eating)\s+/,'').trim();
 const words:Record<string,string>={a:'1',an:'1',one:'1',two:'2',three:'3',four:'4',five:'5',six:'6',half:'0.5'};text=text.replace(/^(a|an|one|two|three|four|five|six|half)\b/,w=>words[w]);
 const amount=text.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*/);let count=1,grams:number|null=null,unit='item';
 if(amount){count=amount[1].includes('/')?Number(amount[1].split('/')[0])/Number(amount[1].split('/')[1]):Number(amount[1]);text=text.slice(amount[0].length);const u=text.match(/^(grams?|g|ounces?|oz|pounds?|lbs?|cups?|servings?|pieces?|slices?|eggs?)\b\s*/i);if(u){unit=u[1];if(/^(g|gram|oz|ounce|lb|pound)/.test(unit)){grams=count*(/^oz|ounce/.test(unit)?28.3495:/^lb|pound/.test(unit)?453.592:1);count=1;}if(!/^egg/.test(unit))text=text.slice(u[0].length);}}
 const size=text.match(/\b(extra large|small|medium|large|jumbo)\b/)?.[0];text=text.replace(/\b(extra large|small|medium|large|jumbo)\b/g,'').replace(/hard[- ]boiled|hard[- ]cooked/g,'boiled').replace(/\beggs\b/g,'egg').replace(/\bbananas\b/g,'banana').replace(/\bapples\b/g,'apple').replace(/\bgrilled chicken\b/g,'chicken breast').replace(/\s+/g,' ').trim();
 return {query:text||input,count,grams,unit,size};
}
export function portionFor(input:ReturnType<typeof parseFoodInput>,product?:NutritionProduct){
 if(input.grams!==null)return {grams:input.grams,note:'Weight taken from your description.'};
 if(/^(?:(?:boiled|cooked|scrambled|fried|poached|raw|whole)\s+)*egg(?:\s+(?:boiled|cooked|scrambled|fried|poached|raw|whole))*$/.test(input.query)&&!/^cups?$/.test(input.unit)){const weight=({small:38,medium:44,large:50,'extra large':56,jumbo:63} as Record<string,number>)[input.size||'large'];return {grams:weight*input.count,note:input.count+' '+(input.size||'large')+' egg(s), about '+weight+'g each.'};}
 if(product?.servingGrams&&(!/^cup|slice/.test(input.unit)||product.servingLabel?.toLowerCase().includes(input.unit.replace(/s$/,''))))return {grams:product.servingGrams*input.count,note:input.count+' × '+(product.servingLabel||'reference serving')+'. Confirm the portion below.'};
 return {grams:100,note:'No matching serving size available; start at 100g and adjust the portion below.'};
}
export function parseWebNutrition(html:string,id:string):NutritionProduct|null{
 const value=(cls:string)=>{const found=html.match(new RegExp('<(?:span|td)[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>\\s*([\\d,.]+)(?:g)?\\s*</'));return found?Number(found[1].replaceAll(',','')):null;};
 const name=html.match(/<title>Nutrition Facts for\s*([^<]+)<\/title>/i)?.[1]?.trim();
 const calories=value('ENERC_KCAL');if(!name||calories===null||calories>950)return null;
 const serving=html.match(/<span class="selectedServing">([^<]+)<\/span>/)?.[1]?.trim(),weight=html.match(/<span class="foodWeight">([\d.]+)g<\/span>/)?.[1];
 return {id,name,source:'MyFoodData · USDA web reference',url:'https://tools.myfooddata.com/nutrition-facts/'+id+'/100g',per100:{calories,carbs:value('CHOCDF'),protein:value('PROCNT'),fiber:value('FIBTG'),fat:value('FAT')},...(serving&&!serving.includes('100 grams')&&weight?{servingGrams:Number(weight),servingLabel:serving}:{})};
}
export async function searchWebNutrition(query:string,fetcher:typeof fetch=fetch){
 const search='https://www.myfooddata.com/search?search='+encodeURIComponent(query);const response=await fetcher(search,{signal:AbortSignal.timeout(6000)});if(!response.ok)return [];
 const html=(await response.text()).slice(0,1500000),ids=[...new Set([...html.matchAll(/https:\/\/tools\.myfooddata\.com\/nutrition-facts\/(\d+)\//g)].map(m=>m[1]))].slice(0,3);
 const result=await Promise.all(ids.map(async id=>{try{const page=await fetcher('https://tools.myfooddata.com/nutrition-facts/'+id+'/100g',{signal:AbortSignal.timeout(6000)});return page.ok?parseWebNutrition((await page.text()).slice(0,1500000),id):null;}catch{return null;}}));
 return result.filter((p):p is NutritionProduct=>!!p);
}

export function nutritionTotals(items:{products:NutritionProduct[];selected:number;grams:string;servings:string}[]){const totals:Record<string,number|''>={};for(const key of ['calories','carbs','protein','fiber','fat']){let missing=false,total=0;for(const item of items){const p=item.products[item.selected],nutrient=p&&(p.perServing||p.per100)[key];if(nutrient==null){missing=true;continue;}total+=nutrient*(p.perServing?Number(item.servings):Number(item.grams)/100);}totals[key]=missing?'':Math.round(total*10)/10;}return totals;}

export function foodClauses(description:string){return description.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,5);}
