import baseCatalog from './exercise-catalog.json';import apartmentExercises from './apartment-exercises.json';import {apartmentCompatible} from './apartment-training';const catalog=[...baseCatalog,...apartmentExercises.map((e,i)=>({...e,id:'apartment:'+i,source:'Seediva apartment gym',category:e.type,muscles:[e.group],url:''}))];
import {catalogLabel,type Language} from './locale-core';
const normalize=(s:string)=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function searchExercises(query:string,source='All sources',language:Language='en',rawQuery=query,apartmentOnly=false){
 const q=normalize(query).slice(0,100),words=q.split(' ').filter(Boolean);
 const localized=normalize(rawQuery),localWords=localized.split(' ').filter(Boolean);
 if(q.length<2&&localized.length<1)return [];
 return catalog.filter(e=>(!apartmentOnly||apartmentCompatible(e))&&(source==='All sources'||e.source===source)).map(e=>{const name=normalize(e.name),haystack=normalize([e.name,e.category,e.equipment,...e.muscles].join(' '));const localName=normalize(catalogLabel(e.name,language)),localHaystack=normalize([localName,catalogLabel(e.category,language),catalogLabel(e.equipment,language),...e.muscles.map(m=>catalogLabel(m,language))].join(' '));const matches=(words.length>0&&words.every(w=>haystack.includes(w)))||(localWords.length>0&&localWords.every(w=>localHaystack.includes(w)));return {e,score:!matches?-1:(name===q||localName===localized)?100:name.startsWith(q)?80:name.includes(q)?60:words.every(w=>name.includes(w))?40:10};}).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score||(a.e.source==='NASM'?-1:1)-(b.e.source==='NASM'?-1:1)||a.e.name.localeCompare(b.e.name)).slice(0,30).map(x=>x.e);
}
