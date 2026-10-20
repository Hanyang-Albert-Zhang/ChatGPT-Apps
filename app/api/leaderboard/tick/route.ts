import {reconcileLeaderboard,leaderboardMaintenanceStatus} from '../../../leaderboard-server';
// No IDs, timestamps, scores or XP are accepted. Only due server-calculated awards can be recorded.
export async function GET(){try{return Response.json({...await reconcileLeaderboard(),...await leaderboardMaintenanceStatus()},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Leaderboard maintenance could not complete.'},{status:503});}}
