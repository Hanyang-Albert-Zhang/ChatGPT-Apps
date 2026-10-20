export type SeedyPointer={x:number;y:number;time:number};
export function suppressSeedyClick(start:SeedyPointer,end:SeedyPointer,moved=false){
 return moved||Math.hypot(end.x-start.x,end.y-start.y)>8||end.time-start.time>=500;
}

/** Keep the companion on screen, clear of the mobile navigation bar. */
export function seedyPosition(x:number,y:number,docked:boolean,width:number,height:number){
 const w=docked?70:100,h=docked?88:128;
 return {x:docked?width-w+9:Math.max(0,Math.min(width-w,x)),y:Math.max(64,Math.min(Math.max(64,height-h-(width<=850?86:12)),y)),docked};
}

/** Place tips beside the companion, choosing the side with room on narrow screens. */
export function seedyTipPosition(anchor:{left:number;top:number;width:number;height:number},width:number,height:number,tipHeight:number){
 const gap=10,edge=12,leftRoom=anchor.left-gap-edge,rightRoom=width-(anchor.left+anchor.width)-gap-edge;
 const side=leftRoom>=140||leftRoom>=rightRoom?'left':'right';
 const room=side==='left'?leftRoom:rightRoom,tipWidth=Math.max(120,Math.min(285,width-2*edge,room));
 const x=side==='left'?anchor.left-gap-tipWidth:anchor.left+anchor.width+gap;
 const bottom=height-(width<=850?86:12),maxY=Math.max(64,bottom-tipHeight);
 return {left:Math.max(edge,Math.min(width-tipWidth-edge,x)),top:Math.max(64,Math.min(maxY,anchor.top+(anchor.height-tipHeight)/2)),width:tipWidth};
}
