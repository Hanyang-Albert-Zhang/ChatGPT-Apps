// EST is deliberately fixed at UTC-05:00, including during daylight-saving time.
export const REPORT_SCHEDULE={time:'09:00',timezone:'Etc/GMT+5',label:'9:00 a.m. EST (UTC−5, year-round)',utcHour:14,weeklyDay:1,monthlyDay:1} as const;
export const US_TIMEZONES=[
 ['America/New_York','Eastern — New York, Florida, most Eastern states'],
 ['America/Detroit','Eastern — Michigan'],
 ['America/Indiana/Indianapolis','Eastern — Indianapolis'],
 ['America/Indiana/Marengo','Eastern — Marengo, Indiana'],
 ['America/Indiana/Vevay','Eastern — Vevay, Indiana'],
 ['America/Indiana/Petersburg','Eastern — Petersburg, Indiana'],
 ['America/Indiana/Vincennes','Eastern — Vincennes, Indiana'],
 ['America/Indiana/Winamac','Eastern — Winamac, Indiana'],
 ['America/Kentucky/Louisville','Eastern — Louisville, Kentucky'],
 ['America/Kentucky/Monticello','Eastern — Monticello, Kentucky'],
 ['America/Chicago','Central — Chicago, Texas, most Central states'],
 ['America/Indiana/Knox','Central — Knox, Indiana'],
 ['America/Indiana/Tell_City','Central — Tell City, Indiana'],
 ['America/Menominee','Central — Menominee, Michigan'],
 ['America/North_Dakota/Center','Central — Center, North Dakota'],
 ['America/North_Dakota/New_Salem','Central — New Salem, North Dakota'],
 ['America/North_Dakota/Beulah','Central — Beulah, North Dakota'],
 ['America/Denver','Mountain — Denver, most Mountain states'],
 ['America/Boise','Mountain — Boise, Idaho'],
 ['America/Phoenix','Arizona — Phoenix (no daylight saving)'],
 ['America/Los_Angeles','Pacific — California, Washington, most Pacific states'],
 ['America/Anchorage','Alaska — Anchorage'],
 ['America/Juneau','Alaska — Juneau'],
 ['America/Sitka','Alaska — Sitka'],
 ['America/Metlakatla','Alaska — Metlakatla'],
 ['America/Yakutat','Alaska — Yakutat'],
 ['America/Nome','Alaska — Nome'],
 ['America/Adak','Hawaii–Aleutian — Adak (daylight saving)'],
 ['Pacific/Honolulu','Hawaii — Honolulu (no daylight saving)'],
 ['America/Puerto_Rico','Atlantic — Puerto Rico (no daylight saving)'],
 ['America/St_Thomas','Atlantic — US Virgin Islands (no daylight saving)'],
 ['Pacific/Pago_Pago','Samoa — American Samoa (no daylight saving)'],
 ['Pacific/Guam','Chamorro — Guam (no daylight saving)'],
 ['Pacific/Saipan','Chamorro — Northern Mariana Islands (no daylight saving)']
] as const;
export function nextReportSend(frequency:string,now=new Date()){
 const candidate=new Date(now);candidate.setUTCHours(14,0,0,0);
 if(frequency==='monthly'){candidate.setUTCDate(1);if(candidate<=now)candidate.setUTCMonth(candidate.getUTCMonth()+1);}
 else if(frequency==='weekly'){candidate.setUTCDate(candidate.getUTCDate()+(8-candidate.getUTCDay())%7);if(candidate<=now)candidate.setUTCDate(candidate.getUTCDate()+7);}
 else if(candidate<=now)candidate.setUTCDate(candidate.getUTCDate()+1);
 return candidate.toISOString();
}
export function reportPeriod(frequency:string,now=new Date()){
 const est=new Date(now.getTime()-5*3600000);const end=new Date(Date.UTC(est.getUTCFullYear(),est.getUTCMonth(),est.getUTCDate()));const start=new Date(end);
 if(frequency==='monthly'){end.setUTCDate(1);start.setUTCDate(1);start.setUTCMonth(start.getUTCMonth()-1);}
 else if(frequency==='weekly'){end.setUTCDate(end.getUTCDate()-((end.getUTCDay()+6)%7));start.setTime(end.getTime());start.setUTCDate(start.getUTCDate()-7);}
 else start.setUTCDate(start.getUTCDate()-1);
 const last=new Date(end);last.setUTCDate(last.getUTCDate()-1);
 return {start:start.toISOString().slice(0,10),endExclusive:end.toISOString().slice(0,10),last:last.toISOString().slice(0,10)};
}
