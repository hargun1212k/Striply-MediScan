# Striply — Architecture Decision Records (DECISIONS.md)

> **Purpose:** Log every meaningful architectural and technical decision, the alternatives evaluated, and the rationale accepted. Prevents re-litigating settled technical arguments.

---

## ADR-001: Rebranding & Project Scope Shift to "Striply"
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** The original concept was named "RP Lines" (Rapid Pocket Lines / Color-Line Printed Code) and focused solely on 4-color printing.
* **Decision:** Rebrand to **Striply** and expand into a dual-persona, 3-tier ecosystem: (1) Pocket-level visual code, (2) Dual-mode offline edge scanner, and (3) Cloud inventory management & AI predictive waste redistribution.
* **Rationale:** "Striply" creates an intuitive consumer and commercial brand. Addressing the root cause of pharmaceutical write-offs requires both identification and an intelligent redistribution network.

---

## ADR-002: Deterministic Computer Vision vs. End-to-End Deep Learning
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Decoding visual patterns from mobile cameras could use an end-to-end CNN/YOLO model or a deterministic computer vision pipeline (OpenCV contour detection + perspective warp + CIE LAB color distance).
* **Decision:** Adopt a **purely deterministic Computer Vision pipeline** for edge decoding. Reserve Machine Learning strictly for demand forecasting and inventory waste prediction.
* **Rationale:**
  * *Safety & Explainability:* In healthcare, neural network hallucinations or soft misclassifications cannot be tolerated. Deterministic CV allows explicit failure states (`INVALID_CODE`, `UNABLE_TO_VERIFY`).
  * *Latency & Footprint:* Deterministic CV runs in $< 50 \text{ ms}$ on edge mobile CPUs without requiring heavy neural accelerators (NPUs) or large model downloads.

---

## ADR-003: CIE $L^*a^*b^*$ and CIEDE2000 for Color Classification
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Direct RGB or HSV comparisons fail under fluctuating pharmacy lighting (warm incandescent, cool fluorescent, daylight) and camera sensor differences.
* **Decision:** Utilize **CIE $L^*a^*b^*$** color space and the **CIEDE2000 ($\Delta E_{00}$)** distance metric combined with printed reference white/black fiducials.
* **Rationale:** CIE $L^*a^*b^*$ separates luminance ($L^*$) from chromaticity ($a^*, b^*$). Computing CIEDE2000 distance allows perceptually uniform color separation and normalizes sensor white-balance shifts.

---

## ADR-004: Offline-First Edge SQLite Architecture
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Many retail pharmacies and hospital basement dispensaries have unreliable or non-existent cellular/Wi-Fi connectivity.
* **Decision:** Embed a lightweight, encrypted SQLite database directly inside the mobile app containing the regional medicine master catalog, registered batches, consumer cabinet, and store ledger.
* **Rationale:** Zero network latency during dispensing operations. Sync to central cloud occurs asynchronously in the background.

---

## ADR-005: 5-State Explicit Outcome Taxonomy
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Displaying probabilistic results (e.g., "78% confidence Paracetamol") leads to dangerous human bias and dispensing errors.
* **Decision:** Enforce 5 binary, explicit outcome states:
  1. `IDENTIFIED`
  2. `EXPIRED`
  3. `INVALID CODE`
  4. `DATABASE UNAVAILABLE`
  5. `UNABLE TO VERIFY`
* **Rationale:** The system refuses ambiguous or low-confidence scans rather than presenting a guess.

---

## ADR-006: Dual-Persona (Customer & Chemist) Edge Architecture
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** The product needs to serve both retail/hospital chemists managing inventory and patients at home verifying loose cut tablets.
* **Decision:** Power both user experiences from the exact same underlying OpenCV C++ engine and offline SQLite database, exposing distinct UI modes:
  * *Customer Mode:* Simple Pill Identifier, Safe/Expired Card, and "My Medicine Box" home cabinet.
  * *Chemist Mode:* High-speed continuous multi-scan counter, DTE shelf-life tracker, and store stock reconciliation.
* **Rationale:** Maximizes code reuse at the edge while tailoring UX to user clinical context.

---

## ADR-007: Next.js 14 + Supabase (PostgreSQL + RLS + Triggers) Cloud Stack
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Need a cloud architecture for the pharmacy management portal, inventory aggregation, multi-tenancy, and audit logs.
* **Decision:** Adopt **Next.js 14+ (App Router)** paired with **Supabase (PostgreSQL 16 + GoTrue Auth + Realtime + Database Triggers)**.
* **Rationale:**
  * *Data Integrity & RLS:* Row Level Security policies guarantee that pharmacists can only access their store's inventory and consumers can only access their own medicine box.
  * *Database Triggers:* Automatically calculate `days_to_expiry` and generate staged expiry alerts (`notice_90d`, `critical_60d`, `urgent_30d`) inside PostgreSQL whenever inventory updates.
  * *Modern Web Stack:* Next.js Server Components and Server Actions provide sub-second dashboard rendering and zero client-side token leakage.

---

## ADR-008: Python FastAPI Microservice for AI Demand Forecasting & PuLP Solver
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** The cloud backend needs to predict sales velocity and optimize surplus-to-deficit medicine transfers across regional pharmacies.
* **Decision:** Build a standalone Python 3.11 microservice using **LightGBM** (time-series forecasting) and **PuLP / SciPy** (linear programming bipartite matching), integrated via Supabase webhooks.
* **Rationale:** Python possesses the most mature optimization and time-series ecosystem. Isolating compute-heavy linear programming from the Next.js web runtime preserves web responsiveness.



---

## ADR-009: FEFO (First Expiry, First Out) Inventory Prioritization Engine
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Pharmacies frequently dispense newly arrived batches while older stock languishes in dispensary drawers, leading to unnecessary shelf-spoilage.
* **Decision:** Implement an automated **FEFO (First Expiry, First Out)** engine inside PostgreSQL via `idx_fefo_expiry_queue` and the database function `get_fefo_batch_for_dispensing`.
* **Rationale:** Enforcing FEFO programmatically ensures pharmacists are automatically guided to dispense the earliest expiring batch first, directly driving down avoidable waste.

---

## ADR-010: WhatsApp Notification Gateway for Patient Adherence & Recalls
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** Many patients ignore mobile app push notifications, leading to missed doses or missed safety recalls. In emerging markets, WhatsApp has near-universal penetration.
* **Decision:** Integrate a dedicated WhatsApp Notification Gateway (`public.whatsapp_queue` + Twilio/Gupshup webhook) allowing patients and pharmacists to opt-in for scan verification summaries, morning/evening dosage reminders, and urgent batch recall alerts.
* **Rationale:** Maximizes message open rates ($>95\%$) and provides critical immediate reach during manufacturer safety recalls.

---

## ADR-011: Deep Cobalt Frosted Glassmorphism Design System
* **Date:** 2026-11-12
* **Status:** Accepted
* **Context:** The product requires a clean, modern, clinical-yet-approachable aesthetic that looks premium for both home consumers and professional dispensary staff.
* **Decision:** Adopt the **Deep Cobalt Frosted Glassmorphism** design system (`#0A1128` ambient canvas, translucent glass cards with `backdrop-filter: blur(16px)`, crisp 1px borders, and glowing royal/electric blue accents).
* **Rationale:** Provides high visual contrast for pill photography and scan proof inspection, creating a futuristic, tactile, and trustworthy healthcare interface.

---

## ADR-012: 4-Colour Line Mapping & Database Retrieval of Composition
* **Date:** 2026-11-13
* **Status:** Accepted
* **Context:** A 5th purple band was previously considered for encoding active chemical composition. However, chemical strings are too variable to encode directly on miniature micro-lines.
* **Decision:** Standardize on 4 primary spectral channels (Red: Medicine ID, Blue: Batch ID, Green: Mfg Date, Yellow: Expiry Date). Active composition and usage instructions are retrieved securely from the central database using the decoded Medicine ID.
* **Rationale:** Maximizes optical tolerance and print fidelity. Modulo-11 parity checksum embedded in the Blue channel ensures 100% verification before database retrieval.

---

## ADR-013: Pharmaceutical Blister-Foil Repeat Layout Engine over Adhesive Labels
* **Date:** 2026-11-13
* **Status:** Accepted
* **Context:** Conventional A4 sticker or label sheets do not reflect pharmaceutical manufacturing reality and cannot be applied to high-speed blister packing lines.
* **Decision:** Build a continuous repeating blister-foil layout engine with configurable substrate width (160mm), repeat length (240mm), and optical eye-marks for gravure/flexographic blister lidding presses.
* **Rationale:** Provides print-ready digital artwork matching real-world pharmaceutical packaging requirements.


---

## ADR-011: Light Glassmorphism UI & Exact Brand Palette Realization
* **Date:** 2026-11-13
* **Status:** Accepted
* **Context:** The original UI designs (`media_1794588095008_114b732c.jpg`) use a clean, clinical light aesthetic with off-white (`#F4F6FC`), pure white cards (`#FFFFFF`), light blue borders (`#DCE7FF`), deep blue (`#173B70`), and vibrant primary cobalt (`#1454E8`). Previous builds leaned towards an overly dark theme.
* **Decision:** Align the interface with the exact light frosted glassmorphic specification (`rgba(255, 255, 255, 0.58)` to `rgba(255, 255, 255, 0.85)` + 16px blur + `#DCE7FF` borders) and standard brand color palette. Maintain Manrope for brand/headings and Inter for body.
* **Rationale:** Reflects a trustworthy, modern healthcare application suitable for both everyday consumers and pharmaceutical enterprise users.

---

## ADR-012: Dedicated Industrial Blister-Foil Printing & Proof Engine
* **Date:** 2026-11-13
* **Status:** Accepted
* **Context:** After batch registration and RP Lines pattern generation, manufacturers require physical production of lidding foil webs. A simple vector export was insufficient for production workflows.
* **Decision:** Implement a multi-step printing workflow: `Batch Registration -> Add Entries -> Generate Patterns -> Foil Artwork Preview -> Print Settings -> Print Preview -> Print / Export`. Include toggles for repeat lengths, foil width, eye-marks, calibration anchors, physical mm dimensions, and high-res vector/PDF export with clear regulatory disclaimers.
* **Rationale:** Provides pharmaceutical manufacturers with accurate print proofs and RIP-ready vector files while preventing incorrect use on standard office printers.
