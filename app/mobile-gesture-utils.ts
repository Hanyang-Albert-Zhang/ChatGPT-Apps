
export const mobilePages=['Home','Food diary','Training plan','Inbox','Workout report','Trophies'];
export function gestureAction(dx:number,dy:number,atTop:boolean){if(Math.abs(dx)>=75&&Math.abs(dx)>Math.abs(dy)*1.7)return dx>0?'previous':'next';if(atTop&&dy>=95&&Math.abs(dx)<35)return 'refresh';return null;}
export function swipePage(page:string,action:string|null){const i=mobilePages.indexOf(page),next=i+(action==='previous'?-1:action==='next'?1:0);return i>=0&&next>=0&&next<mobilePages.length&&next!==i?mobilePages[next]:null;}
