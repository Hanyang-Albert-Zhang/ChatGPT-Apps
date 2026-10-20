import {getDb} from '../db';
import {chatMembers,chatBlocks} from '../db/schema';
import {and,or,eq,inArray} from 'drizzle-orm';
export async function friendsFor(userId:string){
 const db=getDb(),own=await db.select().from(chatMembers).where(and(eq(chatMembers.userId,userId),eq(chatMembers.status,'active')));
 if(!own.length)return [];
 const peers=await db.select().from(chatMembers).where(and(inArray(chatMembers.threadId,own.map(m=>m.threadId)),eq(chatMembers.status,'active')));
 const blocks=await db.select().from(chatBlocks).where(or(eq(chatBlocks.ownerId,userId),eq(chatBlocks.blockedId,userId)));
 const excluded=new Set(blocks.map(b=>b.ownerId===userId?b.blockedId:b.ownerId));
 return [...new Map(peers.filter(p=>p.userId&&p.userId!==userId&&!excluded.has(p.userId)).map(p=>[p.userId,{id:p.userId!,name:p.name}])).values()];
}
