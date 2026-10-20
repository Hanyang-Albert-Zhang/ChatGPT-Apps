import {UI} from './locale';
export function WeightChart({points,unit}:{points:{date:string;value:number}[];unit:string}){
 const p=points.filter(p=>Number.isFinite(p.value)).sort((a,b)=>a.date.localeCompare(b.date));
 if(!p.length)return <UI.p className="empty-state">No weight check-ins in this period.</UI.p>;
 const lo=Math.min(...p.map(p=>p.value)),hi=Math.max(...p.map(p=>p.value)),pad=Math.max(1,(hi-lo)*.2),min=lo-pad,max=hi+pad,first=Date.parse(p[0].date),span=Math.max(86400000,Date.parse(p.at(-1)!.date)-first),x=(date:string)=>60+(Date.parse(date)-first)/span*570,y=(v:number)=>170-(v-min)/(max-min)*135;
 return <UI.svg className="weight-trend-chart" viewBox="0 0 680 210" role="img" aria-label={'Weight trend: '+p.map(p=>p.date+': '+p.value.toFixed(2)+' '+unit).join(', ')}>
  {[min,(min+max)/2,max].map(n=><UI.g key={n}><UI.line x1="60" x2="635" y1={y(n)} y2={y(n)} stroke="#e1ebe4"/><UI.text x="50" y={y(n)+4} textAnchor="end" fontSize="12" fill="#627e6d">{n.toFixed(2)}</UI.text></UI.g>)}
  <UI.text x="16" y="18" fontSize="12" fill="#627e6d">{unit}</UI.text><UI.polyline points={p.map(p=>x(p.date)+','+y(p.value)).join(' ')} fill="none" stroke="#16795c" strokeWidth="3"/>
  {p.map(p=><UI.circle key={p.date} cx={x(p.date)} cy={y(p.value)} r="4" fill="#16795c"><UI.title>{p.date+': '+p.value.toFixed(2)+' '+unit}</UI.title></UI.circle>)}
  <UI.text x="60" y="199" fontSize="12" fill="#627e6d">{p[0].date}</UI.text>{p.length>1&&<UI.text x="635" y="199" textAnchor="end" fontSize="12" fill="#627e6d">{p.at(-1)!.date}</UI.text>}
 </UI.svg>;
}
