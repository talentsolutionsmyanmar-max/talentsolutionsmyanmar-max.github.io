# ROLE CATALOG v1 — VERIFIED [QWEN-ROLE-CATALOG-VERIFY-S325]

**Status:** **PROBE-VERIFIED** — CTO re-probe PASS (2026-07-25): 253/196/74 reproduced exactly, `career_level` and `career_family` confirmed (no parallel system), matrix sums to 253, "Senior RS Staff" confirmed a real flagged row. Ground truth independently reproducible per `doctrine_research_ground_truth_s324` rule 1. **Codex builds may consume AFTER ratification.**
**Ratification:** **NOT ratified — three OPEN ASKS pending KoKo + Z Bo Maung (Makro HRBP).** This research seat does NOT self-ratify (see §6).
**Branch:** `qwen-role-catalog-s325` · **As of:** 2026-07-25 · **Seat:** Qwen
**Companion data:** `role-catalog-v1.json` (full cited title_map + matrix + tenant inheritance)
**Supersedes:** the v1 DRAFT on this branch. **3.7's catalog is REJECTED (15/16 fabricated) — never cited.**

---

## 0. SOURCE OF TRUTH (CTO-probed live; build from this exact set)

**eq/jobs active roles — every active client role, NOT Makro-only.**

### Reproducible probe (re-run these exactly; CTO re-probes to accept)

```sql
SELECT COUNT(*)                 FROM "Job" WHERE status='active';   -- 253
SELECT COUNT(DISTINCT title)    FROM "Job" WHERE status='active';   -- 196
SELECT COUNT(DISTINCT "companyId") FROM "Job" WHERE status='active'; -- 74
```

| Measure | Value |
|---|---:|
| Active jobs | **253** |
| Distinct titles | **196** |
| Distinct companies | **74** |

These three numbers are the live active set as-written. (The count-contract amendment's ~212 clean-public is a downstream hygiene step; this catalog mines the live active set and does not pad or trim.)

---

## 1. GRADE SPINE — bound to `user_career_grade` (no parallel system)

The grade spine is the **`user_career_grade.career_level`** field. Distinct values currently in use (90 rows): `Basic` (2), `Senior` (3), `Supervisor` (63), `Manager` (20), `Senior Manager` (2).

**6 Myanmar-market rungs** (the 5 existing `career_level` values + 1 documented same-field extension):

| Rung | `career_level` value | Status | Market titles mapped here (from the 196) |
|---|---|---|---|
| 1 | `Basic` | existing | Trainee, Junior, Staff, Assistant, Helper, Cashier, Checker, Picker, Driver, Office Staff, Kitchen Helper, Waiter |
| 2 | `Officer/Executive` | **extension** (same field) | Executive, Officer, Coordinator, Analyst, Specialist, Associate, Advisor, Accountant, Engineer, Developer, Designer, Writer, Technician, Chef, Purchaser |
| 3 | `Senior` | existing | Senior [X] (Senior Accountant, Senior Sales Executive, Senior Auditor, …) |
| 4 | `Supervisor` | existing | Supervisor, Team Leader, Lead |
| 5 | `Manager` | existing | Manager, Assistant Manager, Branch Manager, Shop Manager |
| 6 | `Senior Manager` | existing | Senior Manager, Head of [X], Chief [X], General Manager, Director |

**Why the extension:** the existing 5 rungs have no home for the mid-level individual-contributor titles that dominate the Myanmar market — `Executive` (19 listings) and `Officer` (8). Forcing these into `Basic` or `Senior` would mis-grade 27 real listings. `Officer/Executive` is added as a 6th value of the **same `career_level` field** (free-text), not a new table or enum — so it binds to `user_career_grade` rather than inventing a parallel grade system. **Flagged for KoKo/Z Bo Maung ratification.**

> Note: the platform also has a 3-tier matcher `Band` (Entry/Mid/Senior, `seniority.ts`) and `ksa_career_tracks.level` (STARTER/BEGINNER/MOVER/FLYER). Those are separate concerns (matching gate; learning progression). The catalog's grade spine is `career_level`.

---

## 2. FUNCTION FAMILIES — bound to `ksa_career_tracks.career_family`

**7 existing families** (`ksa_career_tracks.career_family`): Admin, Finance, HR, IT, Marketing, Operations, Sales.

**12 market-evidenced extensions** (flagged `*` — the 196 titles genuinely span functions the 7 don't cover; flagged for ratification or fold-in): Banking & Financial Services, Engineering & Technical, Procurement & Supply Chain, Retail Store Operations, Production & Manufacturing, Quality Control, Hospitality & Food Service, Content & Creative, Legal & Compliance, Translation, Research & Field, Coaching & Training.

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

## 6. ACCEPTANCE & OPEN ASKS

**CTO re-probe: PASS (2026-07-25).** The §0 ground-truth section was independently reproduced (253/196/74 exact; `career_level` and `career_family` confirmed; matrix sums to 253; "Senior RS Staff" confirmed a real flagged row). The catalog is **PROBE-VERIFIED**.

### OPEN ASKS — NOT RATIFIED (ratification belongs to KoKo + Z Bo Maung, Makro HRBP)

This is a research seat. It does **not** ratify its own deliverable — that is self-certification, the same class of error the D-022 counter-check exists to prevent. The three items below are **asks**, recorded as open. No "ratify" instruction typed at this seat is complied with.

1. **OPEN ASK 1 — `Officer/Executive` 6th `career_level` rung.** A documented same-field extension to cover 27 mid-IC titles (Executive 19, Officer 8) the existing 5 rungs cannot hold. *Pending ratification.*
2. **OPEN ASK 2 — the 12 market-evidenced function-family extensions (`*`).** Ratify as platform families or fold into the existing 7. *Pending ratification.*
3. **OPEN ASK 3 — "Senior RS Staff" (Innopex Company) — RESOLVED (CTO, 2026-07-26).** Role closed / no longer active; no JD needed and no family mapping required. "RS" was never guessed. *Live-state caveat:* the DB still returns `status='active'` for this row as of 2026-07-26 (reproducible), so the closure is a pending data action (a `status` flip) rather than a reflected state; the §0 snapshot (253/196) still counts it until the flip lands.

**HOLD:** no schema, migration, or UI work (scoped out). Codex builds may consume this catalog **after** KoKo + Z Bo Maung ratify the open asks. Next move is KoKo's.
