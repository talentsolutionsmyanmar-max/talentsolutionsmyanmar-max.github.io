# Workplace Truth moderation architecture — VLER-gated design only

Status: **DESIGN ONLY — NOT AUTHORIZED FOR BUILD**
Authority: S322 consolidated full-build brief, P4
Activation gate: GPT-5.6 VLER review followed by CTO seal and KoKo authorization

## Boundary

Workplace Truth is a later governed transparency product. It is not the Free Branch Board and it does not inherit publication permission from a public job listing, a client relationship, an employer claim, or an application event.

The Free Branch Board may expose only independently cleared job objects. Workplace Truth owns company profiles, moderated worker evidence, salary evidence, review eligibility, aggregation, employer response, appeals, and correction history. ReferTRM core remains the source for identity, applications, CV, Trinity, matching, and canonical referral identity. Employer core remains the source for contracts, requisitions, verification, and candidate access.

## Proposed evidence lifecycle

1. **Eligible interaction** — a governed core event establishes that a person had a qualifying interaction. Public identity is never created from this event.
2. **Consent capture** — the contributor chooses an evidence tier and sees the privacy consequence before submission.
3. **Structured intake** — facts, dates, salary bands, and incident categories are collected separately from narrative.
4. **Automated safety screening** — secrets, direct identifiers, threats, political content, religious targeting, and unsupported accusations are held for review; no automated approval.
5. **Human moderation** — a trained reviewer checks eligibility, relevance, identifiability, evidence quality, duplication, and retaliation risk.
6. **Aggregation gate** — company-level signals publish only after the CTO-sealed minimum cohort, recency window, and confidence threshold are met.
7. **Employer response** — a verified employer may respond without editing, suppressing, ranking, or discovering the contributor.
8. **Appeal and correction** — contributors and employers receive separate appeal paths; every public correction is versioned and auditable.
9. **Expiry and retention** — evidence ages out of aggregates on a sealed schedule; private audit records follow a separate retention policy.

## Two evidence tiers

- **Verified-interaction evidence** — eligibility comes from a qualifying ReferTRM core interaction. Identity remains private and is not shown to employers.
- **Self-reported evidence** — allowed only under the separately sealed self-report ruling. It is visibly labelled, confidence-limited, and never blended into the verified-interaction aggregate.

## Required controls before build

- Client-consent rule for making a client company a review subject.
- No-client-bias enforcement for inclusion, ordering, aggregation, moderation, and employer response.
- Minimum aggregation cohort and anti-reidentification threshold.
- Eligibility event allowlist and expiry window.
- Salary normalization, currency, period, and outlier policy.
- Reviewer roles, dual-control actions, audit events, and conflict-of-interest exclusion.
- Defamation, retaliation, safety, takedown, appeal, and lawful-request runbooks.
- Rate limits, duplicate detection, abuse scoring, and contributor cooldowns.
- RLS and service-boundary design proving that employers cannot identify contributors.
- CCO-approved Myanmar intake, consent, safety, and appeal language.

## Explicit non-build items

No moderation table, review endpoint, eligibility function, aggregation job, employer-response writer, public company score, badge, rating, seeded review, or salary claim is authorized by this document.

## VLER questions

The GPT-5.6 VLER must evaluate worker reidentification risk, client-bias leakage, self-report labelling, aggregation sufficiency, employer response asymmetry, appeal fairness, salary outliers, moderation reviewer safety, and whether the proposed lifecycle can fail closed without hiding honest empty states.
