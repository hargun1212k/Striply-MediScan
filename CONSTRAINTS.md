# Striply — System Boundaries & Constraints (CONSTRAINTS.md)

> **Strict Non-Negotiable Rules:** Invariants and operational guardrails that every developer and AI assistant must honor.

---

## 1. Product Invariants

1. **Brand Identity:** The product name is **Striply** everywhere. The recognition technology is **RP Lines**. Never use legacy internal codenames (such as RP9).
2. **UI Fidelity:** Maintain fidelity with the Striply UI reference. Do not replace layouts with generic dark templates or generic SaaS cards. The primary theme is light glassmorphism with off-white `#F4F6FC`, pure white cards, and vibrant `#1454E8` cobalt accents.
3. **No Fabricated Medical Authenticity:** An optically valid RP Lines pattern verifies that the pattern matches a registered database batch record. It does NOT independently guarantee that the physical compound inside the capsule is chemically authentic. Never display misleading medical claims.

---

## 2. Security & Healthcare Compliance Boundaries

1. **Role Separation (RBAC):**
   - Customers can ONLY scan, verify, save medicines, and manage their personal intake.
   - Customers CANNOT generate manufacturer batch identities or access print layout engines.
   - Manufacturers CANNOT generate official blister foil patterns until their account is marked as `VERIFIED`.
2. **Zero PHI on Blister Foils:**
   - Under HIPAA / GDPR / Indian Digital Personal Data Protection Act, NO Patient Health Information (name, prescription, disease, phone) may ever be encoded onto physical packaging. Only Drug Master Data (Medicine ID, Batch Code, Mfg Date, Expiry) is encoded.
3. **Deterministic CV Decoding:**
   - If image glare exceeds 8%, calibration anchor is absent, or confidence score is below 0.85, the scanner MUST return `UNVERIFIED` or `UNREADABLE_PATTERN` with a rescan prompt. It must NEVER guess or autocomplete drug metadata.

---

## 3. Industrial Printing Constraints

1. **Industrial Web Printing vs Office Desktop Printers:**
   - Generated blister-foil patterns are engineered for continuous rotogravure or flexographic lidding foil webs (160mm width, 240mm repeat, 100% scale without stretching).
   - The UI must always display the regulatory disclaimer that desktop consumer printers are unsuitable for commercial blister lidding foil manufacturing.
2. **Repeat Integrity:**
   - Patterns must never be non-proportionally scaled or distorted. Eye-marks, edge print zones, and pocket boundaries must remain mathematically locked to real physical millimetres.

---

## 4. Engineering & Code Boundaries

1. **No External Network Dependencies for Core Logic:** The core 4-channel pattern rendering and vector layout engine must work offline and client-side without crashing if the backend is unreachable.
2. **Idempotent Database Migrations:** All SQL scripts must use `IF EXISTS` / `IF NOT EXISTS` constructs so they can be run repeatedly without failure.
3. **Type Safety:** Next.js and TypeScript builds must compile with zero errors (`npm run build`).
