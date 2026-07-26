# Company logos — how to add or replace one (no engineer needed)

1. Open this folder on GitHub → **Add file → Upload files**.
2. Name the image exactly `<company_id>.png` (or `.jpg` / `.webp`).
   - Find the `company_id` in [`/data/public-company-cards-v1.json`](../public-company-cards-v1.json)
     — e.g. `makro-myanmar-001.png`.
   - Square-ish images at least 256×256 look best. Under 200 KB, please.
3. Open [`/data/company-logos-v1.json`](../company-logos-v1.json) → pencil (edit) →
   add one line inside `"logos"`:

   ```json
   "makro-myanmar-001": { "src": "/data/logos/makro-myanmar-001.png", "alt": "Makro Myanmar logo", "updatedBy": "your name", "updatedAt": "2026-07-26" }
   ```

4. Commit. The site picks it up within a minute — on the companies screen,
   the company profile, and anywhere else the logo appears. No deploy, no code.

If a logo is missing or broken, the surface automatically shows the company's
lettermark instead — nothing ever renders empty or crashes.
