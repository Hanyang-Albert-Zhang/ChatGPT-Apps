import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/icons/fitdiet-icon.svg',import.meta.url));
for(const [size,path] of [[180,'apple-touch-icon.png'],[192,'icons/icon-192.png'],[512,'icons/icon-512.png']]){
 await sharp(source).resize(size,size).flatten({background:'#16795c'}).png().toFile(new URL('../public/'+path,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
}
console.log('Generated opaque FitDiet PNG icons at 180, 192 and 512 pixels.');
