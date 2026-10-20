import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {records} from '../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {z} from 'zod';
import {localDate} from '../../fitness';
const json=(value:any,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const u=await getChatGPTUser("Inbox");if(!u)return json({error:'Sign in to send feedback.'},401);const rows=await getDb().select().from(records).where(and(eq(records.userId,u.userId),eq(records.kind,'feedback')));return json({feedback:rows.map(r=>({id:r.id,...JSON.parse(r.payload)})).sort((a,b)=>b.createdAt-a.createdAt).slice(0,30)});}
export async function POST(req:Request){const u=await getChatGPTUser("Inbox");if(!u)return json({error:'Sign in to send feedback.'},401);if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid origin.'},403);try{const b=z.object({category:z.enum(['Feature request','Improvement','Bug report']),message:z.string().trim().min(10).max(3000)}).parse(await req.json());const db=getDb(),own=await db.select().from(records).where(and(eq(records.userId,u.userId),eq(records.kind,'feedback')));if(own.filter(r=>r.date===localDate()).length>=10)return json({error:'You can send up to 10 feedback entries per day. Please try tomorrow.'},429);const id=u.userId+':feedback:'+crypto.randomUUID(),payload={...b,name:u.displayName,email:u.email,status:'New',createdAt:Date.now()};await db.insert(records).values({id,userId:u.userId,kind:'feedback',date:localDate(),payload:JSON.stringify(payload)});return json({ok:true,id});}catch(e){return json({error:e instanceof z.ZodError?'Please enter 10–3,000 characters.':'Could not send feedback. Please retry.'},e instanceof z.ZodError?400:503);}}

