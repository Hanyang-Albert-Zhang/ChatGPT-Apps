import zh from './locale-zh.json';
import es from './locale-es.json';
import terms from './catalog-terms.json';
import updatedTerms from './catalog-terms-v39.json';
import extra from './ui-translations-extra.json';
import social from './social-translations.json';
import group from './group-challenge-translations.json';
import diet from './diet-translations.json';
import chineseExpansion from './diet-expansion-chinese-translations.json';
import englishExpansion from './diet-expansion-english-translations.json';
import spanishExpansion from './diet-expansion-spanish-translations.json';
export type Language='en'|'zh-CN'|'es';
export const supportedLanguages:Language[]=['en','zh-CN','es'];
export function languageOf(value:unknown):Language{return supportedLanguages.includes(value as Language)?value as Language:'en';}
const extraPairs=Object.fromEntries(Object.entries({...extra,...diet,...chineseExpansion,...englishExpansion,...spanishExpansion,...group,...social}).map(([key,pair])=>[key.trim(),pair.map(v=>v.trim())])) as unknown as Record<string,[string,string]>;
const maps:Record<string,Record<string,string>>={'zh-CN':{...zh,...Object.fromEntries(Object.entries(extraPairs).map(([k,v])=>[k,v[0]]))},es:{...es,...Object.fromEntries(Object.entries(extraPairs).map(([k,v])=>[k,v[1]]))}};
const vocabulary=Object.fromEntries(Object.entries({...terms,...updatedTerms}).map(([key,value])=>[key.toLowerCase(),value])) as unknown as Record<string,[string,string]>;
type Trie={children:Map<string,Trie>;value?:string};
function makeTrie(dictionary:Record<string,string>){const root:Trie={children:new Map()};for(const [key,value] of Object.entries(dictionary)){if(!key||!value)continue;let node=root;for(const letter of key.toLowerCase()){if(!node.children.has(letter))node.children.set(letter,{children:new Map()});node=node.children.get(letter)!;}node.value=value;}return root;}
function substitute(input:string,root:Trie,query=false){const lower=input.toLowerCase(),letter=/\p{L}/u;let out='',i=0;while(i<input.length){let node=root,j=i,end=i,replacement='';while(j<lower.length&&node.children.has(lower[j])){node=node.children.get(lower[j])!;j++;if(node.value){const cjk=query&&/[\u3400-\u9fff]/.test(lower.slice(i,j)),before=lower[i-1]||'',after=lower[j]||'';if(cjk||(!(letter.test(lower[i])&&letter.test(before))&&!(letter.test(lower[j-1])&&letter.test(after)))){end=j;replacement=node.value;}}}if(end>i){out+=query?' '+replacement+' ':replacement;i=end;}else{out+=input[i];i++;}}return out;}
const textTries:Record<string,Trie>={},catalogTries:Record<string,Trie>={};
function textTrie(language:Language){return textTries[language]??=(makeTrie({...Object.fromEntries(Object.entries(vocabulary).map(([k,v])=>[k,v[language==='zh-CN'?0:1]])),...maps[language]}));}
function catalogTrie(language:Language){return catalogTries[language]??=(makeTrie({...Object.fromEntries(Object.entries(vocabulary).map(([k,v])=>[k,v[language==='zh-CN'?0:1]])),...Object.fromEntries(Object.entries(extraPairs).map(([k,v])=>[k,v[language==='zh-CN'?0:1]]))}));}
const cache=new Map<string,string>();
export function translate(value:string,language:Language):string{
 if(language==='en'||!/[A-Za-z]/.test(value))return value;
 const key=language+'\0'+value;if(cache.has(key))return cache.get(key)!;
 const dict=maps[language]||{},trim=value.trim(),exact=dict[trim]||dict[trim.replace(/Seediva/g,'FitDiet')];
 let result=exact;
 const date=trim.match(/^(?:[A-Za-z]+ - )?([A-Za-z]+) (\d{1,2}), (\d{4})$/);
 if(!result&&date){const parsed=new Date(date[1]+' '+date[2]+', '+date[3]+' 12:00:00 UTC');if(!Number.isNaN(parsed.valueOf()))result=new Intl.DateTimeFormat(language,{timeZone:'UTC',year:'numeric',month:'long',day:'numeric',...(trim.includes(' - ')?{weekday:'long' as const}:{})}).format(parsed);}
 if(!result){result=trim;
  // Replace complete phrases first, preserving numeric values and user names in dynamic labels.
  result=substitute(result,textTrie(language));
  result=result.replace(/FitDiet/g,'Seediva');
  if(language==='zh-CN')result=result.replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff])/g,'$1');
 }
 const output=value.replace(trim,result);if(cache.size>10000)cache.clear();cache.set(key,output);return output;
}
export function catalogLabel(name:string,language:Language){if(language==='en')return name;const trim=name.trim(),index=language==='zh-CN'?0:1,exact=extraPairs[trim]?.[index]||vocabulary[trim.toLowerCase()]?.[index];return exact||substitute(name,catalogTrie(language)).replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff])/g,'$1');}
export function localizeMarkup(markup:string,language:Language):string{
 if(language==='en')return markup;
 let blocked=false;
 return markup.replace(/(<[^>]+>)|([^<]+)/g,(whole,tag,text)=>{
  if(tag){if(/^<(style|script)\b/i.test(tag))blocked=true;else if(/^<\/(style|script)>/i.test(tag))blocked=false;
   return tag.replace(/(<html\b[^>]*\blang=)["'][^"']+["']/i,'$1"'+language+'"').replace(/(\b(?:alt|title|aria-label)=)(["'])(.*?)\2/gi,(_m:string,prefix:string,_quote:string,label:string)=>prefix+'"'+translate(label,language).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))+'"');}
  if(blocked)return text;
  const decoded=text.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");
  return translate(decoded,language).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 });
}
const queryAliases:Record<string,string>={'水煮蛋':'boiled egg','煮鸡蛋':'boiled egg','鸡胸肉':'chicken breast','西兰花':'broccoli','深蹲':'squat','卧推':'bench press','俯卧撑':'push up','硬拉':'deadlift','跑步':'run','步行':'walk','哑铃':'dumbbell','huevo cocido':'boiled egg','huevos cocidos':'boiled eggs','sentadillas':'squat','press de banca':'bench press','flexiones':'push up','pechuga de pollo':'chicken breast','克':'g','公斤':'kg','千克':'kg','公克':'g','gramos':'g','grammes':'g'};
for(const [en,translations] of Object.entries(vocabulary))for(const local of translations)if(local.trim()&&local.toLowerCase()!==en&&!queryAliases[local.toLowerCase()])queryAliases[local.toLowerCase()]=en;
for(const [en,translations] of Object.entries(extraPairs))for(const local of translations)if(local.trim()&&local.toLowerCase()!==en.toLowerCase()&&!queryAliases[local.toLowerCase()])queryAliases[local.toLowerCase()]=en.toLowerCase();
let queryTrie:Trie|undefined;
export function englishQuery(value:string,language:Language='en'):string{
 let text=value.normalize('NFKC').toLowerCase();
 if(language==='en'&&!/[\u3400-\u9fff]/.test(text))return text.replace(/\s+/g,' ').trim();
 text=substitute(text,queryTrie??=makeTrie(queryAliases),true);
 return text.replace(/\s+/g,' ').trim();
}

