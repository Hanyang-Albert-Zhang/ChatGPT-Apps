import {UI} from './locale';
import {Medal,Award,Trophy,Gem,Crown,Star,Sparkles,Swords} from 'lucide-react';
import {tierForLevel} from './rewards';
export default function TierIcon({level,size=28}:{level:number;size?:number}){
 const t=tierForLevel(level);
 const I=[Award,Medal,Swords,Swords,Gem,Star,Trophy,Crown,Sparkles,Sparkles][t.rankIndex];
 return <UI.span className="rank-icon" style={{width:size,height:size}} data-peak={t.peak||undefined} aria-label={t.name}>{t.peak?<UI.svg className="peak-emblem" width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><UI.path d="M12 12 10 4l6 4 4-6 4 6 6-4-2 8z" fill="#f3d577" stroke="#a97c20"/><UI.path d="M12 14h16" stroke="#a97c20"/><UI.path d="m5 31 12-15 8 15z" fill="#e4e1fa"/><UI.path d="m21 31 6-10 8 10z" fill="#eeeafc"/><UI.path d="m12 22 5-6 5 9-5-2-2 2z" fill="#fff"/></UI.svg>:t.rank==='Veteran'?<UI.svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><UI.path d="M4 3l20 21m4-21L8 24M3 3l1 7 5-1M29 3l-1 7-5-1M19 25l6-6M7 19l6 6M24 25l3 3M8 25l-3 3"/><UI.path d="M16 9l7 3v7c0 5-7 9-7 9s-7-4-7-9v-7z" fill="#fff8e5"/><UI.path d="M16 13v10"/></UI.svg>:<I size={size}/>}<UI.small style={{fontSize:Math.max(5,size*(t.peak?.2:.21))}}>{t.division}</UI.small></UI.span>;
}
