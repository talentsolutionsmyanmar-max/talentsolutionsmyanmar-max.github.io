# ROLE CATALOG v1 — ReferTRM [ROLE-CATALOG-S325]

**Status:** DRAFT for KoKo + Z Bo Maung review. Research + authoring only — **no schema, migration, or UI** (those become Codex briefs after approval).
**As of:** 2026-07-24 · **Seat:** Qwen · **Companion data:** `role-catalog-v1.json`

---

## 0. GROUND TRUTH (mined read-only, never invented)

| Source | Count | Note |
|---|---:|---|
| Active job listings (`Job WHERE status='active'`) | **253** | 196 distinct titles, across ~49 companies |
| Makro active staff (`workforce_status`, `employment_status='active'`) | **134** | +43 offboarded = 177 total |
| Makro distinct live role titles | **16** | one per active-staff role |
| Makro `performance_duty_templates` | **16** | `role_type` + `duties` (jsonb) + `default_weighting` |
| `maya_knowledge_base` principles (context) | 1,938 | 1,937 active |

**Count note:** 253 is the *raw active* count in `Job`. The CTO count-contract amendment (2026-07-23) sets *clean-public* at ~212 after removing synthetic/expired/duplicate rows. This catalog mines the live active set **as written** and does not pad or trim. Top employers by active roles: Makro 20, Thadoe Mahar 18, Innopex 16, The Recruiter 14, EAC 11, New Ever Best 11, TOMO 10, Myanmar Indobest 8, Electronic City 7 (+6 on a duplicate `cuid` record — see dedupe note).

**Company-dedupe note (carried from S322 doctrine):** Electronic City appears twice in the active set (`comp_electronic_city` = 7 + `cmmlrks2i…` = 6); KBZ Life, Unicharm, Myanmar Indobest likewise split across a canonical `comp_` record and a scraped `cuid`. The coverage map below keys on `companyId` as-is; canonical-employer rollup is a DB-dedupe task, not a catalog task.

---

## 1. GRADE LADDER — authored once, applies to every function

### Market check first (the 253 listings, by title keyword)

| Title keyword | Count | | Title keyword | Count |
|---|---:|---|---|---:|
| Manager | 34 | | Junior | 14 |
| Staff | 31 | | Senior | 12 |
| Assistant | 28 | | Officer | 8 |
| Supervisor | 24 | | Coordinator | 6 |
| Executive | 19 | | Associate / Analyst / Chief / Specialist / Lead / Trainee / GM | 1–4 each |

**The market reality differs from the imported ladder** (Junior · Staff · Senior · Manager · Senior Manager · Department Head) in two ways the catalog must respect:

1. **"Executive" is a MID-level individual-contributor rung in Myanmar, not a senior leader.** It is the single most common mid-title (19) and must be its own rung. Importing the US meaning (Executive = C-suite) would mis-grade every "Brand Executive / HR Executive / Sales Executive" in the data.
2. **"Supervisor" is a distinct first-line / senior-IC rung (24 listings) that the proposed ladder omits.** It sits between Executive and Manager.
3. **"Senior" in Myanmar is a prefix within a grade** (Senior Accountant, Senior Sales Executive), **not a standalone grade.**

### Proposed 6 rungs (reconciling the brief's ladder with the market)

| Rung | Name (Myanmar-real) | Brief equivalent | Scope | Autonomy | Decision rights | People |
|---|---|---|---|---|---|---|
| **G1** | Junior / Trainee | Junior | Learns the function; contributes to defined tasks under close guidance | Works to detailed instruction; escalates most decisions | None binding; recommends within own task | None |
| **G2** | Staff / Assistant | Staff | Executes a defined set of recurring tasks independently | Owns routine execution; escalates exceptions | Decides within established rules (accept/reject against a checklist) | None / guides a peer on a task |
| **G3** | Officer / Executive | *(brief had "Senior" here — market uses Officer/Executive as the mid IC rung)* | Owns a workstream/portfolio; the core mid-level IC | Plans & executes own workstream; guidance on edge cases | Routine operational decisions within policy | Coordinates peers/juniors; no line reports |
| **G4** | Supervisor / Senior | *(not a separate rung in the brief — added: 24 Supervisor + 12 Senior titles)* | Senior IC and/or first-line lead over a small team/shift | Sets day-to-day approach for the team; resolves most ops issues | Approves operational decisions; escalates policy/cost | First-line: assigns & checks 2–10 staff; coaches juniors |
| **G5** | Manager / Assistant Manager | Manager | Accountable for a function/unit's outcomes, people, budget | Sets unit objectives within department direction | Hiring, spend, priority within delegated limits | Manages a team/supervisors; accountable for performance |
| **G6** | Senior Manager / Department Head / Chief | Senior Manager + Department Head | Leads a department/business unit across multiple teams | Sets department direction & policy within company strategy | Significant spend, hiring, policy for the department | Leads managers; accountable for capability & results |

### Measurable competencies per rung (4–5 each)

- **G1 Junior/Trainee:** follows a documented procedure end-to-end without skipping steps · asks a clarifying question before acting when unclear · completes assigned tasks within the agreed timeframe · records own work accurately.
- **G2 Staff/Assistant:** executes the core recurring tasks to the documented standard · flags an exception/discrepancy instead of passing it on silently · maintains accurate records for every transaction · meets the expected daily/weekly throughput.
- **G3 Officer/Executive:** owns a workstream end-to-end without day-to-day supervision · analyses a problem and proposes a solution with trade-offs stated · coordinates with another team for a shared outcome · produces decision-ready output · applies policy correctly to non-routine cases.
- **G4 Supervisor/Senior:** plans & assigns the team's daily/weekly work and checks it to standard · resolves an operational problem a G2/G3 would escalate · coaches a junior to perform a task correctly · reports team performance & exceptions accurately · enforces the relevant standard/safety rule consistently.
- **G5 Manager:** sets clear measurable objectives and tracks progress · makes a resourcing/priority trade-off within authority · manages performance (feedback, underperformance, development) · owns the unit budget/cost · escalates an out-of-authority risk with a recommendation.
- **G6 Senior Manager/Head:** sets department direction aligned to strategy · makes a significant decision with risks weighed · builds the capability of reporting managers · represents the department and is accountable for results · resolves a cross-department conflict/dependency.

> **CCO-PENDING:** all Myanmar rung names (e.g. how "Executive"/"Supervisor" render in Myanmar job titles) are CCO slots — none authored here.

---

## 2. FUNCTIONS BY DEPARTMENT (23 functions, 10 departments)

Each function lists **observable duties** — behaviours a manager can score, not aspirations. Duties for Retail / Warehouse / Sales / Customer Service / Data are grounded in the real Makro duty templates; others are authored as standard observable behaviours for the function (catalog-standard; the *listing-specific* duties come from each job's `description`/`requirements` at scoring time).

### Finance
- **Finance & Accounting** (28 listings, 16 titles) — records transactions to the chart of accounts within cutoff · reconciles a balance and documents reconciling items each period · prepares a tax/statutory submission accurately and on time · flags an out-of-policy entry before posting · produces a periodic report that ties out to source.
- **Banking & Financial Services** (6 listings) — verifies customer identity against KYC before servicing · assesses a loan/credit application against policy with the rationale recorded · explains product terms/fees/risks in plain language · escalates a fraud/AML red flag the same day.

### Commercial
- **Sales & Business Development** (36 listings, 27 titles) — contacts the assigned prospects per period and logs each · records an order/lead with complete accurate fields · achieves the assigned target (or documents the gap & cause) · explains pricing/bulk terms/membership correctly · follows up an open lead within the agreed time.
- **Marketing & Brand** (17 listings) — executes a campaign/promotion to brief, budget, timeline · produces collateral to brand guidelines · tracks & reports campaign metrics accurately · coordinates with sales/trade so the offer is available as promised.
- **Customer Service** (5 listings) — serves each customer to standard within the expected wait · resolves or escalates a complaint with full context within SLA · processes a transaction/membership/day-pass accurately · records feedback & recurring issues.

### Technology
- **Software & Web Development** (4 listings) — delivers a ticket/feature to acceptance criteria & definition of done · writes code that passes review and the test/build pipeline · documents what was built and how to run/deploy it · diagnoses & fixes a defect and verifies before closing.
- **IT Systems & Networks** (9 listings) — resolves a support ticket within SLA and records it · performs scheduled system/network/backup checks and logs the result · provisions/de-provisions access per procedure · escalates a security/outage incident immediately.
- **Data & Analytics** (12 listings) — collects/captures data to the defined instrument & quality standard · cleans & validates a dataset and documents corrections · produces a reproducible analysis/report · checks output for obvious errors before submitting.

### Operations
- **Engineering & Technical** (8 listings) — completes a maintenance/inspection task to standard and logs it · diagnoses a fault and applies a safe, compliant fix · follows lock-out/tag-out & safety procedures · records parts used and time taken.
- **Production & Manufacturing** (2 listings) — runs the line/shift to the output & quality target · performs the in-process quality check and records it · follows the safety/operating procedure · logs output, downtime, material usage.
- **Quality Control & Assurance** (2 listings) — inspects product against spec and records pass/fail · quarantines & labels a non-conforming item and raises the record · uses/calibrates test equipment per procedure · reports inspection results & defect trends.
- **Research & Field Collection** (1 listing) — collects field data per instrument & sampling protocol · verifies & submits within the reporting window · follows the ethical/safety protocol · documents field conditions affecting the data.

### People & Admin
- **Human Resources** (16 listings) — processes a hire/movement/exit accurately and on time · runs a recruitment step to standard & timeline · maintains employee records complete & confidential · answers an HR query accurately or routes within SLA.
- **Administration & Secretarial** (17 listings) — handles documents/calls/visitors to office standard · maintains a filing system so a document is retrievable on request · schedules & coordinates meetings/travel accurately · prepares a routine document to format.
- **Coaching, Training & Sports** (1 listing) — plans & delivers a session to the programme standard · assesses & records learner progress · maintains a safe environment per the safeguarding procedure · adapts the session to the learner's level.

### Supply Chain
- **Procurement & Purchasing** (8 listings) — raises a PO matching the approved requisition & budget · obtains the required quotes and documents supplier selection · verifies a supplier invoice against PO & goods received before approving · tracks an open order and follows up late delivery.
- **Warehouse & Logistics** (19 listings) — receives a delivery and reconciles invoice items/quantities against the PO · picks/packs an order accurately against the picking list and stages it · rotates stock per FIFO/FEFO and records expiry/temperature checks · reports expired/damaged/discrepant goods with findings · keeps the area organised, clean, safe.

### Retail
- **Retail Store Operations** (34 listings, 21 titles) — receives & inspects the day's product for quality/quantity/spec · displays/stores to planogram with correct pricing & FIFO/FEFO rotation · serves the wholesale customer accurately at the counter (weighing, pricing, bulk terms) · maintains food-safety/hygiene/temperature standards with complete logs · minimises & records waste through forecasting & rotation.

### Hospitality
- **Hospitality & Food Service** (5 listings) — prepares/serves food or beverage to recipe & presentation standard · follows food-safety/hygiene/temperature handling · serves the guest to standard within the expected time · maintains kitchen/service-area cleanliness & safety.

### Creative
- **Content, Creative & Design** (8 listings) — produces an asset to brief & brand guidelines · delivers by the agreed deadline & revision cycle · checks the asset for accuracy before publishing · records the asset & its performance.

### Corporate
- **Legal & Compliance** (2 listings) — reviews a contract against the legal checklist and flags risks · maintains the compliance register and tracks obligations to deadline · advises a query with the applicable rule cited · escalates a material risk promptly.
- **Translation & Language** (1 listing) — translates accurately between the required languages · preserves meaning, tone & technical terms · delivers by the deadline · flags an ambiguous/untranslatable segment.
- **Operations & General Management** (8 listings) — plans & coordinates the unit's activities to the operating plan · tracks KPIs and reports performance & exceptions · resolves a cross-functional coordination issue · manages a project/task to scope, timeline, budget.

> **CCO-PENDING:** every function name and duty above needs a Myanmar translation slot — none authored here.

---

## 3. SCORECARD ASSEMBLY RULE

**Default weighting (from the 16 Makro templates, uniformly):** `duties 70% / competencies (KSA) 30%`.

**Assembly:** a scorecard = (the role's **function duties**, weighted 70%) + (the role's **grade competencies**, weighted 30%). Score each duty and each competency **0–5 on observed behaviour**, weight the duties (equal by default unless the template specifies otherwise), then:

```
final_score = 0.7 × duties_score + 0.3 × competency_score
```

**Scoring scale:** 0 = not observed/not done · 1–2 = partial/inconsistent · 3 = meets the standard · 4 = consistently exceeds · 5 = exemplary / coaches others.

**Evidence rule:** each scored duty needs evidence (the templates' `evidence_types`: `client_job_jd`, `manager_sign_off`, `cco_verify`). A duty with no evidence is scored **0 / not-observed — never assumed.**

**Where HR can override (recorded, never silent):**
- re-weight duties vs competencies (e.g. a safety-critical role weights duties higher);
- mark a duty non-scoreable / not-applicable for a specific role;
- add a role-specific duty.

Overrides are recorded on the assignment (`performance_assignments.weighting` + `.duties` jsonb) **with a reason**, and never silently change the function default. The 70/30 default applies wherever HR has not overridden.

---

## 4. COVERAGE MAP — every listing + Makro's 16 titles → function + grade

**253 listings: 250 mapped, 3 UNMAPPED.** Grade inferred from title keywords (G1–G6); function from title clustering.

### UNMAPPED — called out explicitly (a finding, never a silent default)

| Title | Company | Inferred grade | Why unmapped |
|---|---|---|---|
| Supervisor | `cmmlrk3a90014…` (Innopex) | G4 | title too generic — no function keyword; needs the JD/company to place |
| Senior Supervisor | `cmmlrjjx50000…` (RK Yangon Steel) | G4 | title too generic — no function keyword; needs the JD to place |
| Senior RS Staff | `cmmlrk3a90014…` (Innopex) | G2 | undefined abbreviation ("RS" not expanded); needs the JD to place |

### Vague-title flags (scoreable only with the JD)

`Supervisor`, `Senior Supervisor`, `Senior RS Staff` — the title alone is too generic to assign function-level duties. **Flagged, not invented.** (Note: `Credit Officer` initially clustered as unmapped by the keyword tool but is correctly **Banking & Financial Services / G3** — corrected in the map.)

### Function coverage (listings · distinct titles · grade mix)

| Function | Dept | Listings | Titles | Dominant grades |
|---|---|---:|---:|---|
| Sales & Business Development | Commercial | 36 | 27 | G2 (21), G4 (8), G3 (5) |
| Retail Store Operations | Retail | 34 | 21 | G2 (22), G5 (11) |
| Finance & Accounting | Finance | 28 | 16 | G3 (22), G4 (3) |
| Warehouse & Logistics | Supply Chain | 19 | 17 | G2 (8), G4 (7) |
| Marketing & Brand | Commercial | 17 | 12 | G3 (8), G5 (5) |
| Administration & Secretarial | People & Admin | 17 | 13 | G2 (10), G3 (4) |
| Human Resources | People & Admin | 16 | 12 | G3 (6), G2 (5) |
| Data & Analytics | Technology | 12 | 10 | G3 (9) |
| IT Systems & Networks | Technology | 9 | 7 | G3 (4), G2 (3) |
| Engineering & Technical | Operations | 8 | 8 | G3 (6) |
| Procurement & Purchasing | Supply Chain | 8 | 7 | mixed |
| Content, Creative & Design | Creative | 8 | 6 | G3 (8) |
| Operations & General Management | Corporate | 8 | 8 | G5 (3), G3 (3) |
| Banking & Financial Services | Finance | 6 | 6 | G5 (4), G3 (2) |
| Customer Service | Commercial | 5 | 5 | G2 (3) |
| Hospitality & Food Service | Hospitality | 5 | 5 | mixed |
| Software & Web Development | Technology | 4 | 4 | G3 (4) |
| Legal & Compliance | Corporate | 2 | 2 | G5/G4 |
| Production & Manufacturing | Operations | 2 | 2 | G4 (2) |
| Quality Control & Assurance | Operations | 2 | 1 | G2 (2) |
| Research & Field Collection | Operations | 1 | 1 | G3 |
| Translation & Language | Corporate | 1 | 1 | G3 |
| Coaching, Training & Sports | People & Admin | 1 | 1 | G3 |

*(Full per-listing map in `role-catalog-v1.json` → `coverage_map`.)*

---

## 5. MAKRO RECONCILIATION — which of the 16 templates map 1:1 to a real title

**14 of 16 templates match an active `Job` title exactly.** The 16 templates map to functions/grades as follows (active-staff count from the 134):

| Template | Function | Grade | Exact title match? | Active staff | CCO status |
|---|---|---|---|---:|---|
| O2O | Retail Store Operations | G2 | ✓ | 45 | verify_pending |
| Dry Food | Retail Store Operations | G2 | ✓ | 18 | verify_pending |
| Butchery | Retail Store Operations | G2 | ✓ | 17 | verify_pending |
| Cashier | Retail Store Operations | G2 | ✓ | 13 | **signoff_approved** |
| Fruit & Vegetable | Retail Store Operations | G2 | ✓ | 11 | verify_pending |
| Checker | Warehouse & Logistics | G2 | ✓ | 5 | verify_pending |
| Sales Rep | Sales & Business Development | G2 | ✓ | 4 | verify_pending |
| Fish | Retail Store Operations | G2 | ✓ | 4 | verify_pending |
| Day Pass | Customer Service | G2 | ✓ | 4 | verify_pending |
| Cold Chain | Warehouse & Logistics | G2 | **✗** | 3 | **signoff_approved** |
| Bakery | Retail Store Operations | G2 | ✓ | 2 | verify_pending |
| Customer Sales & Service | Sales & Business Development | G2 | ✓ | 2 | verify_pending |
| Non Buying | Retail Store Operations | G2 | ✓ | 2 | verify_pending |
| Data Cleaning | Data & Analytics | G2 | ✓ | 1 | verify_pending |
| Goods Receiving | Warehouse & Logistics | G2 | **✗** | 1 | **verify_approved** |
| QA | Retail Store Operations | G2 | ✓ | **0** | verify_pending |

**Overlap findings (the mismatches that matter):**
- **Templates with no exact active-job title (2):** `Cold Chain`, `Goods Receiving` — these roles are filled and scored via the performance system but no live `Job` posting carries the exact title. Not a defect; a sourcing-channel difference.
- **Active-staff role with NO template (1):** `Fresh Food` — **2 active staff** carry role "Fresh Food" which has **no `performance_duty_template`**. They cannot be scored until a template exists (or they're mapped to an existing one). **This is a gap to close.**
- **Template with NO active staff (1):** `QA` — template exists but **0 active staff** are assigned to it.
- **CCO clearance:** only **Cashier** and **Cold Chain** (`signoff_approved`) and **Goods Receiving** (`verify_approved`) are CCO-cleared to serve; the other **13 are `verify_pending`** (`serve_allowed=false`) per `MAKRO-DEPT-FIX-1-S321 PATCH-2`. This matches the tech-debt register's "CCO 13-template MM pass" item.

---

## 6. FENCES (held)

- **Myanmar = CCO-PENDING.** English only authored here. Every rung name, function name, and duty has a CCO slot. The 16 templates' existing `role_type_mm`/`duty_mm` are client-verbatim or CCO-approved per their `_governance.myanmar_mode` — **no new Myanmar authored.**
- **Zero salary figures.** Salary is excluded from the catalog entirely; nothing invented or carried.
- **Market claims cited.** Grade rungs and title frequencies are cited to the 253-listing title-keyword analysis (§1).
- **Vague listings flagged, not invented.** Generic titles (Supervisor, Senior RS Staff) are flagged in the coverage map, not silently assigned duties.
- **Unmapped is a finding.** The 3 unmapped listings are reported explicitly, never defaulted.
- **Out of scope:** schema, migration, UI — these become **Codex briefs** after KoKo + Z Bo Maung approve this catalog.

---

## 7. OPEN ITEMS FOR REVIEW

1. **Grade ladder:** confirm the 6-rung Myanmar-real proposal (esp. "Executive" as mid-IC rung G3, and "Supervisor/Senior" as G4) vs the originally proposed Junior/Staff/Senior/Manager/Senior Manager/Department Head.
2. **`Fresh Food` gap:** 2 active Makro staff have no duty template — create one or map to an existing template.
3. **`QA` template:** exists but 0 active staff — confirm whether to keep, retire, or backfill.
4. **13 `verify_pending` templates:** the CCO 13-template MM pass (tech-debt register) gates whether these can serve.
5. **Function granularity:** IT/Data/Engineering and HR/Admin are split here per market titling — confirm the split matches how Z Bo Maung scores.
