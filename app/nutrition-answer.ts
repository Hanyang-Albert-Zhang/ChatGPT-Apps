export function parseNutritionAnswer(text:string){
 const labels:Record<string,string>={calories:'calories|energy|calorías|calorias|energía|热量|熱量',carbs:'carbohydrates?|carbs?|carbohidratos|碳水化合物|碳水',protein:'proteins?|proteínas?|proteinas?|蛋白质|蛋白質',fiber:'dietary fiber|fibre|fiber|fibra|膳食纤维|纤维|纖維',fat:'total fat|fats?|grasas?|脂肪'};
 const result:Record<string,number>={};
 for(const [key,label] of Object.entries(labels)){const hits=new Set<number>();for(const line of text.split(/[\n;]/)){const a=new RegExp('(?:'+label+')\\s*[:：=]?\\s*(\\d+(?:[.,]\\d+)?)\\s*(kcal|calories|g|grams?|克|大卡|千卡)?','ig'),b=new RegExp('(\\d+(?:[.,]\\d+)?)\\s*(kcal|calories|g|grams?|克|大卡|千卡)\\s*(?:of\\s+)?(?:'+label+')','ig');for(const regex of [a,b])for(const m of line.matchAll(regex)){if(/^\s*(?:mg\b|mcg\b|kg\b|kJ\b|%|[-–—]\s*\d)/i.test(line.slice((m.index||0)+m[0].length)))continue;const n=Number(/^\d+,\d{3}$/.test(m[1])?m[1].replace(',',''):m[1].replace(',','.'));if(Number.isFinite(n)&&n<=100000)hits.add(n);}}if(hits.size===1)result[key]=[...hits][0];}
 return result;
}

