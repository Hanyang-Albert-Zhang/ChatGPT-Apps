import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {moduleUrl} from './load-app-module.mjs';
const {translate,englishQuery,languageOf,localizeMarkup}=await import(await moduleUrl('locale-core'));
assert.equal(languageOf(undefined),'en');assert.equal(languageOf('fr'),'en');assert.equal(languageOf('zh-CN'),'zh-CN');
assert.equal(translate('Home','en'),'Home');assert.match(translate('Home','zh-CN'),/[\u3400-\u9fff]/);assert.notEqual(translate('Home','es'),'Home');
for(const language of ['zh-CN','es'])for(const label of ['Food diary','Training plan','Nutrition report','Workout report','Goals','Trophies','Inbox','Account','Preferred name','Save name','Switch Account','Log out','Language'])assert.notEqual(translate(label,language),label,language+': '+label);
assert.equal(englishQuery('pan','en'),'pan');assert.equal(englishQuery('100克鸡胸肉','zh-CN'),'100 g chicken breast');assert.equal(englishQuery('1 huevo cocido','es'),'1 boiled egg');assert.equal(englishQuery('卧推','zh-CN'),'bench press');assert.equal(englishQuery('sentadillas','es'),'squat');
const markup='<html lang="en"><style>.protein{color:red}</style><h1>Nutrition report</h1><td>123.4</td><p>&lt;script&gt;alert(1)&lt;/script&gt;</p></html>';
for(const lang of ['zh-CN','es']){const output=localizeMarkup(markup,lang);assert(output.includes('lang="'+lang+'"'));assert(output.includes('.protein{color:red}'));assert(output.includes('<td>123.4</td>'));assert(!output.includes('<script>'));assert(!output.includes('<h1>Nutrition report</h1>'));}
const gif=await fs.readFile(new URL('../public/seedy/seedy-waving.gif',import.meta.url)),loop=gif.indexOf(Buffer.from('NETSCAPE2.0'));assert(loop>=0);assert.equal(gif.readUInt16LE(loop+13),0,'User GIF must loop continuously');
const seedy=await fs.readFile(new URL('../app/seedy.tsx',import.meta.url),'utf8');assert(!seedy.includes('seedy-waving.gif'));assert(seedy.includes('seedy-living'));
console.log('PASS: language fallback and key app labels; bilingual catalog aliases with English preservation; translated HTML preserves numbers, styles and escaping; Seedy GIF loops continuously.');
