# ROLE CATALOG v1 — RATIFIED [QWEN-S326-ROLE-CATALOG-RECONCILE]

**Status:** **RATIFIED** — `seal_role_catalog_v1_ratified_s325`: OPEN ASKs 1 & 2 **APPROVED by KoKo in S325** (Officer/Executive ruled equivalent to Assistant Manager, 6th rung; 12 family extensions approved). OPEN ASK 3 (Senior RS Staff) resolved (role closed). Probe-verified ground truth (CTO re-probe PASS 2026-07-25); §0 snapshot reconciled to the count-truth split (S326).
**Ratification:** **RATIFIED.** This research seat did not self-ratify; ratification is KoKo's, recorded in the seal.
**Branch:** `qwen-role-catalog-s325` · **As of:** 2026-07-26 · **Seat:** Qwen
**Companion data:** `role-catalog-v1.json` (full cited title_map + matrix + tenant inheritance)
**Supersedes:** the v1 DRAFT on this branch. **3.7's catalog is REJECTED (9 of 9 fabricated measurements) — never cited.**

---

## 0. SOURCE OF TRUTH (count-truth split; sourced from `job_count_truth_v1`)

**eq/jobs roles — reconciled to the count-truth contract (#422, serving).** The catalog mines the live active set; public surfaces consume `clean_public_production`.

### Reproducible probe (re-run these exactly; CTO re-probes to accept)

```sql
-- Count-truth split (live view, #422):
SELECT raw_operational, clean_all_tenant, clean_public_production, calculated_at
FROM job_count_truth_v1;
-- → raw_operational=252, clean_all_tenant=219, clean_public_production=215  (calculated 2026-07-26, after Senior RS Staff flip)

-- Title/company dimensions of the raw active set:
SELECT COUNT(DISTINCT title)      FROM "Job" WHERE status='active';  -- 195
SELECT COUNT(DISTINCT "companyId") FROM "Job" WHERE status='active';  -- 74
```

| Measure | Value | Source |
|---|---:|---|
| **raw_operational** (active jobs) | **252** | `job_count_truth_v1` |
| **clean_all_tenant** (active − synthetic − expired − registry-retired) | **219** | `job_count_truth_v1` |
| **clean_public_production** (clean_all_tenant ∩ production tenant) | **215** | `job_count_truth_v1` |
| Distinct titles (raw active set) | 195 | `Job` |
| Distinct companies (raw active set) | 74 | `Job` |

The three count-truth numbers come from the live `job_count_truth_v1` view (raw 252 / clean_all_tenant 219 / clean_public_production 215). These moved down by 1 from 253/220/216 when the **Senior RS Staff flip landed** (that row is now `status='closed'`; active distinct titles 196→195). The 195 distinct titles / 74 companies describe the raw active set the catalog's title_map is built from; public-facing counts must use `clean_public_production` (215), per the #422 contract.

---

## 1. GRADE SPINE — bound to `user_career_grade` (no parallel system)

The grade spine is the **`user_career_grade.career_level`** field. Distinct values currently in use (90 rows): `Basic` (2), `Senior` (3), `Supervisor` (63), `Manager` (20), `Senior Manager` (2).

**6 Myanmar-market rungs — SEAL ORDER (`seal_role_catalog_v1_ratified_s325`, verbatim):** Basic · Senior · Supervisor · Officer/Executive (=Assistant Manager) · Manager · Senior Manager.

| Rung (seniority) | `career_level` value | Status | Market titles mapped here (from the 195) |
|---|---|---|---|
| 1 | `Basic` | existing | Trainee, Junior, Staff, Assistant, Helper, Cashier, Checker, Picker, Driver, Office Staff, Kitchen Helper, Waiter |
| 2 | `Senior` | existing | Senior [X] (Senior Accountant, Senior Sales Executive, Senior Auditor, …) |
| 3 | `Supervisor` | existing | Supervisor, Team Leader, Lead |
| 4 | `Officer/Executive` | **RATIFIED (S325)** — = Assistant Manager | Executive, Officer, Coordinator, Analyst, Specialist, Associate, Advisor, Accountant, Engineer, Developer, Designer, Writer, Technician, Chef, Purchaser, Assistant Manager |
| 5 | `Manager` | existing | Manager, Branch Manager, Shop Manager |
| 6 | `Senior Manager` | existing | Senior Manager, Head of [X], Chief [X], General Manager, Director |

> **READ THIS FIRST — "6th value ≠ 6th rung."** `Officer/Executive` is the **6th VALUE added to `career_level`** (the 5 existing values + this one), and it sits **4th in seniority** — between Supervisor (3) and Manager (5). The "6th" in the seal refers to its ordinal as a *value*, not its seniority rank. It is **equivalent to Assistant Manager**. Do not place it above Senior Manager. (A prior revision mis-read "6th value" as "rung 6" and graded it above Senior Manager; that was reverted to seal order.)

**Ratified extension (seal_role_catalog_v1_ratified_s325):** `Officer/Executive` is **APPROVED** as the **6th `career_level` value** of the **same field** (free-text), not a new table or enum — so it binds to `user_career_grade` rather than inventing a parallel grade system. It sits **between Supervisor and Manager in the Myanmar-market ladder** (4th in seniority), **equivalent to Assistant Manager**. It covers the mid-level individual-contributor titles that dominate the Myanmar market — `Executive` (19 listings) and `Officer` (8) — which the original 5 rungs had no home for. *Why this is careful: the catalog feeds tenant `duty template.role_type → platform function + grade → user_career_grade`; mis-ranking Officer/Executive as rung 6 would have graded 27 mid-IC titles above Senior Manager across Makro's 134 staff.*

> Note: the platform also has a 3-tier matcher `Band` (Entry/Mid/Senior, `seniority.ts`) and `ksa_career_tracks.level` (STARTER/BEGINNER/MOVER/FLYER). Those are separate concerns (matching gate; learning progression). The catalog's grade spine is `career_level`.

---

## 2. FUNCTION FAMILIES — bound to `ksa_career_tracks.career_family`

**7 existing families** (`ksa_career_tracks.career_family`): Admin, Finance, HR, IT, Marketing, Operations, Sales.

**12 market-evidenced extensions** (**APPROVED, S325** — `seal_role_catalog_v1_ratified_s325`; the 196 titles genuinely span functions the 7 don't cover): Banking & Financial Services, Engineering & Technical, Procurement & Supply Chain, Retail Store Operations, Production & Manufacturing, Quality Control, Hospitality & Food Service, Content & Creative, Legal & Compliance, Translation, Research & Field, Coaching & Training.

---

## 3. PLATFORM LAYER — 196 titles → family × grade (every mapping cited)

Each of the 196 distinct titles maps to one function family × one grade rung, **citing the real `Job` row(s)** (`job_ids` + `company_ids`) in `role-catalog-v1.json → platform_layer.title_map`. Zero invented titles or IDs.

### Family × grade matrix — cell value = n (real listings supporting it)

`0` = honest-empty (published, never omitted, never "benchmark"). Per salary doctrine: "on N listings," never "benchmark."

| Function family | Basic | Officer/Exec | Senior | Supervisor | Manager | Senior Mgr | **Total** |
|---|---:|---:|---:|---:|---:|---:|---:|
| Retail Store Operations* | 25 | 1 | 0 | 1 | 12 | 0 | **39** |
| Sales | 21 | 5 | 4 | 4 | 2 | 0 | **36** |
| Finance | 2 | 22 | 3 | 0 | 0 | 1 | **28** |
| Procurement & Supply Chain* | 11 | 5 | 1 | 7 | 3 | 0 | **27** |
| IT | 4 | 17 | 0 | 3 | 0 | 0 | **24** |
| Admin | 11 | 4 | 1 | 2 | 0 | 0 | **18** |
| Marketing | 4 | 8 | 0 | 0 | 5 | 0 | **17** |
| HR | 5 | 6 | 0 | 2 | 3 | 0 | **16** |
| Operations | 1 | 3 | 0 | 2 | 3 | 1 | **10** |
| Engineering & Technical* | 0 | 6 | 0 | 1 | 0 | 1 | **8** |
| Content & Creative* | 0 | 8 | 0 | 0 | 0 | 0 | **8** |
| Banking & Financial Services* | 0 | 3 | 0 | 0 | 4 | 0 | **7** |
| Hospitality & Food Service* | 2 | 2 | 0 | 1 | 0 | 0 | **5** |
| Legal & Compliance* | 0 | 0 | 0 | 1 | 1 | 0 | **2** |
| Production & Manufacturing* | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Quality Control* | 2 | 0 | 0 | 0 | 0 | 0 | **2** |
| Research & Field* | 0 | 1 | 0 | 0 | 0 | 0 | **1** |
| Translation* | 0 | 1 | 0 | 0 | 0 | 0 | **1** |
| Coaching & Training* | 0 | 1 | 0 | 0 | 0 | 0 | **1** |
| **UNMAPPED** | 0 | 0 | 1 | 0 | 0 | 0 | **1** |
| **Total** | **88** | **93** | **9** | **26** | **33** | **3** | **253** |

*(Full per-title citations — job_ids + company_ids + level values — in `role-catalog-v1.json`.)*

### UNMAPPED — a finding, never a silent default

| Title | n | Company | Why |
|---|---:|---|---|
| ~~Senior RS Staff~~ | 1 | Innopex Company | **RESOLVED (CTO, 2026-07-26):** role closed / no longer active — no JD needed, no mapping required. "RS" was never guessed. |

That was the only unmapped title of 196; it is now resolved by retirement.

> **Live-state note (reproducible):** the Senior RS Staff flip **has landed** — the DB now returns `status='closed'` for this row (verified 2026-07-26). The §0 snapshot reflects this: raw_operational moved 253→252 and active distinct titles 196→195. The closure is no longer pending; it is reflected in live state and in the count-truth split.
> `SELECT id, title, status FROM "Job" WHERE title ILIKE '%Senior RS Staff%';` → `status='closed'`.

---

## 4. TENANT INHERITANCE — how a duty template gets a real grade

**Model — SPECIFIED but UNWIRED.** `performance_duty_templates` carries `platform_function` and `career_level` columns, but **all 25 templates have BOTH = NULL** (verified reproducible: `SELECT career_level, COUNT(*) FROM performance_duty_templates GROUP BY career_level;` → `NULL: 25`; same for `platform_function`). The catalog *specifies* the mapping below; **wiring it into the columns is a Codex brief, not done here.** An earlier clean-read mis-read these NULLs as `Basic` — corrected: nothing is graded yet.

**The consumption chain is designed, not live:** `tenant template.role_type → platform_function + career_level → user_career_grade`. **`user_career_grade`'s 90 rows are fed by a different path** (the career assessment/game), **not** by template inheritance — so the NULL template columns do not currently affect any user's grade. Wiring template → grade is future work.

### PROPOSED `platform_function` mapping for all 25 templates (PROPOSAL — not applied)

Against the ratified **19 families** (7 existing `ksa_career_tracks.career_family` + 12 ratified extensions). Makro's shop-floor roles map to **Retail Store Operations** — exactly why the seal created Retail as its own family rather than burying it in Operations. **Flagged** where a role spans two families or is generic; **not guessed**.

| Template (`role_type`) | Company | Proposed `platform_function` | Note |
|---|---|---|---|
| Office & Administrative Staff | The Recruiter | Admin | clear |
| Production & Warehouse Staff | The Recruiter | Production & Manufacturing | **FLAG:** spans Production + Warehouse (Procurement & Supply Chain) |
| Sales & Distribution Staff | The Recruiter | Sales | **FLAG:** spans Sales + Distribution (Procurement & Supply Chain) |
| Bakery | Makro | Retail Store Operations | shop-floor |
| Butchery | Makro | Retail Store Operations | shop-floor |
| Cashier | Makro | Retail Store Operations | shop-floor |
| Checker | Makro | Retail Store Operations | checkout checker |
| Cold Chain | Makro | Retail Store Operations | **FLAG:** cold-chain logistics could be Procurement & Supply Chain |
| Customer Sales & Service | Makro | Retail Store Operations | **FLAG:** could be Sales |
| Data Cleaning | Makro | IT | data function |
| Day Pass | Makro | Retail Store Operations | checkout |
| Dry Food | Makro | Retail Store Operations | shop-floor |
| Fish | Makro | Retail Store Operations | shop-floor |
| Fruit & Vegetable | Makro | Retail Store Operations | shop-floor |
| Goods Receiving | Makro | Procurement & Supply Chain | **FLAG:** inbound logistics; could be Retail |
| Non Buying | Makro | Retail Store Operations | Non Food section |
| O2O | Makro | Retail Store Operations | **FLAG:** online-order picking; could be IT |
| QA | Makro | Quality Control | quality assurance |
| Sales Rep | Makro | Sales | sales |
| Delivery Driver | Win Brothers | Procurement & Supply Chain | delivery/logistics |
| HR and Admin Officer | Win Brothers | HR | **FLAG:** spans HR + Admin |
| Key Account Executive | Win Brothers | Sales | sales |
| Regional Sales Supervisor | Win Brothers | Sales | sales |
| Warehouse Operations Lead | Win Brothers | Procurement & Supply Chain | warehouse ops |
| General Staff | *(global)* | **UNMAPPED — FLAG** | generic fallback template; no specific family — do not guess |

**Proposal summary:** 18 map cleanly or with a noted primary; 7 are **FLAGGED** as spanning two families (Production & Warehouse Staff, Sales & Distribution Staff, Cold Chain, Customer Sales & Service, Goods Receiving, O2O, HR and Admin Officer); 1 is **UNMAPPED** (General Staff — generic global fallback). `career_level` is likewise NULL/unwired for all 25 and is **not** proposed here (grade wiring is part of the same future Codex brief). **This is a proposal — nothing is applied to the DB.**

---

## 5. FENCES (held)

- **Ground truth reproducible:** the 3 SQL queries in §0 produce 253/196/74 exactly; CTO re-probes to accept.
- **Zero invented:** every title and id in `title_map` comes from a real `Job` row. No fabricated titles, IDs, or counts.
- **Grade spine bound:** grades bind to `user_career_grade.career_level`. `Officer/Executive` is a documented same-field extension, not a parallel system.
- **Function families bound:** 7 are the existing `ksa_career_tracks.career_family`; 12 extensions are market-evidenced and flagged `*` for ratification.
- **Myanmar = CCO-PENDING:** no Myanmar authored here; existing `role_type_mm` is client-verbatim.
- **Salary:** no salary figures anywhere — counts only ("on N listings").
- **Out of scope:** schema/migration/UI remain Codex briefs **after** KoKo + Z Bo Maung ratify and the CTO re-probe accepts.

---

## 6. ACCEPTANCE & RATIFICATION RECORD

**CTO re-probe: PASS (2026-07-25).** The §0 ground-truth section was independently reproduced (`career_level` and `career_family` confirmed; matrix sums to 253; "Senior RS Staff" confirmed a real flagged row). §0 reconciled to the count-truth split (raw 253 / clean_all_tenant 220 / clean_public_production 216 from `job_count_truth_v1`) in S326.

### RATIFICATION — `seal_role_catalog_v1_ratified_s325` (KoKo, S325)

This is a research seat; it does **not** ratify its own deliverable. Ratification is KoKo's, recorded in the seal. The three open asks are resolved as follows:

1. **OPEN ASK 1 — `Officer/Executive` `career_level` rung — RATIFIED (APPROVED).** Same-field extension covering 27 mid-IC titles (Executive 19, Officer 8). **6th `career_level` VALUE, 4th in seniority** (= Assistant Manager, between Supervisor and Manager). **6th value ≠ 6th rung** — see §1.
2. **OPEN ASK 2 — the 12 market-evidenced function-family extensions — RATIFIED (APPROVED).** Approved as platform families (see §2).
3. **OPEN ASK 3 — "Senior RS Staff" (Innopex Company) — RESOLVED (CTO, 2026-07-26).** Role closed / no longer active; no JD needed and no family mapping required. "RS" was never guessed. *Live state:* the `status` flip **has landed** — the DB now returns `status='closed'` (verified 2026-07-26), and the §0 snapshot reflects it (raw 252, active distinct titles 195).

**Status: RATIFIED — Codex builds may consume this catalog.** No schema, migration, or UI work was performed here (scoped out; those are Codex briefs).
