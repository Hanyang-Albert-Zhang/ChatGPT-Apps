import {reconcileDue} from '../../../group-challenges-server';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await reconcileDue(),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Maintenance unavailable.'},{status:503});}}
