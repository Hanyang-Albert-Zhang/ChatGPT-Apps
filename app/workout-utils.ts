export const effortOptions=['1 · Very easy','2 · Easy','3 · Moderate','4 · Hard','5 · Extreme'];
export function effortNumber(value:any){return ({Easy:2,Moderate:3,Hard:4} as any)[value]||Math.min(5,Math.max(1,Number(value)||3));}
export function effortLabel(value:any){return effortOptions[effortNumber(value)-1];}
export function movementType(p:any){return p.movementType||(/\b(run|running|jog|jogging|bike|cycling|rowing|elliptical|stairmaster|walk|walking)\b/i.test(p.name||'')?'cardio':'strength');}
export function distanceCardio(p:any){return movementType(p)==='cardio';}
export function pace(p:any){return Number(p.miles)>0&&Number(p.minutes)>0?Number(p.minutes)/Number(p.miles):0;}
export function paceLabel(p:any){const n=pace(p);if(!n)return '—';const seconds=Math.round(n*60);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+' min/mi';}
export function workoutDetail(p:any){return `${p.minutes||0} min · `+(distanceCardio(p)?`${p.miles||0} miles${p.cardioType==='run'?' · '+paceLabel(p):p.cardioType==='stairmaster'?' · '+(p.floors||0)+' floors':''}`:movementType(p)==='strength'?`${p.sets||0} × ${p.reps||0} reps · ${p.weightScope==='bodyWeight'?'Body Weight':(p.weight||0)+' '+(p.weightUnit||'lb')+(p.weightScope==='perHand'?' per hand':p.weightScope==='oneHand'?' · One Hand':' · Two Hands / total')}`:'Cardio')+` · Effort ${effortLabel(p.effort)}`;}
