#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PROJECT_URL = 'https://ehjomikzakqjtkvwrcqf.supabase.co';
const SLUGS = [
  'serve-with-dignity-how-confident-service-gets-you-promoted-faster-than-silent-obedience',
  'win-the-job-in-30-seconds-how-first-impressions-in-grooming-and-greeting-decide-your-hospitality-career',
  'turn-angry-guests-into-loyal-guests-the-complaint-recovery-skill-that-makes-you-irreplaceable',
  'see-what-the-guest-needs-before-they-ask-how-anticipation-skills-double-your-tips-and-promotions',
  'speak-so-guests-trust-you-essential-english-phrases-and-body-language-that-outperform-fluency',
];
const COMPLAINT_SLUG = SLUGS[2];
const MYANMAR_CLASS_COUNTS = new Map([
  ['mm mut', 1],
  ['mm', 1],
  ['label mm', 1],
  ['sm mut mm', 1],
  ['vterm-mm mm', 8],
  ['vterm-d mm', 8],
  ['vterm-e mm', 8],
  ['sm dim vocab-sig mm', 1],
]);
const MYANMAR_RE = /[\u1000-\u109f\uaa60-\uaa7f]/u;

function fail(message) {
  throw new Error(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeHtml(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|#39);/gi, (_, entity) => {
    if (entity[0] === '#') {
      const hex = entity[1].toLowerCase() === 'x';
      return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return named[entity.toLowerCase()] ?? `&${entity};`;
  });
}

function textFrom(block, pattern, label) {
  const match = block.match(pattern);
  if (!match) fail(`missing ${label}`);
  return decodeHtml(match[1]);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label} differs from DB canonical bytes`);
}

function parseVocabulary(raw, slug) {
  const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!Array.isArray(value) || value.length !== 8) fail(`${slug}: expected 8 vocabulary entries`);
  const keys = ['term_en', 'term_mm', 'definition_en', 'definition_mm', 'example_en', 'example_mm'];
  for (const [index, entry] of value.entries()) {
    for (const key of keys) {
      if (typeof entry[key] !== 'string' || entry[key].length === 0) {
        fail(`${slug}: entry ${index + 1} missing ${key}`);
      }
    }
  }
  return value;
}

function verifyDbCanonical(html, row) {
  const title = textFrom(
    html,
    /<p class="mm mut"(?: lang="my")? style="margin-top:6px;font-size:16px">([\s\S]*?)<\/p>/,
    `${row.slug}: titleMm`,
  );
  assertEqual(title, row.titleMm, `${row.slug}: titleMm`);

  const entries = parseVocabulary(row.vocabularyMm, row.slug);
  const blocks = [...html.matchAll(/<li class="vterm">([\s\S]*?)<\/li>/g)].map(match => match[1]);
  if (blocks.length !== entries.length) fail(`${row.slug}: rendered vocabulary count ${blocks.length}`);

  blocks.forEach((block, index) => {
    const entry = entries[index];
    assertEqual(textFrom(block, /<span class="vterm-en">([\s\S]*?)<\/span>/, 'term_en'), entry.term_en, `${row.slug}:${index + 1}:term_en`);
    assertEqual(textFrom(block, /<div class="vterm-mm mm"(?: lang="my")?>([\s\S]*?)<\/div>/, 'term_mm'), entry.term_mm, `${row.slug}:${index + 1}:term_mm`);
    assertEqual(textFrom(block, /<p class="vterm-d">([\s\S]*?)<\/p>/, 'definition_en'), entry.definition_en, `${row.slug}:${index + 1}:definition_en`);
    assertEqual(textFrom(block, /<p class="vterm-d mm"(?: lang="my")?>([\s\S]*?)<\/p>/, 'definition_mm'), entry.definition_mm, `${row.slug}:${index + 1}:definition_mm`);
    assertEqual(textFrom(block, /<p class="vterm-e"><span>([\s\S]*?)<\/span>/, 'example_en'), entry.example_en, `${row.slug}:${index + 1}:example_en`);
    assertEqual(textFrom(block, /<p class="vterm-e mm"(?: lang="my")?>([\s\S]*?)<\/p>/, 'example_mm'), entry.example_mm, `${row.slug}:${index + 1}:example_mm`);
  });
}

function addLangAttributes(html, slug) {
  let output = html;
  for (const [className, expected] of MYANMAR_CLASS_COUNTS) {
    const classPattern = escapeRegExp(className);
    const opening = new RegExp(`<(p|span|div) class="${classPattern}"(?![^>]*\\blang=)([^>]*)>`, 'g');
    output = output.replace(opening, '<$1 class="' + className + '" lang="my"$2>');
    const finalPattern = new RegExp(`<(?:p|span|div) class="${classPattern}" lang="my"[^>]*>`, 'g');
    const count = (output.match(finalPattern) || []).length;
    if (count !== expected) fail(`${slug}: ${className} lang count ${count}, expected ${expected}`);
  }
  const total = [...MYANMAR_CLASS_COUNTS.values()].reduce((sum, value) => sum + value, 0);
  const tagged = (output.match(/<(?:p|span|div) class="[^"]*" lang="my"[^>]*>/g) || []).length;
  if (tagged !== total) fail(`${slug}: total lang=my blocks ${tagged}, expected ${total}`);
  return output;
}

function applyTemplate(html, slug) {
  let output = html;

  output = output.replace(
    '</head><noscript><style>.mm{font-family:"Myanmar Text",sans-serif}</style></noscript>',
    '</head><noscript><style>.mm{font-family:"DM Sans","Padauk",sans-serif}</style></noscript>',
  );
  if (!output.includes('<noscript><style>.mm{font-family:"DM Sans","Padauk",sans-serif}</style></noscript>')) {
    fail(`${slug}: no-JS font override not updated`);
  }

  output = output.replace('class="sm dim vocab-sig"', 'class="sm dim vocab-sig mm"');
  output = addLangAttributes(output, slug);

  const license = '<span>Licensed since 2024</span><span class="dot"></span>';
  if (!output.includes(license)) {
    const anchor = '<span>ReferTRM · Talent Resources Myanmar Co., Ltd.</span><span class="dot"></span>';
    if (!output.includes(anchor)) fail(`${slug}: footer anchor missing`);
    output = output.replace(anchor, `${anchor}\n      ${license}`);
  }
  if ((output.match(/Licensed since 2024/g) || []).length !== 1) fail(`${slug}: license anchor count`);

  const rbBlocks = [...output.matchAll(/<div class="rb(?: | mm)">([\s\S]*?)<\/div>/g)];
  const myanmarRb = rbBlocks.filter(match => MYANMAR_RE.test(match[1]));
  if (slug === COMPLAINT_SLUG) {
    if (myanmarRb.length !== 1) fail(`${slug}: expected one mixed-language rb block`);
    if (myanmarRb[0][0].includes('<div class="rb ">')) {
      output = output.replace(myanmarRb[0][0], myanmarRb[0][0].replace('<div class="rb ">', '<div class="rb mm">'));
    }
  } else if (myanmarRb.length !== 0) {
    fail(`${slug}: unexpected mixed-language rb block`);
  }
  if (slug === COMPLAINT_SLUG && (output.match(/<div class="rb mm">/g) || []).length !== 1) {
    fail(`${slug}: rb mm count`);
  }

  return output;
}

async function fetchRows() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) fail('SUPABASE_SERVICE_ROLE_KEY is required');
  const url = new URL(`${PROJECT_URL}/rest/v1/AcademyModule`);
  url.searchParams.set('select', 'id,slug,titleMm,vocabularyMm');
  url.searchParams.set('slug', `in.(${SLUGS.join(',')})`);
  const response = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) fail(`Supabase read failed: ${response.status}`);
  const rows = await response.json();
  if (rows.length !== SLUGS.length) fail(`DB returned ${rows.length} rows, expected ${SLUGS.length}`);
  return new Map(rows.map(row => [row.slug, row]));
}

async function updateStyles(root) {
  const file = path.join(root, 'academy/assets/styles.css');
  let css = await readFile(file, 'utf8');
  css = css.replace(
    '--fontmm: "Padauk", "Myanmar Text", ui-sans-serif, system-ui, sans-serif;',
    '--fontmm: "DM Sans","Padauk",sans-serif;',
  );
  if (!css.includes('--fontmm: "DM Sans","Padauk",sans-serif;')) fail('styles.css font stack not updated');
  await writeFile(file, css, 'utf8');
}

async function main() {
  const root = process.cwd();
  const rows = await fetchRows();
  await updateStyles(root);
  for (const slug of SLUGS) {
    const row = rows.get(slug);
    if (!row) fail(`${slug}: DB row missing`);
    const file = path.join(root, 'academy/m', slug, 'index.html');
    const before = await readFile(file, 'utf8');
    verifyDbCanonical(before, row);
    const after = applyTemplate(before, slug);
    verifyDbCanonical(after, row);
    await writeFile(file, after, 'utf8');
    process.stdout.write(`${slug}\tDB-canonical\t29 lang=my blocks\n`);
  }
}

await main();
