import {getDb} from '../db';
import {records} from '../db/schema';
import {inArray} from 'drizzle-orm';
export const appPages=['Home','Food diary','Nutrition advice','Nutrition report','Training plan','Custom training plan','Workout report','Goals','Trophies','Inbox','Account'] as const;
export async function accountAccess(user:{userId:string;email:string}){
 if(user.email.toLowerCase()==='hanyang.zhang@alumni.wfu.edu')return {mode:'all',pages:[...appPages],removed:false};
 const rows=await getDb().select().from(records).where(inArray(records.id,[user.userId+':access','invite:'+user.email.toLowerCase()]));
 const row=rows.find(r=>r.id===user.userId+':access')||rows[0];
 return row?JSON.parse(row.payload):{mode:'all',pages:[...appPages],removed:false};
}
export async function canUse(user:{userId:string;email:string},page?:string|string[]){const access=await accountAccess(user);return !access.removed&&access.mode!=='none'&&(access.mode==='all'||!page||(Array.isArray(page)?page.some(p=>access.pages?.includes(p)):access.pages?.includes(page)));}
