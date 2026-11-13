# Striply — Product Requirements Document (PRD)

> **Product Name:** Striply *(Every Strip. Every Dose. Less Waste.)*  
> **Document Version:** 5.0 (Custom Visual Encoding, 4-Colour System, Blister-Foil Repeat Layout & Glassmorphism)  
> **Status:** Approved / Active Baseline  
> **Visual Identity:** 70% White / 20% Blue Gradient & Glass / 10% Dark (`#FFFFFF`, `#1B5BFF`, `#10131B`, `#173B70`)  
> **Typography:** Manrope (Display & Wordmark Logo), Inter (UI, Body & Tables)  
> **Logo:** Typographic Wordmark ONLY — **Striply** (no icons, capsules, or crosses)

---

## 1. Executive Summary & Core Mission

**Striply** is an intelligent pharmaceutical visual traceability and waste reduction ecosystem. It solves the global problem of **"Cut-Blister Amnesia"**—where cutting blister packs separates medicine pockets from their printed manufacturer text (name, batch number, expiry date).

Instead of relying on printed text or OCR, Striply introduces a **custom, machine-readable 4-colour line-based visual identification system**. Every registered medicine batch receives a unique **Striply Batch ID** (`ST-000001`, `ST-000002`...) that is deterministically encoded into a unique line pattern printed directly onto pharmaceutical blister lidding foil. When scanned by a customer or pharmacist using computer vision, the pattern is recognized, decoded, and matched to the central database in real time.

---

## 2. Custom 4-Colour Line-Based Identification System

### 2.1 Spectral Channel Mapping

| Colour | Hex Code | Information Represented |
| :--- | :--- | :--- |
| **Red** | `#EF4444` | **Medicine Identity** (Medicine Name / Medicine ID) |
| **Blue** | `#2563EB` | **Batch Identity** (Manufacturer Batch Number / Striply Batch ID) |
| **Green** | `#10B981` | **Manufacturing Date** (Year & Month token) |
| **Yellow** | `#F59E0B` | **Expiry Date** (Year & Month token) |

> [!IMPORTANT]
> **Composition is NOT encoded in a color channel.** Active ingredients and composition are retrieved securely from the central medicine database using the decoded Medicine ID.

### 2.2 Batch-Level Identification Rule
Identification is strictly **batch-level**, not merely medicine-level:
* Paracetamol Batch 001 receives `ST-000001` and Pattern A.
* Paracetamol Batch 002 receives `ST-000002` and Pattern B.
* The system never reuses an active batch ID or visual pattern for a different batch.

### 2.3 Structural Features & Optical Robustness
Identification does not rely solely on color. The pattern utilizes structural geometric features:
* **Dual Alignment Markers:** High-contrast white and dark-blue outer bars providing orientation, spatial bounds, and tilt angles.
* **Line Position, Width & Spacing:** Modulated stripe widths and pulse intervals.
* **Rotation Invariance:** Top and bottom registration notches allow 180° orientation detection.
* **Error Correction:** Modulo-11 parity checksum embedded in the Blue channel ensures rejection of unreadable, damaged, or counterfeit codes.

---

## 3. Visual Identity & Design System

### 3.1 Strict 5-Colour Brand Palette
* **White (`#FFFFFF`) — 70% Surface Dominance:** Primary content surfaces, cards, tables, forms, and main backgrounds.
* **Blue Gradients & Glass (`#1B5BFF`, electric cyan, soft frosted glass) — 20%:** Ambient lighting, primary action buttons, layered translucent panels, and focus brackets.
* **Dark Elements (`#10131B`, `#173B70`) — 10%:** High-contrast editorial typography, secondary headings, and registration markers.

### 3.2 Typography
* **Primary Display Font:** **Manrope** (ExtraBold 800, Bold 700) for headlines, section titles, and the wordmark logo.
* **Secondary Interface Font:** **Inter** (Regular 400, Medium 500, SemiBold 600) for reading body copy, tables, forms, and data labels.

### 3.3 Wordmark-Only Logo
The logo consists **ONLY of the typographic brand name: Striply** in Manrope font. No decorative symbols, capsules, or medical crosses.

---

## 4. Pharmacy Module Workflows

After completing pharmacy onboarding, the pharmacist is presented with two independent, non-sequential workflows:

### 4.1 Option A: Manage Existing Stock
For pharmacies receiving or auditing already registered Striply batches:
1. Scan existing Striply line pattern.
2. Decode Striply Batch ID and retrieve verified database record.
3. Review medicine name, manufacturer batch number, manufacturing date, and expiry date.
4. Enter newly received stock quantity and update inventory.
5. **Invariant:** Updating received units strictly preserves the original Striply Batch ID and pattern—never generates a new ID.

### 4.2 Option B: Generate New Patterns
For pharmacies registering new medicine batches:
* **Section A (Batch Form):** Medicine Name, Composition, Manufacturer, Manufacturer Batch Number, Manufacturing Date, Expiry Date, Available Quantity, Unit. User clicks **"Add Entry"**.
* **Section B (Editable Spreadsheet Table):** Displays all queued batches in an Excel-like table (`Entry #`, `Medicine`, `Batch Number`, `MFG`, `EXP`, `Quantity`, `Actions: Edit / Delete`). Multiple batches can be queued in a single session.
* **Section C (Pattern Generation):** Pharmacist clicks **"Generate Patterns"**. Backend validates rows, assigns unique Striply Batch IDs (`ST-xxxxxx`), encodes 4-colour patterns, and enables foil artwork preview.
* **Section D (Pharmaceutical Blister-Foil Artwork Preview):**
  * Displays continuous, repeat-based pharmaceutical blister lidding foil artwork (matching industrial gravure/flexo specifications).
  * **No sticker layouts. No A4 label sheets.**
  * Configurable dimensions: Foil width (160mm), Repeat length (240mm), Pattern dimensions (45x15mm), spacing, eye marks.
  * Preview controls: Zoom in/out, fit-to-view, inspect pattern, download print-ready SVG/PNG, return to batch editing.

### 4.3 FEFO Inventory, AI Expiry Intelligence & 71% Waste Reduction
* **FEFO High-Speed Queue:** Dispense First priority ordering by earliest expiry date.
* **AI/Rule-Based Expiry Prediction:** High Risk (<=30 days), Medium Risk (60-90 days), and Safe categories.
* **Smart Stock Redistribution:** PuLP bipartite optimization suggesting inter-branch stock transfers to prevent expiry write-offs.
* **71% Waste Reduction Impact:** 124 units before vs 36 units with Striply, saving ₹8,420 in monthly write-offs.
* **Batch Recall Alerts:** Instant quarantine workflow for defective manufacturer batches (e.g. Ciprofloxacin CIP-2025).

---

## 5. Customer Module (App-Like Experience)

Designed as an intuitive mobile-friendly medicine companion—not an analytics dashboard:
* **Customer Home Screen:** Greeting, WhatsApp alerts toggle switch, and 4 primary action cards.
* **Medicine Scanner:** Camera viewfinder with corner brackets, live specular glare check, simulated laser scanning, and tamper-evident SHA-256 capture.
* **Medicine Information Screen:** Structured table showing Medicine Name, Composition (retrieved from DB), Strength, Striply Batch ID, Mfg Date, Expiry Date, Prescribed Dosage, and Duration.
* **My Medicines Box:** Segmented into Active, Completed, and Discontinued medications.
* **Personal Medicine Planner:** Intake schedules (08:00 AM Morning & 08:00 PM Evening alarms), doctor's guidance, condition mapping.
* **Health Profile & Rx Vault:** Personal blood group, active conditions, drug allergy alerts (⚠️ Penicillin), and doctor prescription file access.
