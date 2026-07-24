#!/usr/bin/env node
/* ============================================================
   YDC TOKENS-AS-LINT · v1 · 2026-07-24
   Checks a .css / .html / .js file against the brand tokens
   and the brand laws. Zero dependencies.
   Usage:  node lint.js <file> [file...]
   Exit 0 = clean · Exit 1 = findings (report on stdout)
   ============================================================ */
'use strict';
const fs = require('fs');

/* the palette — keep in sync with tokens.css / tokens.json */
const PALETTE = [
  '#ff7a85','#ffc24b','#54c8ff','#b28cff','#4ade80',           // five majors
  '#ffd166','#5eead4','#ffb25e','#ff6e7f',                       // accents
  '#070b18','#0d1428','#141c36','#1a2342',                       // night surfaces
  '#f2f5ff','#a8b2d8','#6e789f',                                 // night ink
  '#e7efff','#f5f9ff','#ffffff','#f0f4ff',                       // day surfaces
  '#141b33','#4a5578','#8a93b5',                                 // day ink
];
const FONT_OK = /var\(--font\)|ui-rounded/i;

const files = process.argv.slice(2);
if(!files.length){
  console.log('usage: node lint.js <file> [file...]');
  process.exit(2);
}

let findings = 0;
const report = (file, line, rule, text) => {
  findings++;
  console.log(`  ${rule}  ${file}:${line}  ${text.trim().slice(0, 110)}`);
};

for(const file of files){
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  let hexes = 0, fonts = 0, assets = 0, glyphs = 0;
  console.log(`\n${file}`);

  lines.forEach((text, i) => {
    const n = i + 1;
    if(/lint-ok/.test(text)) return;               // signed inline exception — the exception register's marker
    const isTokenDef = /^\s*--[\w-]+\s*:/.test(text);   // token definitions are the palette itself

    /* R1 · color drift — a hardcoded hex outside the palette */
    if(!isTokenDef){
      const found = text.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
      for(const h of found){
        const norm = h.toLowerCase();
        const full = norm.length === 4
          ? '#' + [...norm.slice(1)].map(c => c + c).join('')
          : norm.slice(0, 7);
        if(!PALETTE.includes(full)){ hexes++; report(file, n, 'R1-color ', `${h} — not a brand token`); }
      }
    }

    /* R2 · type drift — a font stack that isn't the brand stack */
    if(/font-family\s*:/.test(text) && !FONT_OK.test(text)){
      fonts++; report(file, n, 'R2-type  ', 'font-family outside var(--font)');
    }

    /* R3 · 3G law — images, webfonts, external asset calls */
    if(/<img[\s>]/i.test(text))                { assets++; report(file, n, 'R3-3G    ', '<img> — zero images on the trail'); } // lint-ok
    if(/@font-face/.test(text))                { assets++; report(file, n, 'R3-3G    ', '@font-face — zero webfonts'); } // lint-ok
    if(/url\(\s*['"]?https?:/i.test(text))     { assets++; report(file, n, 'R3-3G    ', 'external url() — no remote assets'); }
    if(/<link[^>]+href\s*=\s*['"]https?:/i.test(text)){ assets++; report(file, n, 'R3-3G    ', 'remote <link> — no remote assets'); }

    /* R4 · MM glyphs — CCO signs every Myanmar string before it ships */
    if(/[̀-ჟꙠ-ꞿ]/.test(text)){
      glyphs++; report(file, n, 'R4-MM    ', 'Myanmar glyph — ships only with CCO sign-off');
    }
  });

  if(!(hexes || fonts || assets || glyphs)) console.log('  ✓ clean');
}

console.log(findings
  ? `\n${findings} finding(s) — fix, or record a signed exception.`
  : '\nall files clean — the tokens hold.');
process.exit(findings ? 1 : 0);
