import {accountAccess} from "../../access-server";
import {isSiteAdmin,isSuperAdmin,registerAccount} from '../../admin-server';
import {getChatGPTUser} from '../../chatgpt-auth';
import {env} from 'cloudflare:workers';
import {getDb} from '../../../db';
import {records,chatMembers,chatMessages} from '../../../db/schema';
import {and,eq,inArray} from 'drizzle-orm';
import {z} from 'zod';
import {localDate} from '../../fitness';
import {languageOf} from '../../locale-core';
async function identity(userId:string){const [r]=await getDb().select().from(records).where(and(eq(records.userId,userId),eq(records.kind,'identity')));return r?JSON.parse(r.payload):{};}
export async function GET(){const user=await getChatGPTUser("Account");if(user)try{await registerAccount(user);}catch{}const saved=user?await identity(user.userId):{},history=user?await getDb().select({id:records.id}).from(records).where(and(eq(records.userId,user.userId),inArray(records.kind,['meal','workout','dailyWeight','bodyMeasurement']))).limit(1):[];return Response.json({user:user?{name:user.displayName,email:user.email,isAdmin:await isSiteAdmin(user),isSuperAdmin:isSuperAdmin(user),access:await accountAccess(user),preferredName:saved.preferredName||'',language:languageOf(saved.language),avatar:saved.avatar||null,onboardingEligible:!saved.onboardingComplete&&!history.length}:null},{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:Request){const user=await getChatGPTUser("Account");if(!user)return Response.json({error:'Sign in required.'},{status:401});if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Invalid origin.'},{status:403});try{
 const updates=z.object({preferredName:z.string().trim().max(60).refine(s=>!/[\u0000-\u001f\u007f]/.test(s)).optional(),language:z.enum(['en','zh-CN','es']).optional(),onboardingComplete:z.literal(true).optional(),avatar:z.union([z.object({kind:z.literal('preset'),id:z.number().int().min(0).max(14)}),z.object({kind:z.literal('photo'),id:z.string().max(250)}),z.null()]).optional()}).refine(v=>v.preferredName!==undefined||v.language!==undefined||v.avatar!==undefined||v.onboardingComplete===true).parse(await req.json());
 if(updates.avatar?.kind==='photo'){const id=updates.avatar.id;if(!id.startsWith(user.userId+'/avatars/')||id.includes('..')||!await (env as any).BUCKET.head(id))return Response.json({error:'Choose a photo uploaded to your account.'},{status:400});}
 const saved=await identity(user.userId),preferredName=updates.preferredName??saved.preferredName??'',language=updates.language??languageOf(saved.language),avatar=updates.avatar===undefined?saved.avatar||null:updates.avatar,name=preferredName||user.fullName||user.email,db=getDb(),payload=JSON.stringify({...saved,preferredName,language,avatar,...(updates.onboardingComplete?{onboardingComplete:true}:{})});
 const mutations:any[]=[db.insert(records).values({id:user.userId+':identity',userId:user.userId,kind:'identity',date:localDate(),payload}).onConflictDoUpdate({target:records.id,set:{payload}})];if(updates.preferredName!==undefined)mutations.push(db.update(chatMembers).set({name}).where(eq(chatMembers.userId,user.userId)),db.update(chatMessages).set({senderName:name}).where(eq(chatMessages.senderId,user.userId)));await db.batch(mutations as any);return Response.json({user:{name,email:user.email,isAdmin:await isSiteAdmin(user),isSuperAdmin:isSuperAdmin(user),access:await accountAccess(user),preferredName,language,avatar}});
 }catch(e){return Response.json({error:e instanceof z.ZodError?'Choose a supported language, avatar and name of up to 60 characters.':'Could not save your account preferences.'},{status:e instanceof z.ZodError?400:503});}}

