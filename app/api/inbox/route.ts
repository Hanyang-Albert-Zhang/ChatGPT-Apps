import {readChatShare} from '../../chat-share-reader';
import {reconcileThread} from '../../group-challenges-server';
import {getChatGPTUser,ChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {chatThreads as threads,chatMembers as members,chatMessages as messages,chatBlocks as blocks,records} from '../../../db/schema';
import {and,or,eq,gt,lt,gte,desc,asc,inArray,isNull,sql} from 'drizzle-orm';
import {z} from 'zod';
import {makeChatShare,shareAttachment} from '../../chat-shares';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
const emailOf=(u:ChatGPTUser)=>u.email.trim().toLowerCase();
const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');
const uid=()=>crypto.randomUUID();
class ChatError extends Error{constructor(message:string,public status=400){super(message);}}
async function activeMember(db:ReturnType<typeof getDb>,threadId:string,u:ChatGPTUser){const [m]=await db.select().from(members).where(and(eq(members.threadId,threadId),eq(members.userId,u.userId),eq(members.status,'active')));if(!m)throw new ChatError('This conversation is unavailable.',404);return m;}
async function hasBlock(db:ReturnType<typeof getDb>,a:string,b:string){const [row]=await db.select().from(blocks).where(or(and(eq(blocks.ownerId,a),eq(blocks.blockedId,b)),and(eq(blocks.ownerId,b),eq(blocks.blockedId,a)))).limit(1);return !!row;}
async function invitation(db:ReturnType<typeof getDb>,u:ChatGPTUser,id?:string,token?:string){
 const [m]=await db.select().from(members).where(token?eq(members.inviteHash,await hash(token)):eq(members.id,id||''));
 if(!m||m.status!=='pending'||!m.expiresAt||m.expiresAt<Date.now()||(m.email&&m.email!==emailOf(u))||(!m.email&&!token))throw new ChatError('This invitation is unavailable or expired. Email invitations must be opened with the invited account.',404);
 const [t]=await db.select().from(threads).where(eq(threads.id,m.threadId));
 if(!t||await hasBlock(db,u.userId,t.createdBy))throw new ChatError('This invitation is unavailable.',404);
 const [owner]=await db.select().from(members).where(and(eq(members.threadId,t.id),eq(members.userId,t.createdBy)));
 return {m,t,owner};
}
export async function GET(req:Request){
 const u=await getChatGPTUser("Inbox");if(!u)return json({error:'Sign in to open your Inbox.'},401);
 try{
  const db=getDb(),url=new URL(req.url),threadId=url.searchParams.get('thread');
  if(threadId){
   await activeMember(db,threadId,u);await reconcileThread(threadId);
   const [thread]=await db.select().from(threads).where(eq(threads.id,threadId));
   const [setting]=await db.select().from(records).where(eq(records.id,threadId+':settings'));(thread as any).icon=setting?JSON.parse(setting.payload).icon:'exercise';const participants=await db.select().from(members).where(eq(members.threadId,threadId));
   const before=url.searchParams.get('before');let condition=eq(messages.threadId,threadId);
   if(before){const [anchor]=await db.select().from(messages).where(and(eq(messages.threadId,threadId),eq(messages.id,before)));if(!anchor)throw new ChatError('Message unavailable.',404);condition=and(condition,or(lt(messages.createdAt,anchor.createdAt),and(eq(messages.createdAt,anchor.createdAt),lt(messages.id,anchor.id))))!;}
   const page=await db.select().from(messages).where(condition).orderBy(desc(messages.createdAt),desc(messages.id)).limit(51);
   return json({thread,participants:participants.map(p=>({id:p.id,userId:p.userId,name:p.name,status:p.status,...(thread.createdBy===u.userId?{contact:p.contact}:{})})),messages:page.slice(0,50).reverse().map(m=>({...m,share:m.share?(()=>{const s=readChatShare(m.share);return s?{...s,...(s.image?{image:'available'}:{}),...(s.html?{html:'available'}:{})}:null;})():null})),hasEarlier:page.length>50});
  }
  const mine=await db.select().from(members).where(and(eq(members.userId,u.userId),eq(members.status,'active')));
  const myBlocks=await db.select().from(blocks).where(eq(blocks.ownerId,u.userId));const blocked=new Set(myBlocks.map(b=>b.blockedId));
  const pending=await db.select().from(members).where(and(eq(members.email,emailOf(u)),eq(members.status,'pending'),gt(members.expiresAt,Date.now())));
  const invitations=[];for(const p of pending){const [t]=await db.select().from(threads).where(eq(threads.id,p.threadId));if(t&&!blocked.has(t.createdBy)&&!mine.some(m=>m.threadId===t.id)){const [owner]=await db.select().from(members).where(and(eq(members.threadId,t.id),eq(members.userId,t.createdBy)));invitations.push({id:p.id,title:t.title,isGroup:t.isGroup,from:owner?.name||'Seediva friend'});}}
  const conversations=[];for(const m of mine){const [t]=await db.select().from(threads).where(eq(threads.id,m.threadId));if(!t)continue;const participants=await db.select().from(members).where(eq(members.threadId,t.id));const [last]=await db.select().from(messages).where(eq(messages.threadId,t.id)).orderBy(desc(messages.createdAt),desc(messages.id)).limit(1);const [count]=await db.select({n:sql<number>`count(*)`}).from(messages).where(and(eq(messages.threadId,t.id),gt(messages.createdAt,m.lastReadAt),sql`${messages.senderId} <> ${u.userId}`));const [setting]=await db.select().from(records).where(eq(records.id,t.id+':settings'));conversations.push({...t,icon:setting?JSON.parse(setting.payload).icon:'exercise',title:t.isGroup?t.title:participants.find(p=>p.userId!==u.userId&&p.status!=='left')?.name||t.title,participants:participants.map(p=>({name:p.name,status:p.status,userId:p.userId})),unread:count.n,last:last?{body:last.body,shareTitle:last.share?readChatShare(last.share)?.title:null,createdAt:last.createdAt}:null});}
  const [lastPicture]=await db.select().from(messages).where(and(eq(messages.senderId,u.userId),sql`CASE WHEN json_valid(${messages.share}) THEN json_extract(${messages.share}, '$.kind') ELSE NULL END = 'trophy'`)).orderBy(desc(messages.createdAt),desc(messages.id)).limit(1);const backgroundIndex=lastPicture?((readChatShare(lastPicture.share)?.backgroundIndex??-1)+1)%4:0;return json({user:{id:u.userId,name:u.displayName,email:u.email,backgroundIndex},conversations:conversations.sort((a,b)=>b.updatedAt-a.updatedAt),invitations});
 }catch(e){return json({error:e instanceof ChatError?e.message:'Inbox is unavailable. Please try again.'},e instanceof ChatError?e.status:503);}
}
const contact=z.string().trim().min(3).max(254).refine(s=>z.string().email().safeParse(s).success||/^\+?[\d ()-]{7,22}$/.test(s),'Enter an email address or phone number.');
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const input=z.discriminatedUnion('action',[
 z.object({action:z.literal('create'),title:z.string().trim().max(80).default(''),isGroup:z.boolean().default(false),contacts:z.array(contact).min(1).max(19),icon:z.enum(['run','dumbbell','exercise','plate','vegetables','leaf','flame','trophy','smile','laugh','heart','sun']).optional()}),
 z.object({action:z.literal('invite'),threadId:z.string().uuid(),contacts:z.array(contact).min(1).max(19)}),
 z.object({action:z.literal('send'),threadId:z.string().uuid(),body:z.string().trim().max(4000).default(''),share:z.object({kind:z.enum(['nutrition','workout','trophy']),start:date,end:date}).optional(),clientId:z.string().uuid()}),
 z.object({action:z.literal('read'),threadId:z.string().uuid(),through:z.number().int().min(0)}),
 z.object({action:z.literal('leave'),threadId:z.string().uuid(),block:z.boolean().default(false)}),
 z.object({action:z.literal('accept'),invitationId:z.string().uuid().optional(),token:z.string().min(32).max(100).optional()}),
 z.object({action:z.literal('decline'),invitationId:z.string().uuid().optional(),token:z.string().min(32).max(100).optional()}),
 z.object({action:z.literal('previewInvite'),token:z.string().min(32).max(100)}),
 z.object({action:z.literal('reissue'),threadId:z.string().uuid(),memberId:z.string().uuid()}),
]);
export async function POST(req:Request){
 const u=await getChatGPTUser("Inbox");if(!u)return json({error:'Sign in to use Inbox.'},401);
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return json({error:'Invalid origin.'},403);
 try{
  if(Number(req.headers.get('content-length')||0)>20000)throw new ChatError('Message too large.',413);
  const b=input.parse(await req.json()),db=getDb(),now=Date.now();
  if(b.action==='previewInvite'||b.action==='accept'||b.action==='decline'){
   const {m,t,owner}=await invitation(db,u,'invitationId' in b?b.invitationId:undefined,b.token);
   if(b.action==='previewInvite')return json({invitation:{id:m.id,title:t.title,from:owner?.name||'Seediva friend',isGroup:t.isGroup}});
   if(b.action==='decline'){await db.update(members).set({status:'declined',inviteHash:null}).where(and(eq(members.id,m.id),eq(members.status,'pending')));return json({ok:true});}
   const [existing]=await db.select().from(members).where(and(eq(members.threadId,t.id),eq(members.userId,u.userId)));
   if(existing)throw new ChatError('You already have a membership in this conversation.',409);
   const accepted=await db.update(members).set({userId:u.userId,name:u.displayName,status:'active',joinedAt:now,lastReadAt:0,inviteHash:null}).where(and(eq(members.id,m.id),eq(members.status,'pending'),isNull(members.userId))).returning({id:members.id});
   if(!accepted.length)throw new ChatError('This invitation was already accepted.',409);
   return json({threadId:t.id});
  }
  if(b.action==='create'||b.action==='invite'){
   const contacts=[...new Set(b.contacts.map(c=>c.includes('@')?c.toLowerCase():c.replace(/[^+\d]/g,'')))];if(contacts.includes(emailOf(u)))throw new ChatError('Add a friend’s email or phone number, rather than your own.');
   const [rate]=await db.select({n:sql<number>`count(*)`}).from(threads).where(and(eq(threads.createdBy,u.userId),gte(threads.createdAt,now-86400000)));if(b.action==='create'&&rate.n>=30)throw new ChatError('You have created many chats today. Try again tomorrow.',429);
   let threadId:string,group:boolean;
   if(b.action==='invite'){await activeMember(db,b.threadId,u);const [t]=await db.select().from(threads).where(eq(threads.id,b.threadId));if(!t?.isGroup||t.createdBy!==u.userId)throw new ChatError('Only the group creator can invite more people.',403);threadId=t.id;group=true;}else{threadId=uid();group=b.isGroup||contacts.length>1;}
   const existing=b.action==='invite'?await db.select().from(members).where(eq(members.threadId,threadId)):[];
   const fresh=contacts.filter(c=>!existing.some(p=>p.contact===c));if(!fresh.length)throw new ChatError('Those contacts are already in this chat.');if(existing.length+fresh.length>20)throw new ChatError('A group can have up to 20 people.');
   const invites=[];const values=[];
   for(const c of fresh){const isEmail=c.includes('@'),token=uid().replaceAll('-','')+uid().replaceAll('-','');values.push({id:uid(),threadId,userId:null,email:isEmail?c:null,contact:c,name:isEmail?c.split('@')[0]:c,status:'pending',inviteHash:await hash(token),expiresAt:now+7*86400000,joinedAt:null,lastReadAt:0});invites.push({contact:c,url:new URL('/#Inbox?invite='+token,req.url).href,email:isEmail});}
   const queries:any[]=[];
   if(b.action==='create'){queries.push(db.insert(threads).values({id:threadId,title:b.title||(group?'My Seediva group':values[0].name),isGroup:group?1:0,createdBy:u.userId,createdAt:now,updatedAt:now}));queries.push(db.insert(members).values({id:uid(),threadId,userId:u.userId,email:emailOf(u),contact:u.email,name:u.displayName,status:'active',joinedAt:now,lastReadAt:now}));}
   if(b.action==='create'&&group)queries.push(db.insert(records).values({id:threadId+':settings',userId:u.userId,kind:'groupSettings',date:new Date().toISOString().slice(0,10),payload:JSON.stringify({icon:b.icon||'exercise'})}));queries.push(db.insert(members).values(values));await db.batch(queries as any);
   return json({threadId,invitations:invites});
  }
  const own=await activeMember(db,b.threadId,u);
  if(b.action==='reissue'){
   const [t]=await db.select().from(threads).where(eq(threads.id,b.threadId));const [m]=await db.select().from(members).where(and(eq(members.id,b.memberId),eq(members.threadId,b.threadId),eq(members.status,'pending')));
   if(t.createdBy!==u.userId||!m)throw new ChatError('Only the creator can replace a pending invitation.',403);
   const token=uid().replaceAll('-','')+uid().replaceAll('-','');await db.update(members).set({inviteHash:await hash(token),expiresAt:now+7*86400000}).where(and(eq(members.id,m.id),eq(members.status,'pending')));
   return json({invitations:[{contact:m.contact,url:new URL('/#Inbox?invite='+token,req.url).href,email:!!m.email}]});
  }
  if(b.action==='read'){await db.update(members).set({lastReadAt:Math.max(own.lastReadAt,Math.min(b.through,now))}).where(eq(members.id,own.id));return json({ok:true});}
  if(b.action==='leave'){
   const people=await db.select().from(members).where(eq(members.threadId,b.threadId));const queries:any[]=[db.update(members).set({status:'left'}).where(eq(members.id,own.id))];
   if(b.block){const [t]=await db.select().from(threads).where(eq(threads.id,b.threadId));const targets=t.isGroup?[t.createdBy]:people.filter(p=>p.userId&&p.userId!==u.userId).map(p=>p.userId!);for(const target of targets){if(target!==u.userId)queries.push(db.insert(blocks).values({id:uid(),ownerId:u.userId,blockedId:target}).onConflictDoNothing());}}
   await db.batch(queries as any);return json({ok:true});
  }
  if(b.action==='send'){
   if(!b.body&&!b.share)throw new ChatError('Write a message or choose progress to share.');
   const [duplicate]=await db.select().from(messages).where(eq(messages.id,b.clientId));if(duplicate){if(duplicate.senderId!==u.userId||duplicate.threadId!==b.threadId)throw new ChatError('Invalid message identifier.',409);return json({id:duplicate.id,share:duplicate.share?readChatShare(duplicate.share):null});}
   const people=await db.select().from(members).where(and(eq(members.threadId,b.threadId),eq(members.status,'active')));for(const p of people){if(p.userId&&p.userId!==u.userId&&await hasBlock(db,u.userId,p.userId))throw new ChatError('This conversation cannot receive your message.',403);}
   const [minute]=await db.select({n:sql<number>`count(*)`}).from(messages).where(and(eq(messages.senderId,u.userId),gte(messages.createdAt,now-60000)));if(minute.n>=30)throw new ChatError('Please wait a moment before sending another message.',429);
   let share=null;
   if(b.share){if(b.share.start>b.share.end)throw new ChatError('The start date must be before the end date.');const rows=await db.select().from(records).where(eq(records.userId,u.userId));const recent=await db.select().from(messages).where(and(eq(messages.senderId,u.userId),sql`CASE WHEN json_valid(${messages.share}) THEN json_extract(${messages.share}, '$.kind') ELSE NULL END = 'trophy'`)).orderBy(desc(messages.createdAt),desc(messages.id)).limit(1);const previous=recent.map(m=>readChatShare(m.share)).find(s=>s?.kind==='trophy'&&typeof s.backgroundIndex==='number');const backgroundIndex=previous?((previous.backgroundIndex??-1)+1)%4:0;const parsed=rows.map(r=>({...r,payload:JSON.parse(r.payload)}));share=shareAttachment(makeChatShare(parsed,b.share.kind,b.share.start,b.share.end),parsed,u.displayName,backgroundIndex);}
   await db.batch([db.insert(messages).values({id:b.clientId,threadId:b.threadId,senderId:u.userId,senderName:u.displayName,body:b.body,share:share?JSON.stringify(share):null,createdAt:now}),db.update(threads).set({updatedAt:now}).where(eq(threads.id,b.threadId))]);return json({id:b.clientId,share});
  }
  throw new ChatError('Unknown action.');
 }catch(e){return json({error:e instanceof z.ZodError?'Check the contact, message and dates.':e instanceof ChatError?e.message:'Could not update Inbox. Please try again.'},e instanceof ChatError?e.status:e instanceof z.ZodError?400:503);}
}

