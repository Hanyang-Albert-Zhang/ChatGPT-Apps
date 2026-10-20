import {registeredProfiles,globalLeaderboard,reconcileLeaderboard} from '../../leaderboard-server';
import {sendPunchPush} from "../../push-server";
import {friendsFor} from '../../friends-server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {records,chatMembers,chatBlocks} from '../../../db/schema';
import {and,or,eq,inArray} from 'drizzle-orm';
import {z} from 'zod';
import {loadWithAwards} from '../../challenge-awards';
import {rewardsFor} from '../../rewards';
import {localDate} from '../../fitness';
import {trophyStats} from '../../trophy-stats';
export const dynamic='force-dynamic';
const json=(value:any,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});

export async function GET(req:Request){
 const requested=new URL(req.url).searchParams;const u=await getChatGPTUser(requested.has('friend')||requested.get('view')==='leaderboard'?'Trophies':['Inbox','Trophies']);if(!u)return json({error:'Sign in required.'},401);
 try{const friends=await friendsFor(u.userId),id=new URL(req.url).searchParams.get('friend');
 if(new URL(req.url).searchParams.get('view')==='leaderboard'){
 await reconcileLeaderboard();const leaderboard=await globalLeaderboard();return json({leaderboard:leaderboard.map(({firstSeen,...x})=>({...x,isYou:x.id===u.userId}))});
 }
 if(id){const accepted=friends.find(f=>f.id===id),friend=accepted||(await registeredProfiles()).find(f=>f.id===id);if(!friend)return json({error:'Trophy profile unavailable.'},404);
 const all=await loadWithAwards(id),r=rewardsFor(all),showcase=all.find(x=>x.kind==='trophyShowcase')?.payload.badgeIds||[];
 return json({friend:{id:friend.id,name:friend.name},isFriend:!!accepted,stats:accepted?trophyStats(all):null,rank:{tier:r.tier,level:r.level,peak:r.peak,levelLabel:r.levelLabel,xp:r.xp,next:r.next},badges:r.badges.filter(b=>b.earned),showcase});}
 const own=await getDb().select().from(records).where(eq(records.userId,u.userId));
 const parsed=own.map(r=>({...r,payload:JSON.parse(r.payload)}));
 const notifications=parsed.filter(r=>r.kind==='punch'&&friends.some(f=>f.id===r.payload.senderId)).sort((a,b)=>b.payload.createdAt-a.payload.createdAt).slice(0,50).map(r=>({id:r.id,...r.payload}));
 return json({friends,showcase:parsed.find(r=>r.kind==='trophyShowcase')?.payload.badgeIds||[],notifications,unread:notifications.filter(n=>!n.readAt).length});
 }catch{return json({error:'Could not load friends. Please retry.'},503);}
}
const action=z.discriminatedUnion('action',[
 z.object({action:z.literal('showcase'),badgeIds:z.array(z.string().max(100)).max(5)}),
 z.object({action:z.literal('punch'),friendId:z.string().min(1).max(300)}),
 z.object({action:z.literal('readPunch'),id:z.string().max(1000)})]);
export async function POST(req:Request){
 const u=await getChatGPTUser("Trophies");if(!u)return json({error:'Sign in required.'},401);
 if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid origin.'},403);
 try{const b=action.parse(await req.json()),db=getDb();
 if(b.action==='showcase'){
 const ids=[...new Set(b.badgeIds)],r=rewardsFor(await loadWithAwards(u.userId));
 if(ids.some(id=>!r.badges.some(b=>b.id===id&&b.earned)))return json({error:'Choose only earned badges.'},400);
 const payload=JSON.stringify({badgeIds:ids});await db.insert(records).values({id:u.userId+':showcase',userId:u.userId,kind:'trophyShowcase',date:localDate(),payload}).onConflictDoUpdate({target:records.id,set:{payload}});return json({ok:true});
 }
 if(b.action==='punch'){
 if(!(await friendsFor(u.userId)).some(f=>f.id===b.friendId))return json({error:'Friend unavailable.'},404);
 const id=b.friendId+':punch:'+u.userId+':'+localDate();const [existing]=await db.select().from(records).where(eq(records.id,id));
 if(existing)return json({ok:true,alreadySent:true});
 await db.insert(records).values({id,userId:b.friendId,kind:'punch',date:localDate(),payload:JSON.stringify({senderId:u.userId,senderName:u.displayName.split(/\s+/)[0],createdAt:Date.now(),readAt:null})}).onConflictDoNothing();await sendPunchPush(b.friendId);return json({ok:true});
 }
 const [r]=await db.select().from(records).where(and(eq(records.id,b.id),eq(records.userId,u.userId),eq(records.kind,'punch')));if(!r)return json({error:'Reminder unavailable.'},404);
 await db.update(records).set({payload:JSON.stringify({...JSON.parse(r.payload),readAt:Date.now()})}).where(eq(records.id,r.id));return json({ok:true});
 }catch(e){return json({error:e instanceof z.ZodError?'Check your selection.':'Could not save. Please retry.'},e instanceof z.ZodError?400:503);}
}

