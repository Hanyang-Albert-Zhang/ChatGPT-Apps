import {getDb} from '../db';
import {records} from '../db/schema';
import {eq} from 'drizzle-orm';
import {localDate} from './fitness';
import {accountAccess} from './access-server';
export const superAdminEmail='hanyang.zhang@alumni.wfu.edu';
export const isSuperAdmin=(user:{email:string}|null)=>!!user&&user.email.toLowerCase()===superAdminEmail;
export async function isSiteAdmin(user:{userId:string;email:string}|null){if(!user)return false;if(isSuperAdmin(user))return true;const access=await accountAccess(user);if(access.removed||access.mode==='none')return false;const [row]=await getDb().select().from(records).where(eq(records.id,user.userId+':role'));return row?.kind==='adminRole'&&JSON.parse(row.payload).role==='admin';}
export async function registerAccount(user:{userId:string;email:string;displayName:string}){
 const db=getDb(),id=user.userId+':directory',[old]=await db.select().from(records).where(eq(records.id,id)),saved=old?JSON.parse(old.payload):{},now=Date.now();
 // A daily heartbeat is enough; avoid writes on every locale/account refresh.
 if(old&&old.date===localDate()&&saved.name===user.displayName&&saved.email===user.email)return;
 const payload=JSON.stringify({...saved,name:user.displayName,email:user.email,firstSeen:saved.firstSeen||now,lastSeen:now});
 await db.insert(records).values({id,userId:user.userId,kind:'accountDirectory',date:localDate(),payload}).onConflictDoUpdate({target:records.id,set:{payload,date:localDate()}});
}
