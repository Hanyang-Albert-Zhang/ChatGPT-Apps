import {dietCollections,type DietCollection,type DietRecipe} from './diet-guide-data';
import type {Language} from './locale-core';
import chinese from './diet-expansion-chinese.json';
import english from './diet-expansion-english.json';
import spanish from './diet-expansion-spanish.json';
const additions=new Map<string,DietRecipe[]>();
additions.set('chinese',chinese as DietRecipe[]);
for(const [id,recipes] of Object.entries(english))additions.set(id,recipes as DietRecipe[]);
for(const c of spanish)additions.set(c.id,c.recipes as DietRecipe[]);
export const expandedDietCollections:DietCollection[]=[...dietCollections,...spanish.filter(c=>!dietCollections.some(base=>base.id===c.id)) as DietCollection[]].map(c=>({...c,recipes:dietCollections.some(base=>base.id===c.id)?[...c.recipes,...(additions.get(c.id)||[])]:c.recipes}));
export const preferredDietIds:Record<Language,string[]>={'zh-CN':['chinese'],en:['mediterranean','american','vegetarian','vegan','dash','keto'],es:['mexican','peruvian','ecuadorian','brazilian','puerto-rican']};
export function collectionsForLanguage(language:Language){const priority=preferredDietIds[language];return expandedDietCollections.map(c=>({...c,recipes:c.recipes.slice(0,language==='zh-CN'&&c.id==='chinese'?100:language==='en'&&preferredDietIds.en.includes(c.id)||language==='es'&&preferredDietIds.es.includes(c.id)?50:30)})).sort((a,b)=>{const ai=priority.indexOf(a.id),bi=priority.indexOf(b.id);return (ai<0?priority.length:ai)-(bi<0?priority.length:bi);});}
