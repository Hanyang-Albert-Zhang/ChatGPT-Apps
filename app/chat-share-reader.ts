import type {ChatShare} from './chat-shares';
const text=(value:unknown,fallback='')=>typeof value==='string'?value:fallback;
const date=(value:unknown)=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:'';
export function readChatShare(value:unknown):ChatShare|null{
 let s:any=value;try{if(typeof s==='string')s=JSON.parse(s);}catch{return null;}
 if(!s||typeof s!=='object'||Array.isArray(s))return null;
 const kind=['nutrition','workout','trophy','challenge'].includes(s.kind)?s.kind:'nutrition';
 const items=(Array.isArray(s.items)?s.items:[]).filter((r:any)=>r&&typeof r==='object').map((r:any)=>({date:date(r.date),name:text(r.name,'Entry'),detail:text(r.detail)}));
 return {kind,title:text(s.title,'Shared progress'),summary:text(s.summary),start:date(s.start),end:date(s.end),items,totalItems:Number.isFinite(s.totalItems)?s.totalItems:items.length,createdAt:Number.isFinite(s.createdAt)?s.createdAt:0,...(typeof s.image==='string'?{image:s.image}:{}),...(typeof s.html==='string'?{html:s.html}:{}),...(Number.isFinite(s.backgroundIndex)?{backgroundIndex:s.backgroundIndex}:{})};
}
