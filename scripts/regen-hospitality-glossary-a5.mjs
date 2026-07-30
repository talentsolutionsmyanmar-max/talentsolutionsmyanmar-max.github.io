#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PROJECT_URL='https://ehjomikzakqjtkvwrcqf.supabase.co';
const MODULES=[
 {label:'p1',slug:'serve-with-dignity-how-confident-service-gets-you-promoted-faster-than-silent-obedience',digest:'53d5b5328bfb708d86de49beee14a2b8f9de37151f5d567dc613a85d5f2bc4b6'},
 {label:'p2',slug:'win-the-job-in-30-seconds-how-first-impressions-in-grooming-and-greeting-decide-your-hospitality-career',digest:'a39c2a242bd3f84c98679477c1c7f513f797990fbbd584bc5e69d9ed54d44493'},
 {label:'p3',slug:'turn-angry-guests-into-loyal-guests-the-complaint-recovery-skill-that-makes-you-irreplaceable',digest:'8dceffea8b5ca1dd1b8a5fa7c846fe4dedf93bc23e8c328e8425407363697785'},
 {label:'p4',slug:'speak-so-guests-trust-you-essential-english-phrases-and-body-language-that-outperform-fluency',digest:'e8a2c2fc68a841402f31f941d9855ccedf549c3332897f486ded066fb972def5'},
 {label:'p5',slug:'see-what-the-guest-needs-before-they-ask-how-anticipation-skills-double-your-tips-and-promotions',digest:'3303e977900c37e002fc5253d16a90cec0406182ed36ff02a9fdd8945aae00b6'},
];
const sha=value=>createHash('sha256').update(value,'utf8').digest('hex');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode=value=>value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|#39);/gi,(_,e)=>e[0]==='#'?String.fromCodePoint(parseInt(e.slice(e[1].toLowerCase()==='x'?2:1),e[1].toLowerCase()==='x'?16:10)):({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[e.toLowerCase()]);
function fail(message){throw new Error(message);}
function value(block,re,label){const match=block.match(re);if(!match)fail(`missing ${label}`);return decode(match[1]);}
function parseVocabulary(raw,slug){let entries;try{entries=JSON.parse(raw);}catch{fail(`${slug}: vocabularyMm invalid JSON`);}
 if(!Array.isArray(entries)||entries.length!==8)fail(`${slug}: expected 8 entries`);
 for(const [index,entry] of entries.entries()){
  for(const key of ['term_en','term_mm','definition_en','definition_mm','example_en','example_mm'])if(typeof entry[key]!=='string'||!entry[key])fail(`${slug}:${index+1}: invalid ${key}`);
  if(entry.audio!==null)fail(`${slug}:${index+1}: audio must be null`);
 }
 return entries;
}
function renderGlossary(glossary,entries,slug){
 const blocks=[...glossary.matchAll(/<li class="vterm">([\s\S]*?)<\/li>/g)];
 if(blocks.length!==8)fail(`${slug}: rendered entry count ${blocks.length}`);
 let output=glossary;
 for(let index=0;index<8;index++){
  const whole=blocks[index][0],block=blocks[index][1],entry=entries[index];
  if(value(block,/<span class="vterm-en">([\s\S]*?)<\/span>/,'term_en')!==entry.term_en)fail(`${slug}:${index+1}: term_en drift`);
  if(value(block,/<p class="vterm-d">([\s\S]*?)<\/p>/,'definition_en')!==entry.definition_en)fail(`${slug}:${index+1}: definition_en drift`);
  if(value(block,/<p class="vterm-e"><span>([\s\S]*?)<\/span>/,'example_en')!==entry.example_en)fail(`${slug}:${index+1}: example_en drift`);
  let next=whole
   .replace(/(<div class="vterm-mm mm" lang="my">)[\s\S]*?(<\/div>)/,`$1${esc(entry.term_mm)}$2`)
   .replace(/(<p class="vterm-d mm" lang="my">)[\s\S]*?(<\/p>)/,`$1${esc(entry.definition_mm)}$2`)
   .replace(/(<p class="vterm-e mm" lang="my">)[\s\S]*?(<\/p>)/,`$1${esc(entry.example_mm)}$2`);
  output=output.replace(whole,next);
 }
 return output;
}
function verifyGlossary(glossary,entries,slug){
 const blocks=[...glossary.matchAll(/<li class="vterm">([\s\S]*?)<\/li>/g)].map(match=>match[1]);
 if(blocks.length!==8)fail(`${slug}: post-render entry count`);
 blocks.forEach((block,index)=>{
  const entry=entries[index];
  const checks=[
   [/<span class="vterm-en">([\s\S]*?)<\/span>/,'term_en'],[/<div class="vterm-mm mm" lang="my">([\s\S]*?)<\/div>/,'term_mm'],
   [/<p class="vterm-d">([\s\S]*?)<\/p>/,'definition_en'],[/<p class="vterm-d mm" lang="my">([\s\S]*?)<\/p>/,'definition_mm'],
   [/<p class="vterm-e"><span>([\s\S]*?)<\/span>/,'example_en'],[/<p class="vterm-e mm" lang="my">([\s\S]*?)<\/p>/,'example_mm'],
  ];
  for(const [re,key] of checks)if(value(block,re,key)!==entry[key])fail(`${slug}:${index+1}: ${key} binding failed`);
 });
}
async function fetchRows(){const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)fail('SUPABASE_SERVICE_ROLE_KEY required');
 const url=new URL(`${PROJECT_URL}/rest/v1/AcademyModule`);url.searchParams.set('select','slug,vocabularyMm');url.searchParams.set('slug',`in.(${MODULES.map(m=>m.slug).join(',')})`);
 const response=await fetch(url,{headers:{apikey:key,Authorization:`Bearer ${key}`}});if(!response.ok)fail(`Supabase read failed: ${response.status} ${await response.text()}`);
 const rows=await response.json();if(rows.length!==5)fail(`DB returned ${rows.length} rows`);return new Map(rows.map(row=>[row.slug,row]));
}
async function main(){const write=process.argv.includes('--write');const rows=await fetchRows();
 for(const contract of MODULES){const row=rows.get(contract.slug);if(!row)fail(`${contract.label}: row missing`);const digest=sha(row.vocabularyMm);if(digest!==contract.digest)fail(`${contract.label}: vocabularyMm drift ${digest}`);parseVocabulary(row.vocabularyMm,row.slug);console.log(`${contract.label}\t${digest}\tdrift-pass`);}
 if(!write)return;
 for(const contract of MODULES){const row=rows.get(contract.slug),entries=parseVocabulary(row.vocabularyMm,row.slug);const file=path.join(process.cwd(),'academy/m',row.slug,'index.html');const before=await readFile(file,'utf8');const match=before.match(/<details class="panel vocab" id="vocab">[\s\S]*?<\/details>/);if(!match)fail(`${row.slug}: glossary missing`);const oldGlossary=match[0],newGlossary=renderGlossary(oldGlossary,entries,row.slug);verifyGlossary(newGlossary,entries,row.slug);const after=before.replace(oldGlossary,newGlossary);if(before.replace(oldGlossary,'')!==after.replace(newGlossary,''))fail(`${row.slug}: non-glossary bytes moved`);await writeFile(file,after,'utf8');console.log(`${contract.label}\tglossary-only-write`);}
}
await main();
