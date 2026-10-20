import catalog from './seedy-tip-catalog.json';
export type SeedyAction='meal'|'workout'|'Home'|'Food diary'|'Training plan'|'Nutrition report'|'Workout report'|'Goals'|'Body Measurements'|'Trophies'|'Inbox'|'Account'|'weight'|'Nutrition advice'|'workout-history'|'nutrition-history'|'feedback'|'Custom training plan'|'phone-notifications';
export const seedyTips=catalog.map(t=>({...t,action:t.action as SeedyAction}));
export const defaultTipIds=seedyTips.slice(0,20).map(t=>t.id);
export function validTipIds(ids:unknown){return Array.isArray(ids)?[...new Set(ids.filter((id):id is string=>typeof id==='string'&&seedyTips.some(t=>t.id===id)))].slice(0,50):[];}
export function nextTipInCycle(ids:string[],state:{shown?:string[];lastId?:string}={}){const selected=validTipIds(ids);if(!selected.length)return null;let shown=(state.shown||[]).filter(id=>selected.includes(id));let remaining=selected.filter(id=>!shown.includes(id));if(!remaining.length){shown=[];remaining=selected.filter(id=>id!==state.lastId);if(!remaining.length)remaining=selected;}const id=remaining[0];return {id,shown:[...shown,id],lastId:id};}
