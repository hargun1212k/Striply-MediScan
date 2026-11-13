# Striply — Master Project Blueprint & Prompt Sheet (BLUEPRINT.md)

> **Project:** Striply *(Every Strip. Every Dose. Less Waste.)*  
> **Architecture:** Edge Mobile CV (CameraX / OpenCV C++) + Supabase (PostgreSQL 16 + RLS + Triggers) + Next.js 14 Web Portal + Python AI Microservice  
> **Visual Reference:** Deep Cobalt Frosted Glassmorphism (`#0A1128` / `#0B1E48`, `backdrop-filter: blur(16px)`, `rgba(255, 255, 255, 0.08)`)  
> **Document Version:** 4.0 (11 Core Features & Frosted Glass Design System)  

---

## 1. ⚠️ Version Safety & Healthcare Invariant Rules (Read First)

### Version Safety Rule
* **Never copy hardcoded version numbers into `package.json` or `requirements.txt`.**
* **For Humans & AI Assistants:** Always perform a web search or run `npm show <pkg> version` / `pip index versions <pkg>` before writing dependencies. Use active LTS Node.js and Python 3.11+. Fix all high/critical vulnerabilities via `npm audit` / `pip-audit`.

### Healthcare & Safety Invariants
1. **Zero Guessing Invariant:** An uncertain, blurry, or glaring scan must output `UNABLE TO VERIFY` or `INVALID CODE`. Never return a guessed or probabilistic drug identity.
2. **Offline Scanning Invariant:** Blister pocket scanning and identification must run 100% locally on-device in $< 350\text{ms}$ using SQLite + OpenCV for both Customer and Chemist modes.
3. **Proof Photo Tamper-Evidence:** Proof photos must be hashed (SHA-256) at capture and stored in an immutable storage bucket.
4. **FEFO Priority Invariant:** The pharmacy inventory engine must always prioritize the batch with the earliest expiration date first for dispensing.
5. **Zero Patient Health Information (PHI) on Packaging:** Blister packaging encodes only Drug Master Data (Molecule ID, Batch, Expiry).

---

## 2. Monorepo Repository Structure

```
Striply/
├── PRD.md                             # Product Requirements (11 Features, Dual Flows & Glassmorphic Specs)
├── TRD.md                             # Technical Requirements (Supabase DDL, RLS, Triggers & FEFO Engine)
├── BLUEPRINT.md                       # Master Blueprint & Prompt Sheet (This File)
├── FLOW.md                            # End-to-End System & Event Flows
├── FEATURE.md                         # Feature Lifecycle Tracker (FEAT-001 to FEAT-012)
├── BUG.md                             # Bug Investigation Traces (BUG-001 to BUG-003)
├── GUIDELINES.md                      # Code Commenting Philosophy ("Why" over "What")
├── HANDOVER.md                        # Living Session Continuity Record
├── README.md                          # Master Project Index & Quick-Start Guide
│
├── mobile/                            # Dual-Persona Edge Smartphone Scanner App
│   ├── src/
│   │   ├── camera/                    # FrameProcessor (1080p @ 30fps), ViewfinderGuide UI
│   │   ├── cv/                        # GlareDetector, HomographyWarper, Calibrator, Demodulator
│   │   ├── proof/                     # ProofPhotoCompressor (WebP < 250KB) & Hasher
│   │   ├── db/                        # Local SQLCipher SQLite: master_catalog, user_cabinet, store_ledger
│   │   ├── components/glass/          # GlassPanel, GlassPill, GlassCard, GlassModal
│   │   └── screens/
│   │       ├── SplashScreen.tsx       # Splash with "Get Started ->"
│   │       ├── RoleSelectScreen.tsx   # "Who are you?" (Consumer vs Pharmacy)
│   │       ├── ConsumerHomeScreen.tsx # Tiles: Scan, My Meds, Reminders, Health Profile, WhatsApp toggle
│   │       ├── ScannerScreen.tsx      # Viewfinder with real-time glare tooltip
│   │       ├── ResultProofScreen.tsx  # Valid/Expired Badge + Proof Photo Thumbnail
│   │       ├── MedicinePlannerScreen.tsx # 08:00 AM / 08:00 PM Schedule, Condition, Duration
│   │       ├── HealthProfileScreen.tsx   # Chronic conditions & digital prescription vault
│   │       ├── PharmacyDashboardScreen.tsx # Total Stock, Near Expiry, Expired, High-Risk cards
│   │       ├── FEFOQueueScreen.tsx       # First Expiry, First Out priority dispatch queue
│   │       ├── BatchManagementScreen.tsx # Search, filter, add/update batch
│   │       ├── ExpiryIntelligenceScreen.tsx # AI High/Medium risk tabs & reallocation prompt
│   │       ├── WasteAnalyticsScreen.tsx  # Before vs With Striply (71% less waste) & Donut chart
│   │       └── BatchRecallScreen.tsx     # Active recall isolation & quarantine
│   ├── package.json
│   └── tsconfig.json
│
├── web/                               # Next.js 14 Glassmorphic Pharmacy Web Portal
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/page.tsx  # Glassmorphic Pharmacy Login
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx           # Expiry Radar & FEFO Quick Action
│   │   │   │   ├── inventory/page.tsx # Full Batch Ledger & Filter Pills
│   │   │   │   ├── intelligence/page.tsx # AI Demand Forecast & Inter-Store Transfers
│   │   │   │   ├── analytics/page.tsx # 30/90 Day Waste Reduction Reports
│   │   │   │   └── recalls/page.tsx   # Active Recall Quarantine Manager
│   │   ├── components/glass/          # Tailwind Glass Tokens (backdrop-blur-glass)
│   │   └── lib/supabase/              # Client, Server Actions & Realtime subscriptions
│   ├── package.json
│   └── tailwind.config.js
│
├── ai_engine/                         # Python AI Microservice (Predictive Waste & Solver)
│   ├── src/
│   │   ├── forecasting/               # LightGBM sales velocity model
│   │   ├── optimizer/                 # PuLP surplus-to-deficit bipartite matching solver
│   │   └── main.py                    # FastAPI webhook endpoints
│   ├── requirements.txt
│   └── .env.example
│
└── supabase/                          # Supabase Migrations & Edge Functions
    ├── migrations/                    # DDL, RLS, & Triggers from TRD.md
    └── functions/                     # whatsapp-webhook/ (Twilio/Gupshup dispatch)
```

---

## 3. AI Coding Assistant Master Prompts (11 Core Capabilities)

### Master Prompt 1: Glassmorphic Edge Mobile Scanner & Proof Photo Capture
```
Build the Camera Scanner and Proof Photo module for Striply in React Native / Android.

Visual Style: Deep cobalt frosted glassmorphism (Canvas: #0B1E48, Glass panels: rgba(255,255,255,0.08), backdrop-filter: blur(16px), 1px solid rgba(255,255,255,0.18), Inter font).

Requirements:
1. CameraX preview running at 1080p @ 30fps with continuous autofocus.
2. Glare Gate: Convert ROI to grayscale. Mask specular pixels (I >= 245). If glare > 8% of ROI, show glass toast: "Tilt phone slightly to cut foil glare".
3. Laplacian variance blur gate (Var < 120 -> "Hold steady / Focus").
4. Contour Homography: Warp candidate quad (AR 2.2-3.8) to canonical 360x120px buffer.
5. Von Kries Chromatic Adaptation using Left White fiducial. Classify 4 bands via CIEDE2000.
6. Proof Photo Capture: At the instant of valid parity, capture full camera frame, compress to WebP (<250KB), calculate SHA-256 hash, and store locally in SQLite scan_proofs.
7. Result Screen: Display frosted glass card with Medicine Identified badge, Brand, Strength, Batch, Expiry, Days to Expiry, embedded Proof Photo thumbnail with retake button, and "Save to My Medicines" button.
```

### Master Prompt 2: Consumer Medicine Planner & WhatsApp Alarms
```
Build the Personal Medicine Planner and Daily Reminder module for Striply.

Requirements:
1. Planner UI (Frosted glass card):
   - Medicine Header: Drug name & strength (e.g. Paracetamol 500mg - 1 tablet Twice a day).
   - Reminder Schedule: 08:00 AM (Morning) and 08:00 PM (Evening) with custom toggle switches.
   - Condition Tag: Free-text input with chips (e.g. "Fever, body pain").
   - Duration: Days counter (e.g. "5 days").
2. Local Alarms: Schedule OS notification alarms for each active reminder time.
3. WhatsApp Integration: If user toggled 'whatsapp_enabled' in profile, enqueue record into Supabase 'whatsapp_queue' to dispatch daily WhatsApp messages via Twilio/Gupshup API.
```

### Master Prompt 3: Pharmacy FEFO Queue & Batch Inventory (Supabase + Next.js 14)
```
Build the Pharmacy Inventory Management and FEFO Dispatch View for Striply in Next.js 14.

Requirements:
1. Visual Theme: Deep cobalt frosted glass dashboard (#0A1128 canvas, translucent glass cards with backdrop-blur-16px, glowing blue accents).
2. Metric Cards: Total Stock (1,248), Near Expiry (36), Expired (8), High-Risk (24).
3. FEFO Dispatch Section: Query inventory ordered strictly by 'days_to_expiry ASC'. Highlight the earliest expiring batch that pharmacists must prioritize for dispensing.
4. Filter Pills: Glass pill buttons for 'All', 'Near Expiry', 'Expired'.
5. RLS Security: Guarantee pharmacists only query records matching their store's 'org_id'.
```

### Master Prompt 4: AI Expiry Intelligence, Redistribution & Recalls
```
Build the AI Expiry Intelligence and Batch Recall Management module for Striply.

Requirements:
1. Expiry Risk View: Categorize inventory into High Risk (24 batches) and Medium Risk (36 batches) based on LightGBM velocity predictions.
2. Suggested Action Card: Frosted glass panel displaying: "Reallocate 80 units of Paracetamol 500mg to nearby Metro Clinic (low stock, 3.4 km away)" with an "Approve Transfer" button.
3. Batch Recall Manager: Active recall warning card: "⚠️ Batch Recall CIP-2025: Isolate & Return". Button to mark stock as quarantined, instantly removing it from the FEFO queue.
```
