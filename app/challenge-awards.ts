import {reconcileUser} from './group-challenges-server';
import {getDb} from '../db';
import {records} from '../db/schema';
import {eq} from 'drizzle-orm';
import {challengesFor} from './challenges';
import {localDate} from './fitness';
// Only the server creates these rows. The unique record ID prevents duplicate awards.
export async function loadWithAwards(userId:string){
 await reconcileUser(userId);
 const db=getDb(),all=await db.select().from(records).where(eq(records.userId,userId));
 const parsed=all.map(r=>({...r,payload:JSON.parse(r.payload)}));
 const existing=new Set(parsed.filter(r=>r.kind==='challengeBadge').map(r=>r.payload.badgeId));
 const missing=challengesFor(parsed).filter(b=>b.earned&&!existing.has(b.id));
 if(missing.length){const earnedOn=localDate();await db.insert(records).values(missing.map(b=>({id:userId+':badge:'+b.id,userId,kind:'challengeBadge',date:earnedOn,payload:JSON.stringify({badgeId:b.id,earnedOn,qualifiedOn:b.qualifiedOn})}))).onConflictDoNothing();return (await db.select().from(records).where(eq(records.userId,userId))).map(r=>({...r,payload:JSON.parse(r.payload)}));}
 return parsed;
}
