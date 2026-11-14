# Striply — System Architecture (ARCHITECTURE.md)

> **High-Level System Map:** Modules, services, communication layers, and data paths for the Striply platform.

---

## 1. Executive System Topology

```
+---------------------------------------------------------------------------------------+
|                                    USER EXPERIENCE LAYER                               |
+------------------------------------+--------------------------------------------------+
|      Customer Mobile Experience     |       Pharmacy & Manufacturer Web Workspace      |
|  - Real-time RP Lines CV Scanner   |  - Batch Registration & Excel-Style Table        |
|  - Pill Verification & Expiry State|  - 4-Color RP Lines Pattern Generator            |
|  - My Medicines Cabinet & Schedule |  - Blister Foil Repeat Artwork Preview (160mm)   |
|  - Daily In-App & WhatsApp Reminders| - Print Configuration & Industrial Proof Engine  |
|  - Health Profile & Proof Photo Log|  - FEFO Stock Priority & 71% Waste Analytics     |
+------------------------------------+--------------------------------------------------+
                                        |
                 RESTful APIs & Secure Webhooks (JSON / HTTPS)
                                        |
+---------------------------------------------------------------------------------------+
|                                  API GATEWAY & ENGINE                                 |
+---------------------------------------------------------------------------------------+
|  Node.js 20 / Express 5 + TypeScript Server (Port 5000)                               |
|  - Authentication & RBAC (Customer vs Verified Manufacturer)                          |
|  - /api/batches: Registration, DDL validation, FEFO queries                           |
|  - /api/patterns: 4-color deterministic RP Lines encoding & SVGs                      |
|  - /api/scans: Computer Vision edge verification, confidence scoring, telemetry       |
|  - /api/inventory: Real-time stock counts, shelf-life monitoring, quarantine          |
|  - /api/planner: Intake reminders, WhatsApp alarm dispatcher                          |
+---------------------------------------------------------------------------------------+
            |                                           |
+-------------------------------+       +-----------------------------------------------+
|  COMPUTER VISION & AI ENGINE  |       |               PERSISTENCE LAYER               |
+-------------------------------+       +-----------------------------------------------+
|  Python 3.11 / OpenCV (8000)  |       |  PostgreSQL 15 / Supabase                     |
|  - 4-Channel Optical Decoder  |       |  - Row Level Security (RLS) policies          |
|  - Perspective & Glare Filter |       |  - Idempotent Schema Migrations               |
|  - Calibration Anchor Matcher |       |  - Trigger-driven FEFO status synchronizer    |
|  - Expiry Demand Forecasting  |       |  - Proof photo storage vault                  |
+-------------------------------+       +-----------------------------------------------+
```

---

## 2. Core Modules & Responsibilities

### Module A: Client Presentation Layer (`web/src/app`)
- **Framework:** Next.js 14 App Router, React 18, Tailwind CSS, Lucide Icons.
- **Visual Identity:** Light glassmorphism (`rgba(255, 255, 255, 0.58)` + blur 16px + `#DCE7FF` borders), brand palette (`#1454E8` Primary Blue, `#10131B` Near-Black, `#F4F6FC` Off-White).
- **Navigation Flow:**
  `Animated Splash Screen` -> `Login / Sign Up` -> `Choose User Type` -> `Role-Specific App (Customer or Pharmacy)`.
- **Specialized Workflows:**
  - Live Camera RP Lines Viewfinder with real-time HUD overlays.
  - Interactive Blister Foil Repeat Layout Engine (160mm width, 240mm repeat, eye-marks).
  - Industrial Print Settings & Proof Sheet Renderer (PDF / SVG / `@media print`).

### Module B: Express 5 API Gateway (`backend/src`)
- **Controllers & Services:**
  - `batches`: Manages batch life cycle, ensures unique registered batch identities.
  - `patterns`: Generates reproducible vector and optical line data using RP Lines codebook.
  - `scans`: Handles scan submissions, anomaly detection, duplicate scan flags.
  - `inventory`: Computes real-time shelf life, FEFO sorting, and quarantine actions.
- **Middleware:** Token validation (`requireAuth.ts`), central error handling (`errorHandler.ts`).

### Module C: Computer Vision & AI Analytics (`src/decoder`, `ai_engine`)
- **Edge Vision:** Python OpenCV 6-stage decoder (color calibration anchor detection, perspective warp, adaptive thresholding, channel isolation, line continuity check).
- **Demand Forecasting:** AI model computing stock velocity and shelf-life prioritization to achieve up to 71% waste reduction.

### Module D: Database & RLS (`supabase/migrations`)
- **Tables:** `organizations`, `profiles`, `medicines`, `medicine_batches`, `rp_patterns`, `scans`, `customer_medicines`, `reminders`, `inventory_items`, `audit_logs`.
- **Database Functions:** `get_fefo_dispatch_queue(pharmacy_id)`, `trg_sync_inventory_expiry()`.

