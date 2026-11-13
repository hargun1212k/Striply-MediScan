# Striply — Living Session Continuity & Handover (HANDOVER.md)

> **Purpose:** Living record of project status read at the start of every session. Maintains memory across context windows, preventing session amnesia.

---

## 1. Project Snapshot

* **Project Name:** Striply *(Every Strip. Every Dose. Less Waste.)*
* **Active Remote Repository:** `https://github.com/hargun1212k/striply-mediscan.git` (branch: `main`)
* **Core Product:** Dual-persona platform for Consumers (home adherence, pill verification, medicine planner, WhatsApp alarms) and Pharmacies (FEFO stock prioritization, AI expiry intelligence, inter-store redistribution, batch recalls, waste analytics).
* **Recognition Tech:** RP Lines (Recognition Pattern Lines) — 4-colour optical code directly on pharmaceutical blister foil (Red=Med ID, Green=Batch Number, Blue=Expiry Year, Yellow=Expiry Month, line widths, continuity, calibration anchor).
* **Visual Identity:** Light Glassmorphism (`rgba(255, 255, 255, 0.58)` to `0.85`, blur 16px, soft blue borders `#DCE7FF`), Manrope headings, Inter body text, and exact brand palette:
  - Primary Blue: `#1454E8`
  - Off-White Background: `#F4F6FC`
  - Light Blue: `#DCE7FF`
  - Soft Blue: `#8BAAFF`
  - Dark Blue: `#173B70`
  - Near-Black: `#10131B`
  - Pure White: `#FFFFFF`
* **Current Milestone:** UI Refinement, Authentication Sequence Realization, and Industrial Foil Printing Integration.

---

## 2. Status Board

### What's Done
- [x] Initialized Git repository with remote `https://github.com/hargun1212k/striply-mediscan.git` on branch `main`.
- [x] Created system guardrail and continuity documentation:
  - `ARCHITECTURE.md` (System map, topology, and module boundaries)
  - `CONSTRAINTS.md` (Strict non-negotiable healthcare, security, and printing invariants)
  - `TEST_CHECKLIST.md` (Concrete test commands and verification checklist)
  - `ROLLBACK.md` (Safety net and clean recovery steps)
  - `DECISIONS.md` (Logged ADR-011 and ADR-012)
  - `FLOW.md` (Documented complete opening sequence and printing workflow)
  - `FEATURE.md` (Added FEAT-012 and FEAT-013)
- [x] Verified existing codebase assets from `Striply` including Express 5 backend, OpenCV CV engine, and Next.js 14 web app.
- [x] Linked node_modules junctions for rapid compilation and zero unnecessary dependency overhead.

### What's In Progress
- [ ] Upgrade `globals.css` and `tailwind.config.js` with exact brand palette and light glassmorphic utilities.
- [ ] Implement Screen 1: **Animated Splash Screen** (fade-in, scale-up, optical RP beam, tagline "Smarter Medicine. Safer Tracking.").
- [ ] Implement Screen 2: **Login / Sign Up** (first interaction screen with tabs, validation, password toggle, forgot password modal, and demo shortcuts).
- [ ] Implement Screen 3: **Choose User Type** (post-auth role selection matching reference wireframe).
- [ ] Refine Customer Experience (Home, My Medicines tabs, Camera Viewfinder, Scan Results for Verified/Near-Expiry/Expired/Unverified, Profile).
- [ ] Refine Pharmacy Experience (Overview, Inventory, Add Batch with Excel table, Foil Artwork Preview).
- [ ] Implement **Industrial Blister-Foil Printing Engine**:
  - "Print Artwork" action button.
  - Print Settings Modal (width, repeat, scale, copies, orientation, layout preview, eye-marks/anchor toggles).
  - Industrial Print Preview (exact mm dimensions, registration marks, regulatory batch header, pharma disclaimer).
  - Print / Export integrations (Browser Print `@media print`, Vector SVG export, PDF proof download).
- [ ] Verify `npm run build` passes with zero errors.
- [ ] Step-by-step git commits and push to `https://github.com/hargun1212k/striply-mediscan.git`.

### What to Avoid (Strict Guardrails & Invariants)
- **NEVER show the role-selection screen before authentication.** The flow must be: Splash -> Login/Signup -> Choose User Type -> Role Application.
- **NEVER use dark generic dashboard styling.** Stick to the reference UI: light glassmorphism with off-white `#F4F6FC`, pure white cards, and vibrant `#1454E8` cobalt accents.
- **NEVER claim standard office desktop printers are suitable for blister foil manufacturing.** Always include the industrial rotogravure/flexographic compliance disclaimer.
- **NEVER guess or autocomplete drug identities in computer vision.** If confidence is low or glare is excessive, reject the scan.
- **NEVER store patient health information (PHI) on blister packaging.** Only Drug Master Data is encoded.
