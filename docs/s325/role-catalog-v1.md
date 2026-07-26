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
-- → raw_operational=253, clean_all_tenant=220, clean_public_production=216  (calculated 2026-07-26)

-- Title/company dimensions of the raw active set:
SELECT COUNT(DISTINCT title)      FROM "Job" WHERE status='active';  -- 196
SELECT COUNT(DISTINCT "companyId") FROM "Job" WHERE status='active';  -- 74
```

| Measure | Value | Source |
|---|---:|---|
| **raw_operational** (active jobs) | **253** | `job_count_truth_v1` |
| **clean_all_tenant** (active − synthetic − expired − registry-retired) | **220** | `job_count_truth_v1` |
| **clean_public_production** (clean_all_tenant ∩ production tenant) | **216** | `job_count_truth_v1` |
| Distinct titles (raw active set) | 196 | `Job` |
| Distinct companies (raw active set) | 74 | `Job` |

The three count-truth numbers come from the live `job_count_truth_v1` view (raw 253 / clean_all_tenant 220 / clean_public_production 216). The 196 distinct titles / 74 companies describe the raw active set the catalog's title_map is built from; public-facing counts must use `clean_public_production` (216), per the #422 contract.

---

## 1. GRADE SPINE — bound to `user_career_grade` (no parallel system)

The grade spine is the **`user_career_grade.career_level`** field. Distinct values currently in use (90 rows): `Basic` (2), `Senior` (3), `Supervisor` (63), `Manager` (20), `Senior Manager` (2).

**6 Myanmar-market rungs** (the 5 existing `career_level` values + the ratified `Officer/Executive` extension):

| Rung | `career_level` value | Status | Market titles mapped here (from the 196) |
|---|---|---|---|
| 1 | `Basic` | existing | Trainee, Junior, Staff, Assistant, Helper, Cashier, Checker, Picker, Driver, Office Staff, Kitchen Helper, Waiter |
| 2 | `Officer/Executive` | **RATIFIED (S325)** — ruled equivalent to Assistant Manager | Executive, Officer, Coordinator, Analyst, Specialist, Associate, Advisor, Accountant, Engineer, Developer, Designer, Writer, Technician, Chef, Purchaser |
| 3 | `Senior` | existing | Senior [X] (Senior Accountant, Senior Sales Executive, Senior Auditor, …) |
| 4 | `Supervisor` | existing | Supervisor, Team Leader, Lead |
| 5 | `Manager` | existing | Manager, Assistant Manager, Branch Manager, Shop Manager |
| 6 | `Senior Manager` | existing | Senior Manager, Head of [X], Chief [X], General Manager, Director |

**Ratified extension (seal_role_catalog_v1_ratified_s325):** `Officer/Executive` is **APPROVED** as a value of the **same `career_level` field** (free-text), not a new table or enum — so it binds to `user_career_grade` rather than inventing a parallel grade system. KoKo ruled it **equivalent to Assistant Manager** (the 6th rung of the ratified ladder). It covers the mid-level individual-contributor titles that dominate the Myanmar market — `Executive` (19 listings) and `Officer` (8) — which the original 5 rungs had no home for. *Reconciliation note: the catalog's proposed ordering placed Officer/Executive at rung 2 (mid-IC); the seal rules it equivalent to Assistant Manager. Codex should bind the rung to the Assistant-Manager-equivalent grade when wiring `user_career_grade`.*

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

> **Live-state note (reproducible):** as of 2026-07-26 the DB still returns `Senior RS Staff` as `status='active'` (1 active job, Innopex `cmmlrk3a90014lqecuyuoyg4i`; active distinct-titles still 196, active jobs still 253). The CTO closure is therefore a **pending data action** (a `status` flip, a DB write outside this read-only artifact). Until that flip lands, the §0 ground-truth snapshot (253/196) still counts this row; the catalog records the CTO decision that it is retired and needs no family mapping.
> `SELECT id, title, status FROM "Job" WHERE title ILIKE '%Senior RS Staff%';` → `status='active'` (pending flip to closed).

---

## 4. TENANT INHERITANCE — how a duty template gets a real grade

**Model:** a tenant duty template inherits a platform function family + grade rung from its `role_type`, using the **same** `family_of()`/`grade_of()` rules as the platform layer (so the inheritance is reproducible). When PR #429's tenant resolution matches a worker to a template by normalized role, the template's inherited platform function+grade gives the worker a **real grade bound to `user_career_grade.career_level`** — not a guess.

**Chain:** `tenant template.role_type → platform function_family + grade_rung (= career_level) → user_career_grade`

### Makro's 16 templates → inherited platform function + grade

| Template (`role_type`) | Inherits family | Inherits grade (`career_level`) | Active staff | CCO serve |
|---|---|---|---:|---|
| O2O | Retail Store Operations* | Basic | 45 | pending |
| Dry Food | Retail Store Operations* | Basic | 18 | pending |
| Butchery | Retail Store Operations* | Basic | 17 | pending |
| Cashier | Retail Store Operations* | Basic | 13 | **approved** |
| Fruit & Vegetable | Retail Store Operations* | Basic | 11 | pending |
| Checker | Procurement & Supply Chain* | Basic | 5 | pending |
| Sales Rep | Sales | Basic | 4 | pending |
| Fish | Retail Store Operations* | Basic | 4 | pending |
| Day Pass | Retail Store Operations* | Basic | 4 | pending |
| Cold Chain | Procurement & Supply Chain* | Basic | 3 | **approved** |
| Bakery | Retail Store Operations* | Basic | 2 | pending |
| Customer Sales & Service | Sales | Basic | 2 | pending |
| Non Buying | Retail Store Operations* | Basic | 2 | pending |
| Data Cleaning | IT | Basic | 1 | pending |
| Goods Receiving | Procurement & Supply Chain* | Basic | 1 | **approved** |
| QA | Retail Store Operations* | Basic | 0 | pending |

All 16 Makro store roles inherit `Basic` (correct — they are entry-level). **Future tenants** (TRM's 3 templates, Win Brothers' 5) inherit the same way; TRM currently resolves 0/6 (per the D-022 probe context) because its templates are not yet role-aligned — inheriting platform grades is what closes that.

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

1. **OPEN ASK 1 — `Officer/Executive` `career_level` rung — RATIFIED (APPROVED).** Same-field extension covering 27 mid-IC titles (Executive 19, Officer 8). **Ruled equivalent to Assistant Manager, 6th rung.** (See §1 reconciliation note re: rung ordering.)
2. **OPEN ASK 2 — the 12 market-evidenced function-family extensions — RATIFIED (APPROVED).** Approved as platform families (see §2).
3. **OPEN ASK 3 — "Senior RS Staff" (Innopex Company) — RESOLVED (CTO, 2026-07-26).** Role closed / no longer active; no JD needed and no family mapping required. "RS" was never guessed. *Live-state caveat:* the DB still returns `status='active'` for this row as of 2026-07-26 (reproducible), so the closure is a pending data action (a `status` flip) rather than a reflected state; the §0 raw snapshot (253) still counts it until the flip lands.

**Status: RATIFIED — Codex builds may consume this catalog.** No schema, migration, or UI work was performed here (scoped out; those are Codex briefs).
