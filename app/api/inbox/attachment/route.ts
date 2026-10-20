import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {chatMembers,chatMessages} from '../../../../db/schema';
import {and,eq} from 'drizzle-orm';
export async function GET(req:Request){
 const u=await getChatGPTUser("Inbox");if(!u)return new Response('Sign in required',{status:401});
 const url=new URL(req.url),id=url.searchParams.get('id')||'',db=getDb();
 const [message]=await db.select().from(chatMessages).where(eq(chatMessages.id,id));
 if(!message)return new Response('Attachment unavailable',{status:404});
 const [member]=await db.select().from(chatMembers).where(and(eq(chatMembers.threadId,message.threadId),eq(chatMembers.userId,u.userId),eq(chatMembers.status,'active')));
 if(!member)return new Response('Attachment unavailable',{status:404});
 const share=message.share?JSON.parse(message.share):null,content=share?.image||share?.html;
 if(!content)return new Response('Attachment unavailable',{status:404});
 const image=!!share.image;
 return new Response(content,{headers:{'Content-Type':image?'image/svg+xml':'text/html; charset=utf-8','Content-Disposition':(url.searchParams.has('download')?'attachment':'inline')+'; filename="Seediva-'+share.kind+'-'+share.end+(image?'.svg':'.html')+'"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox"}});
}
