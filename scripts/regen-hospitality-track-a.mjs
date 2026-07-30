#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PROJECT_URL = 'https://ehjomikzakqjtkvwrcqf.supabase.co';
const FIELDS = ['actionStepsMm','commonMistakeMm','contentMm','decisionScenarioMm','hookTextMm','keyTakeawayMm','learningObjectivesMm','quizQuestionsMm'];
const MODULES = [
  { id:'cmmxl27790019lq6737n3ev18', slug:'serve-with-dignity-how-confident-service-gets-you-promoted-faster-than-silent-obedience', digest:'93d4f18ea7ae53856a24a46ed1da4abca7e844cbd5e49b4adbd5c9d5f8f8b5f1', vocab:'177f01aa972054f81b42fb3e18bb9cc6967c5cb4ee7fbd6c81fe1ed871719806' },
  { id:'cmmxl2779001alq67sur52ln4', slug:'win-the-job-in-30-seconds-how-first-impressions-in-grooming-and-greeting-decide-your-hospitality-career', digest:'22de98e7147b53fcd409d93299c1c0488e2318c0eebc32d72957533c09ed9214', vocab:'bb2a18a333540173ca70a8715367c6793b457287981ba3c3b189d1ba3809c603' },
  { id:'cmmxl2779001blq67t6mncmt4', slug:'turn-angry-guests-into-loyal-guests-the-complaint-recovery-skill-that-makes-you-irreplaceable', digest:'cd77eda62de505e6631d704341d4503d6b5b24166f3be387042deda1449eb48e', vocab:'269d9e986703fb06e25433981e0da6527849abc704754602f64bef0db2f61b9f' },
  { id:'cmmxl2779001clq675danzlr0', slug:'speak-so-guests-trust-you-essential-english-phrases-and-body-language-that-outperform-fluency', digest:'96c2f3cc6d12ed209fb1c5e203751c282cbeb091e47622a56cd351cc4247c524', vocab:'d8f1bbb0808223fb7e8e2c4cba397c7772d9b40ed91fb7d796d744657152287c' },
  { id:'cmmxl2779001dlq67in60eflt', slug:'see-what-the-guest-needs-before-they-ask-how-anticipation-skills-double-your-tips-and-promotions', digest:'3ecd564fc22141fff7db7116722792af6ce55a91dd64013c46daa421a9d4ecff', vocab:'abf17f1b21d09c602c0d55b7a2e0834cee1c96beffa741cd76c8adfba150bbb6' },
];

const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode = value => value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|#39);/gi, (_, e) => {
  if (e[0] === '#') return String.fromCodePoint(parseInt(e.slice(e[1].toLowerCase() === 'x' ? 2 : 1), e[1].toLowerCase() === 'x' ? 16 : 10));
  return ({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[e.toLowerCase()];
});
function fail(message) { throw new Error(message); }
function combinedDigest(row) {
  return sha256(FIELDS.map(field => `${field}:${sha256(row[field])}`).join('\n'));
}
function parseArray(raw, field, length) {
  let parsed;
  try { parsed = JSON.parse(raw); } catch { fail(`${field}: invalid JSON`); }
  if (!Array.isArray(parsed) || parsed.length !== length) fail(`${field}: expected array length ${length}`);
  return parsed;
}
function textContent(html) {
  return decode(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''));
}
function articleBlocks(html, language) {
  const re = new RegExp(`<article class="rcard" data-card="(\\d+)" data-langbody="${language}"[^>]*>([\\s\\S]*?)<\\/article>`, 'g');
  return [...html.matchAll(re)];
}
function renderCards(row, enBlocks) {
  const cards = parseArray(row.contentMm, 'contentMm', 12);
  return cards.map((card, index) => {
    if (!card || typeof card.title !== 'string' || typeof card.content !== 'string') fail(`${row.slug}: malformed contentMm card ${index + 1}`);
    const rk = enBlocks[index][2].match(/<div class="rk">[\s\S]*?<\/div>/)?.[0];
    if (!rk) fail(`${row.slug}: EN card ${index + 1} chrome missing`);
    return `\n    <article class="rcard" data-card="${index}" data-langbody="mm" style="display:none" lang="my">\n      ${rk}\n      <div class="rt mm" lang="my">${esc(card.title)}</div>\n      <div class="rb mm" lang="my" style="white-space:pre-line">${esc(card.content)}</div>\n    </article>`;
  }).join('');
}
function renderSupport(row) {
  const objectives = parseArray(row.learningObjectivesMm, 'learningObjectivesMm', 4);
  const quiz = parseArray(row.quizQuestionsMm, 'quizQuestionsMm', 3);
  if (!objectives.every(value => typeof value === 'string')) fail(`${row.slug}: malformed learningObjectivesMm`);
  const blocks = [
    ['hookTextMm','အဖွင့်အကြောင်းအရာ'], ['commonMistakeMm','အဖြစ်များသောအမှား'],
    ['actionStepsMm','လုပ်ဆောင်ရန်အဆင့်များ'], ['decisionScenarioMm','ဆုံးဖြတ်ချက်အခြေအနေ'],
    ['keyTakeawayMm','အဓိကမှတ်သားရန်'],
  ];
  return `<section class="panel pad mm" data-langbody="mm" data-db-mm-support style="display:none" lang="my">
        <h2 class="label mm" lang="my">သင်ခန်းစာလမ်းညွှန်</h2>
        <div style="display:grid;gap:16px;margin-top:12px">${blocks.map(([field,label]) => `
          <section><h3 class="sm mm" lang="my">${label}</h3><div class="mut mm" data-db-mm-field="${field}" lang="my" style="white-space:pre-line;line-height:1.9">${esc(row[field])}</div></section>`).join('')}
          <section><h3 class="sm mm" lang="my">သင်ယူရမည့်ရည်ရွယ်ချက်များ</h3><ol class="mm" data-db-mm-objectives lang="my" style="padding-left:22px;display:grid;gap:8px;line-height:1.9">${objectives.map(value => `<li>${esc(value)}</li>`).join('')}</ol></section>
          <section data-db-mm-quiz><h3 class="sm mm" lang="my">ကျွမ်းကျင်မှုစစ်ဆေးရန် မေးခွန်းများ</h3>${quiz.map((question, index) => `<div class="mm" data-db-mm-question="${index}" lang="my" style="margin-top:10px;line-height:1.9"><p>${esc(question.question)}</p><ol style="padding-left:22px">${question.options.map(option => `<li>${esc(option)}</li>`).join('')}</ol></div>`).join('')}</section>
        </div>
      </section>`;
}
function verifyCanonical(html, row) {
  const title = html.match(/<p class="mm mut" lang="my" style="margin-top:6px;font-size:16px">([\s\S]*?)<\/p>/)?.[1];
  if (title === undefined || textContent(title) !== row.titleMm) fail(`${row.slug}: titleMm binding failed`);
  const mmCards = articleBlocks(html, 'mm');
  const cards = parseArray(row.contentMm, 'contentMm', 12);
  if (mmCards.length !== cards.length) fail(`${row.slug}: MM card count ${mmCards.length}`);
  mmCards.forEach((match, index) => {
    const titleHtml = match[2].match(/<div class="rt mm"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    const bodyHtml = match[2].match(/<div class="rb mm"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    if (textContent(titleHtml ?? '') !== cards[index].title || textContent(bodyHtml ?? '') !== cards[index].content) fail(`${row.slug}: contentMm card ${index + 1} binding failed`);
  });
  for (const field of ['hookTextMm','commonMistakeMm','actionStepsMm','decisionScenarioMm','keyTakeawayMm']) {
    const value = html.match(new RegExp(`data-db-mm-field="${field}"[^>]*>([\\s\\S]*?)<\\/div>`))?.[1];
    if (value === undefined || textContent(value) !== row[field]) fail(`${row.slug}: ${field} binding failed`);
  }
  const objectivesHtml = html.match(/<ol class="mm" data-db-mm-objectives[^>]*>([\s\S]*?)<\/ol>/)?.[1];
  const renderedObjectives = [...(objectivesHtml ?? '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(match => textContent(match[1]));
  if (JSON.stringify(renderedObjectives) !== JSON.stringify(parseArray(row.learningObjectivesMm, 'learningObjectivesMm', 4))) fail(`${row.slug}: learningObjectivesMm binding failed`);
  const renderedQuestions = [...html.matchAll(/<div class="mm" data-db-mm-question="\d+"[^>]*><p>([\s\S]*?)<\/p><ol[^>]*>([\s\S]*?)<\/ol><\/div>/g)].map(match => ({
    question:textContent(match[1]), options:[...match[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(option => textContent(option[1])),
  }));
  const canonicalQuestions = parseArray(row.quizQuestionsMm, 'quizQuestionsMm', 3).map(question => ({question:question.question,options:question.options}));
  if (JSON.stringify(renderedQuestions) !== JSON.stringify(canonicalQuestions)) fail(`${row.slug}: static quizQuestionsMm binding failed`);
  const modDataText = html.match(/<script type="application\/json" id="mod-data">([\s\S]*?)<\/script>/)?.[1];
  if (!modDataText) fail(`${row.slug}: mod-data missing`);
  const modData = JSON.parse(modDataText);
  const quiz = parseArray(row.quizQuestionsMm, 'quizQuestionsMm', 3).map(q => ({q:String(q.question),opts:q.options.map(String),correct:q.correct,why:String(q.explanation || '')}));
  if (JSON.stringify(modData.quizMm) !== JSON.stringify(quiz)) fail(`${row.slug}: quizQuestionsMm binding failed`);
  if (modData.mmCanonical?.combinedDigest !== combinedDigest(row)) fail(`${row.slug}: whole-page canonical digest binding failed`);
}
async function fetchRows() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) fail('SUPABASE_SERVICE_ROLE_KEY is required');
  const url = new URL(`${PROJECT_URL}/rest/v1/AcademyModule`);
  url.searchParams.set('select', `id,slug,titleMm,vocabularyMm,mm_content_ready,${FIELDS.join(',')}`);
  url.searchParams.set('id', `in.(${MODULES.map(m => m.id).join(',')})`);
  const response = await fetch(url, {headers:{apikey:key,Authorization:`Bearer ${key}`}});
  if (!response.ok) fail(`Supabase read failed: ${response.status} ${await response.text()}`);
  const rows = await response.json();
  if (rows.length !== MODULES.length) fail(`DB returned ${rows.length} rows`);
  return new Map(rows.map(row => [row.id, row]));
}
function assertContract(row, contract) {
  if (row.slug !== contract.slug) fail(`${contract.id}: slug drift`);
  const digest = combinedDigest(row);
  if (digest !== contract.digest) fail(`${row.slug}: combined digest drift ${digest}`);
  if (sha256(row.vocabularyMm) !== contract.vocab) fail(`${row.slug}: vocabularyMm drift`);
  if (row.mm_content_ready !== true) fail(`${row.slug}: mmContentReady is not true`);
  parseArray(row.contentMm, 'contentMm', 12);
  parseArray(row.learningObjectivesMm, 'learningObjectivesMm', 4);
  parseArray(row.quizQuestionsMm, 'quizQuestionsMm', 3);
}
function transform(html, row) {
  const glossary = html.match(/<details class="panel vocab" id="vocab">[\s\S]*?<\/details>/)?.[0];
  if (!glossary) fail(`${row.slug}: glossary block missing`);
  const enBlocks = articleBlocks(html, 'en');
  if (enBlocks.length !== 12) fail(`${row.slug}: EN card count ${enBlocks.length}`);
  const enBytes = enBlocks.map(match => match[0]);
  let output = html;
  const pillAnchor = '    <span class="pill"><svg viewBox="0 0 24 24"';
  const firstPill = output.indexOf(pillAnchor);
  const rowEnd = output.indexOf('  </div>\n\n  <details class="panel vocab"', firstPill);
  if (rowEnd < 0) fail(`${row.slug}: pill row end missing`);
  const toggles = `    <span class="mmk"><span class="mm" lang="my">မြန်မာစာ ရရှိနိုင်သည်</span></span>\n    <span class="langtog" id="langtog"><button data-lang="en" class="on">English</button><button data-lang="mm" class="mm" lang="my">မြန်မာ</button></span>\n`;
  output = output.slice(0, rowEnd) + toggles + output.slice(rowEnd);
  const cardsClose = output.indexOf('\n      </div>\n\n      <section class="panel" id="mastery">');
  if (cardsClose < 0) fail(`${row.slug}: cards boundary missing`);
  output = output.slice(0, cardsClose) + renderCards(row, enBlocks) + '\n      </div>\n\n      ' + renderSupport(row) + output.slice(cardsClose + '\n      </div>'.length);
  const modMatch = output.match(/<script type="application\/json" id="mod-data">([\s\S]*?)<\/script>/);
  if (!modMatch) fail(`${row.slug}: mod-data missing`);
  const modData = JSON.parse(modMatch[1]);
  modData.quizMm = parseArray(row.quizQuestionsMm, 'quizQuestionsMm', 3).map(q => ({q:String(q.question),opts:q.options.map(String),correct:q.correct,why:String(q.explanation || '')}));
  modData.mmCanonical = {recipe:'CCO-PROSE-COMBINED-V1',combinedDigest:combinedDigest(row),fields:Object.fromEntries(FIELDS.map(field => [field,sha256(row[field])]))};
  output = output.replace(modMatch[0], `<script type="application/json" id="mod-data">${JSON.stringify(modData).replace(/</g,'\\u003c')}</script>`);
  if (output.match(/<details class="panel vocab" id="vocab">[\s\S]*?<\/details>/)?.[0] !== glossary) fail(`${row.slug}: glossary bytes changed`);
  const afterEn = articleBlocks(output, 'en').map(match => match[0]);
  if (JSON.stringify(afterEn) !== JSON.stringify(enBytes)) fail(`${row.slug}: EN card bytes changed`);
  verifyCanonical(output, row);
  return output;
}
async function main() {
  const rows = await fetchRows();
  for (const contract of MODULES) assertContract(rows.get(contract.id), contract);
  for (const contract of MODULES) {
    const row = rows.get(contract.id);
    const file = path.join(process.cwd(), 'academy/m', row.slug, 'index.html');
    const before = await readFile(file, 'utf8');
    const after = transform(before, row);
    await writeFile(file, after, 'utf8');
    process.stdout.write(`${row.id}\t${combinedDigest(row)}\tmmContentReady=true\n`);
  }
}
await main();
