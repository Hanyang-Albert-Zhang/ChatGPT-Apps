import {getDb} from '../db';import {records} from '../db/schema';import {localDate} from './fitness';
export async function shareExercise(name:string,category:string){
 const clean=name.trim().replace(/\s+/g,' ');if(clean.length<2||clean.length>120||/[@\n\r]|https?:|www\./i.test(clean))return;
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(clean.toLowerCase()));const id='exercise:'+Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
 await getDb().insert(records).values({id,userId:'shared-exercise-catalog',kind:'sharedExercise',date:localDate(),payload:JSON.stringify({name:clean,category:category==='cardio'?'cardio':'strength'})}).onConflictDoNothing();
}
