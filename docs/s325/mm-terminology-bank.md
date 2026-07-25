# MYANMAR TERMINOLOGY BANK — S325 [QWEN-S325-MM-TERMINOLOGY-BANK]

**Seat:** Qwen — **English-only leverage work.** Re-issue (a 3.7 attempt was rejected for fabrication).
**Myanmar authorship:** **CCO is the sole authority for all Myanmar (F50).** Qwen **extracts** existing CCO-authored terms below and authors **ZERO** Myanmar text. Every `*Mm` value reproduced here is CCO's, verbatim. All `*Mm` fields on the 176 target modules remain **CCO-PENDING**.
**Companion data:** `mm-terminology-bank.json` (full bank + source prep + coverage map).
**Mode:** reviewable artifact — **no DB writes performed.**

---

## 0. ACCEPTANCE GATE — every number reproduced by SQL (CTO re-probe)

### Claim 1 — the 9 `vocabularyMm` lengths (reproduced before extracting)

```sql
SELECT slug, LENGTH("vocabularyMm") FROM "AcademyModule"
WHERE "vocabularyMm" IS NOT NULL AND LENGTH("vocabularyMm") > 2
ORDER BY LENGTH("vocabularyMm") DESC;
```

| Module | `vocabularyMm` length | Match |
|---|---:|:--:|
| master-the-exact-words-that-work-negotiation-scripts-for-myanmar-workplaces | 5904 | ✓ |
| know-your-exact-market-value-so-no-employer-can-underpay-you | 5842 | ✓ |
| overcome-the-fear-of-asking-why-negotiation-is-respect-not-rudeness | 5475 | ✓ |
| protect-what-you-won-read-contracts-and-defend-your-negotiated-terms | 5271 | ✓ |
| see-the-full-package-how-to-negotiate-total-compensation-beyond-monthly-salary | 5234 | ✓ |
| recruiter-path-m4-the-screen-truth-dignity-and-certification | 4525 | ✓ |
| recruiter-path-m2-the-hunt-sourcing-and-the-search-string | 4352 | ✓ |
| recruiter-path-m3-the-scorecard-quality-metrics-and-the-money | 4280 | ✓ |
| recruiter-path-m1-the-intake-calibrate-before-you-source | 4239 | ✓ |

**CLAIM 1: PASS** — all 9 reproduced exactly; 9 modules, no more.

### Row-count basis — 185 adult / 9 authored / 176 unauthored

```sql
SELECT COUNT(*) FROM "AcademyModule";                                                    -- 210
SELECT COUNT(*) FROM "AcademyModule"
  WHERE category NOT IN ('Biology','Chemistry','Physics','Street Smart');                -- 185  (adult)
SELECT COUNT(*) FROM "AcademyModule"
  WHERE category NOT IN ('Biology','Chemistry','Physics','Street Smart')
  AND "vocabularyMm" IS NOT NULL AND LENGTH("vocabularyMm") > 2;                         -- 9    (authored)
-- unauthored adult = 185 − 9 = 176
```

| Measure | Value |
|---|---:|
| Total `AcademyModule` | 210 |
| **Adult modules** (`category NOT IN ('Biology','Chemistry','Physics','Street Smart')`) | **185** |
| Authored (carry `vocabularyMm`) | **9** |
| **Unauthored adult modules** | **176** |

**ROW-COUNT BASIS: PASS (185/9/176).** The 4 excluded categories (Biology 6, Chemistry 2, Physics 2, Street Smart 15 = 25) are the non-adult set. *Note: "Street Smart" titles read as general life-skills; the filter is stated as the category exclusion that reproduces the CTO-probed 185, not an assertion that Street Smart is youth content.* The 9 authored modules are all in adult categories (Negotiation ×5, Recruitment ×4).

---

## 1. TERMINOLOGY BANK — 72 terms, extracted from the 9 modules

- **72 term entries** = 9 modules × **8 terms each**. **72 distinct EN terms.**
- Each entry: `term_en → term_mm → definition_en / definition_mm → example_en / example_mm` (full data in the JSON).
- **Zero invented terms.** Every term is reproduced from CCO's `vocabularyMm`.

### Conflicts (same concept rendered differently across modules)

- **Exact-term conflicts: NONE.** No `term_en` appears in more than one module — there is no case of the same English term rendered with two different Myanmar terms. Nothing to resolve at the exact-term level.
- **Concept near-duplicate candidates: 22 — FLAGGED for CCO, NOT resolved.** These are heuristic word-overlaps across different modules (e.g. a shared content word). They are **candidates for CCO to confirm or dismiss**, not asserted equivalences. The most coherent cluster is the **salary family**:

  | Term | Module | Shares |
  |---|---|---|
  | Expected Salary | know-your-exact-market-value… | "salary" |
  | Salary Range | know-your-exact-market-value… | "salary" |
  | Salary Band | master-the-exact-words… | "salary" |
  | Base Salary | see-the-full-package… | "salary" |

  Other candidates share weaker words ("rate", "offer", "annual", "respect", "contribution") and are likely distinct concepts. **CCO to decide whether any should be aligned; Qwen does not resolve.** (Full list of 22 in JSON → `terminology_bank.concept_near_dupe_candidates_FLAGGED_for_CCO`.)

### The 72 terms by source module

| Module (8 terms each) | Terms |
|---|---|
| know-your-exact-market-value… | Market Rate (Market Value), Anchoring Bias, Expected Salary, Salary Range, Job Posting, Evidence File, Underpayment, Reference–Range–Respect |
| master-the-exact-words… | Negotiation Script, Gratitude–Value–Invitation, Raise, Annual Review, Indirect Language, Respect Markers, Value Contribution, Salary Band |
| overcome-the-fear-of-asking… | Job Offer, Counter-offer, Catastrophic Thinking, Lowball Offer, Offer Withdrawal, Asymmetric Opportunity, Face-saving, Under-earning |
| protect-what-you-won… | Employment Contract, Clause, Verbal Agreement, Probation Period, Notice Period, Non-compete, Paper Trail, Payslip |
| see-the-full-package… | *(8 total-compensation terms — Base Salary, Annual Bonus, Annual Leave, Allowance, Benefits, SSB Contribution, etc.; see JSON)* |
| recruiter-path-m1 (Intake) | Intake, Calibration, Requisition (req), Submittal (submit), Submit-to-accept ratio, Time to first submittal (TTFS), Must-have vs nice-to-have, Sniper (vs spammer) |
| recruiter-path-m2 (Hunt) | Sourcing, Passive candidate, Boolean operators (AND/OR/NOT), Search string, Talent pool, Talent mapping, X-ray search, Longlist/shortlist |
| recruiter-path-m3 (Scorecard) | KPI, Pipeline, Interview-to-offer rate, Offer-acceptance rate, Placement fee, Commission ladder, Verified close, Clawback |
| recruiter-path-m4 (Screen) | Screening, Behavioral question, + 6 more (see JSON) |

---

## 2. SOURCE PREP — clean English source for the 176 unauthored modules

For each of the **176 unauthored adult modules**, the English source is packaged so CCO hunts nothing: **body, hook, takeaway, mistake, action steps, scenario, objectives, quiz** (+ slug, titleEn, category, duration, difficulty). Every `*Mm` field = **CCO-PENDING**. Full content in JSON → `source_prep.modules[]`.

Category spread of the 176 (the authored 9 removed from Negotiation ×5 and Recruitment ×4): Salary Negotiation, LinkedIn & Personal Brand, Career Planning, Job Search Skills, Sales & Distribution, Interview Prep, Remote Work, Agriculture & Agritech, Supply Chain, Workplace Safety, IT, Hospitality, Labour Law, Banking & Insurance, Real Estate, Healthcare Admin, Communication, Creative & Design, CV Writing, Project Management, Customer Service, Manufacturing & QC, HR, Recruitment (remaining), Negotiation (remaining).

---

## 3. COVERAGE MAP — which unauthored modules reuse which banked terms

Leverage signal for CCO: where an unauthored module's English content contains a banked EN term, CCO can **reuse the banked Myanmar term** rather than author a new one.

- **43 of 72** banked terms appear in at least one unauthored module.
- **145 of 176** unauthored modules contain ≥1 banked term.
- Highest-leverage banked terms (most unauthored modules containing them):

  | Banked term | Unauthored modules containing it |
  |---|---:|
  | Raise | 50 |
  | Job Posting | 38 |
  | Face-saving | 29 |
  | Benefits | 29 |
  | Salary Range | 28 |
  | Market Rate (Market Value) | 25 |
  | Submittal (submit) | 19 |
  | Screening | 19 |
  | Certification | 18 |
  | Probation Period | 15 |

  Full map in JSON → `coverage_map.term_to_modules` and `coverage_map.module_to_terms`.

> **Matching caveat:** coverage is **case-insensitive substring** matching of the banked EN term against the module's concatenated English source. Short or polysemous terms (e.g. "Raise" — *raise a question* vs *pay raise*) will produce **false positives**; the map is a leverage starting point for CCO to verify, not a precise assertion of relevance.

---

## 4. FENCES (held)

- **No Myanmar authored by Qwen.** All `term_mm`/`definition_mm`/`example_mm` are CCO's, reproduced verbatim from the 9 modules' `vocabularyMm`. No `*Mm` field on the 176 target modules was populated.
- **Zero invented terms.** The bank contains exactly the 72 terms present in the 9 modules.
- **Conflicts flagged, not resolved.** 0 exact-term conflicts; 22 concept near-dupe candidates flagged for CCO.
- **No DB writes.** Read-only extraction; delivered as a reviewable artifact (`mm-terminology-bank.json` + this MD).
- **Every quantitative claim reproducible** by the SQL in §0.
