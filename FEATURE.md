# Striply — Feature Lifecycle Tracker (FEATURE.md)

> **Purpose:** Trace all 11 core capabilities from scope definition to technical implementation and verification criteria.

---

## FEAT-001: Pocket-Level 4-Color CLPC Micro-Code Generator
* **Status:** In Progress
* **Scope:** Python script (`src/generator/clpc_generator.py`) producing standardized $4\text{mm} \times 12\text{mm}$ strip codes with White/Black calibration fiducials.
* **Verification Command:**
  ```bash
  python src/generator/clpc_generator.py --med 3 --batch 7 --year 2026 --month 12 --out sample.png
  ```

---

## FEAT-002: 6-Stage Edge Computer Vision Scanner
* **Status:** In Progress
* **Scope:** Real-time 1080p frame decoding with specular glare detection ($I \ge 245$), Laplacian blur gate ($\sigma^2 \ge 120$), contour homography, and CIEDE2000 classification.
* **Verification Command:**
  ```bash
  pytest tests/test_cv_core.py -v
  ```

---

## FEAT-003: Proof Photo & Scan History
* **Status:** Designed / In Scaffolding
* **Scope:** Auto-captures a compressed WebP photo ($<250\text{KB}$) at the exact moment of successful code demodulation, computes its SHA-256 hash, and stores it in Supabase `scan-proofs` bucket.
* **Verification Command:**
  ```bash
  pytest tests/test_proof_photo.py -v
  ```

---

## FEAT-004: Personal Medicine Planner & Daily Reminders
* **Status:** Designed
* **Scope:** Patient UI to configure dosage schedules (e.g. 1 tablet, twice daily), specify medical condition (e.g., *"Fever, body pain"*), set treatment duration (e.g., 5 days), and schedule local notification alarms for 08:00 AM / 08:00 PM.
* **Verification Command:**
  ```bash
  cd mobile && npm test -- -t "MedicinePlanner"
  ```

---

## FEAT-005: Health Profile & Prescription Vault
* **Status:** Designed
* **Scope:** Stores patient chronic/acute conditions, known allergies, blood group, and uploaded prescription images/PDFs in Supabase `prescriptions` bucket.
* **Verification Command:**
  ```bash
  npx supabase test db tests/health_profiles_test.sql
  ```

---

## FEAT-006: WhatsApp Notification Gateway
* **Status:** Designed
* **Scope:** Async queue worker reading from `public.whatsapp_queue` and dispatching Twilio / Gupshup WhatsApp templates for daily dosage reminders, scan proofs, and urgent expiry/recall alerts.
* **Verification Command:**
  ```bash
  pytest tests/test_whatsapp_gateway.py -v
  ```

---

## FEAT-007: Pharmacy Batch & Inventory Management
* **Status:** Designed
* **Scope:** Comprehensive pharmacy inventory ledger tracking Batch No, Mfg Date, Expiry Date, Quantity on Hand, and real-time Days-to-Expiry (DTE) calculations.
* **Verification Command:**
  ```bash
  npx supabase test db tests/inventory_items_test.sql
  ```

---

## FEAT-008: FEFO (First Expiry, First Out) Dispatch Engine
* **Status:** Designed
* **Scope:** Database function `get_fefo_batch_for_dispensing` and index `idx_fefo_expiry_queue` ensuring pharmacists always dispense the earliest expiring batch first.
* **Verification Command:**
  ```bash
  npx supabase test db tests/fefo_engine_test.sql
  ```

---

## FEAT-009: AI Expiry Intelligence & Demand Forecasting
* **Status:** Designed
* **Scope:** LightGBM time-series model predicting 60-day consumption velocity and classifying inventory into High Risk (unconsumed waste), Medium Risk, and Safe.
* **Verification Command:**
  ```bash
  pytest ai_engine/tests/test_demand_forecasting.py -v
  ```

---

## FEAT-010: Smart Stock Redistribution Engine
* **Status:** Designed
* **Scope:** PuLP bipartite matching optimization algorithm suggesting compliant inter-store transfers from surplus pharmacies to deficit clinics within 50 km.
* **Verification Command:**
  ```bash
  pytest ai_engine/tests/test_redistribution_solver.py -v
  ```

---

## FEAT-011: Batch Recall Alerts & Safety Quarantine
* **Status:** Designed
* **Scope:** Automated database trigger broadcast that immediately isolates defective batches in pharmacy FEFO queues and alerts patients holding that batch via WhatsApp.
* **Verification Command:**
  ```bash
  npx supabase test db tests/batch_recall_trigger_test.sql
  ```

---

## FEAT-012: Medicine Waste Analytics Dashboard
* **Status:** Designed
* **Scope:** Quantitative analytical reports tracking baseline waste units vs current waste units (e.g. 124 units $\rightarrow$ 36 units, showing 71% less waste) with expiry distribution donut charts.
* **Verification Command:**
  ```bash
  cd web && npm test -- -t "WasteAnalytics"
  ```


---

## FEAT-012: Animated Splash Opening & Authenticated Role Flow
* **Status:** In Progress
* **Scope:** Introduces Screen 1 (Animated Splash with Striply wordmark, scaling logo, optical RP beam, and tagline), Screen 2 (Login & Sign Up with email/password validation, show/hide password, and forgot password), and Screen 3 (Post-Auth Role Selection between Customer and Pharmacy/Manufacturer).
* **Verification Command:**
  ```bash
  npm --prefix web run build
  ```

---

## FEAT-013: Blister Foil Print Configuration & Industrial Proof Engine
* **Status:** In Progress
* **Scope:** Extends Foil Artwork Preview with a dedicated "Print Artwork" action, Print Settings modal (configurable foil width, repeat length, print scale, copies, orientation, eye-marks, and calibration toggles), Industrial Print Preview screen (physical mm dimensions, registration lines, regulatory batch header), and multiple export mechanisms (Browser Print `@media print`, Vector SVG, PDF download).
* **Verification Command:**
  ```bash
  npm --prefix web run build
  ```
