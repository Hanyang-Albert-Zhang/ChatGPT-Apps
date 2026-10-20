export const roundTwo=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export const goalWeight=(kg:number,units:string)=>roundTwo(units==='metric'?kg:kg*2.2046226218);
export const goalHeight=(cm:number,units:string)=>roundTwo(units==='metric'?cm:cm/2.54);
