import {canUse} from './access-server';
export async function recordAccess(user:{userId:string;email:string},kind:string,write=false){const pages=kind==='meal'?['Food diary','Nutrition report']:kind==='workout'?['Training plan','Workout report','Custom training plan']:['Goals'];if(!write)pages.push('Home','Trophies');for(const p of pages)if(await canUse(user,p))return true;return false;}
