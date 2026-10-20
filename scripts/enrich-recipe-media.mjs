import fs from 'node:fs/promises';
const file=new URL('../app/recipe-media.json',import.meta.url), media=JSON.parse(await fs.readFile(file,'utf8'));
const posts={'chinese-1':21170};
for(const [id,post]of Object.entries(posts)){const p=await fetch(`https://redhousespice.com/wp-json/wp/v2/posts/${post}?_fields=link,title,yoast_head_json`).then(r=>r.json());const y=p.yoast_head_json;media[id]={...media[id],image:y.og_image[0].url,imageSource:p.link,imageCredit:`${y.author} · Red House Spice`,imageLicense:'Publisher photo · externally hosted, all rights reserved'};}
// Reviewed cuisine-specific replacement for generic butter-broccoli search result.
for(const [id,videoId] of Object.entries({'chinese-6':'ilELQRWU86U','chinese-29':'XGafPqInPxA'})){const videoSource='https://www.youtube.com/watch?v='+videoId;const response=await fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(videoSource));if(!response.ok)continue;const v=await response.json();media[id]={videoId,videoTitle:v.title,videoSource,image:v.thumbnail_url,imageSource:videoSource,imageCredit:v.author_name,imageLicense:'YouTube video thumbnail · external media'};}
await fs.writeFile(file,JSON.stringify(media,null,2)+'\n');
console.log('Updated reviewed publisher image and cuisine-specific video');
