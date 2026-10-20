'use client';
import {UI} from './locale';
import {useEffect,useState} from 'react';
import {Scale,Check} from 'lucide-react';
import {localDate} from './fitness';
import {weightTrend} from './weight-trends';
import {WeightChart} from './weight-chart';
export default function DailyWeight({onSaved,report=false,start,end}:{onSaved:()=>void;report?:boolean;start?:string;end?:string}){
 const [weights,setWeights]=useState<any[]>([]),[today,setToday]=useState(localDate()),[loaded,setLoaded]=useState(false),[value,setValue]=useState(''),[unit,setUnit]=useState('lb'),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const saved=weights.find(r=>r.date===today),t=weightTrend(weights,today),factor=unit==='lb'?2.2046226218:1;
 useEffect(()=>{let live=true,lastDay=localDate();async function load(){try{const r=await fetch('/api/weights');const d:any=await r.json();if(!r.ok)throw Error(d.error||'Could not load weights.');if(live){setWeights(d.weights||[]);setError('');}}catch(e){if(live)setError((e as Error).message);}finally{if(live)setLoaded(true);}}
  const sync=()=>{lastDay=localDate();setToday(lastDay);load();};const tick=()=>{const next=localDate();if(next!==lastDay){setValue('');sync();}};
  load();const timer=setInterval(tick,1000);window.addEventListener('fitdiet-refresh',sync);window.addEventListener('focus',sync);document.addEventListener('visibilitychange',tick);
  return()=>{live=false;clearInterval(timer);window.removeEventListener('fitdiet-refresh',sync);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',tick);};
 },[]);
 if(!report&&(!loaded||saved))return null;
 const shown=weights.filter(r=>(!start||r.date>=start)&&(!end||r.date<=end));
 return <UI.section className="card daily-weight-card" id={report?'weight-trend':undefined}>
  <UI.div className="card-heading"><UI.h2><Scale size={19}/> {report?'Weight trend':'Morning weight check-in'}</UI.h2><UI.span className="tag">{saved?'Logged today':today}</UI.span></UI.div>
  <UI.p className="fine">{report?'Your morning check-ins, shown over the selected report period. You can correct today’s weight below.':'Log your morning weight, then get on with your day. This reminder returns tomorrow at midnight Eastern time.'}</UI.p>
  {report&&<><WeightChart points={shown.map(r=>({date:r.date,value:r.weightKg*factor}))} unit={unit}/><UI.div className="weight-summary"><UI.strong>{t.average?(t.average*factor).toFixed(2)+' '+unit:'—'}</UI.strong><UI.span>7-day average · {t.weekCount} check-ins</UI.span>{t.trend&&<UI.span>28-day trend: {(t.trend.slope*factor).toFixed(2)} {unit}/week</UI.span>}</UI.div></>}
  <UI.form onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/weights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({weight:Number(value)/factor})}),d:any=await r.json();if(!r.ok)throw Error(d.error);setWeights(old=>[...old.filter(w=>w.date!==d.weight.date),d.weight].sort((a,b)=>a.date.localeCompare(b.date)));setToday(localDate());setValue('');onSaved();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>
   <UI.label className="field">Today’s weight<UI.input aria-label="Today’s weight" type="number" step=".01" inputMode="decimal" min={unit==='lb'?66.2:30} max={unit==='lb'?771.6:350} required value={value} placeholder={saved?(saved.weightKg*factor).toFixed(2):'Enter weight'} onChange={e=>setValue(e.target.value)}/></UI.label>
   <UI.label className="field">Unit<UI.select aria-label="Weight unit" value={unit} onChange={e=>{setUnit(e.target.value);setValue('');}}><UI.option>lb</UI.option><UI.option>kg</UI.option></UI.select></UI.label><UI.button className="primary" disabled={busy||!value}>{busy?'Saving…':saved?'Update today':'Save check-in'}<Check size={16}/></UI.button>
  </UI.form>{error&&<UI.p className="alert" role="alert">{error}</UI.p>}
  {report&&<UI.details><UI.summary>Weight history</UI.summary><UI.div className="weight-history">{[...shown].reverse().map(r=><UI.div key={r.date}><UI.span>{r.date}</UI.span><UI.b>{(r.weightKg*factor).toFixed(2)} {unit}</UI.b></UI.div>)}</UI.div></UI.details>}
 </UI.section>;
}
