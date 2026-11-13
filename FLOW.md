# Striply — System Execution Flows (FLOW.md)

> **Purpose:** Detailed end-to-end trace of execution paths across client components, edge computer vision algorithms, FEFO dispatch engine, Supabase triggers, and WhatsApp notification gateways.

---

## 1. Overall App Architecture Flow

```mermaid
flowchart LR
    A["Choose User\n(Consumer / Pharmacy)"] --> B["Scan & Identify\n(Striply Lines)"]
    B --> C["View Result &\nProof Photo"]
    C --> D["Get Reminders\n(WhatsApp / In-App)"]
    D --> E["Manage Inventory\n& FEFO"]
    E --> F["AI Prediction\n& Alerts"]
    F --> G["Batch Recall\n& Safety"]
    G --> H["Reduce Waste\n& Improve Safety"]
```

---

## 2. Consumer Execution Flow: Scan, Proof, Plan & Remind

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Consumer / Patient
    participant App as Striply Consumer App
    participant CV as OpenCV Edge Engine
    participant SQLite as Local SQLCipher DB
    participant Supa as Supabase Cloud & Storage
    participant WA as WhatsApp Gateway

    Patient->>App: Opens App & Selects "I'm a Consumer"
    App-->>Patient: Consumer Home ("Welcome, Hargun")
    Patient->>App: Taps "Scan Medicine"
    App->>CV: Stream 1080p Camera Frames
    CV->>CV: Glare Gate & Homography Warp
    CV->>CV: Extract 4 Color Bands + Modulo-11 Check
    CV->>App: Valid Pattern Decoded
    App->>App: Auto-captures high-res Proof Photo (WebP < 250KB)
    App->>SQLite: Query medicine_master & batch_registry
    SQLite-->>App: Match: Paracetamol 500mg, Exp: Dec 2026 (48 days)
    App-->>Patient: Displays Result Screen + Proof Photo Thumbnail
    
    Patient->>App: Taps "Set Reminders & Plan"
    App-->>Patient: Displays Medicine Planner (08:00 AM / 08:00 PM, Fever, 5 days)
    Patient->>App: Taps "Save Plan"
    App->>SQLite: Store in user_cabinet & medicine_plans
    App->>Supa: Upload Proof Photo to 'scan-proofs' + sync plan
    opt WhatsApp Alerts Enabled
        Supa->>WA: Enqueue WhatsApp Confirmation & Daily Alarms
        WA-->>Patient: Delivers WhatsApp Message with Dosage Schedule
    end
```

---

## 3. Pharmacy Execution Flow: Dashboard, FEFO, AI Expiry & Recalls

```mermaid
sequenceDiagram
    autonumber
    actor Chemist as Retail / Hospital Pharmacist
    participant Portal as Next.js Web Portal / Mobile App
    participant Supa as Supabase PostgreSQL Engine
    participant FEFO as FEFO Dispatch Engine
    participant AI as Python AI Microservice (LightGBM + PuLP)

    Chemist->>Portal: Logs in with Pharmacy Credentials
    Portal->>Supa: Fetch Org Metrics
    Supa-->>Portal: Total Stock (1,248), Near Expiry (36), Expired (8), High Risk (24)
    
    rect rgb(15, 30, 70)
        Note over Portal,FEFO: FEFO (First Expiry, First Out) Stock Prioritization
        Chemist->>Portal: Dispenses Prescription for Amoxicillin 250mg
        Portal->>FEFO: get_fefo_batch_for_dispensing(org_id, med_code, qty)
        FEFO-->>Portal: Recommends Batch BTH-2041 (Exp: 22 Nov 2026) FIRST
        Chemist->>Portal: Confirms Dispensing (Stock decremented)
    end

    rect rgb(20, 40, 90)
        Note over Portal,AI: AI Expiry Intelligence & Smart Redistribution
        Supa->>AI: Webhook Trigger: Send batches with days_to_expiry <= 90
        AI->>AI: Predict 60-day consumption velocity (V_hat)
        AI->>AI: Identify High Risk (24 batches likely to expire unsold)
        AI->>AI: PuLP Solver matches surplus to nearby clinic shortage
        AI->>Supa: INSERT into redistribution_requests
        Supa-->>Portal: Alert: "Reallocate 80 units of Paracetamol to nearby branch"
        Chemist->>Portal: Clicks "Approve Transfer" -> Manifest Generated
    end

    rect rgb(70, 20, 20)
        Note over Portal,Supa: Batch Recall Emergency Workflow
        Supa->>Supa: Manufacturer issues recall on Ciprofloxacin (CIP-2025)
        Supa-->>Portal: Critical Alert Card: "⚠️ Batch Recall CIP-2025: Isolate & Return"
        Chemist->>Portal: Clicks "Mark as Quarantined" -> Stock isolated from FEFO
    end
```

---

## 4. WhatsApp Notification Event Loop

```
[System Event Occurs]
  ├── A. Consumer sets new medicine plan -> 'PLAN_CONFIRMATION'
  ├── B. Daily reminder alarm fires (08:00 AM) -> 'MED_REMINDER'
  ├── C. Batch reaches <= 30 days to expiry -> 'EXPIRY_ALERT'
  └── D. Manufacturer issues batch recall -> 'RECALL_ALERT'
          |
          v
[INSERT into public.whatsapp_queue (status = 'PENDING')]
          |
          v
[Supabase Database Webhook fires to Notification Gateway]
          |
          v
[Twilio / Gupshup API delivers template message to recipient WhatsApp]
          |
          v
[UPDATE public.whatsapp_queue SET status = 'SENT', sent_at = NOW()]
```


---

## 4. Complete Application Opening & Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Striply User (Customer or Manufacturer)
    participant Splash as Animated Splash Screen
    participant Auth as Login / Sign Up Screen
    participant Role as Choose User Type
    participant App as Customer App / Manufacturer Workspace

    User->>Splash: Opens Striply Web/Mobile App
    Splash->>Splash: Fade-in & Scale-up Striply Wordmark
    Splash->>Splash: Render Optical RP Lines Beam Animation
    Splash->>Splash: Display Tagline "Smarter Medicine. Safer Tracking."
    Splash-->>Auth: Seamless Transition after Animation (or Skip)
    User->>Auth: Enters Credentials or Selects Quick Demo Fast-Track
    Auth->>Auth: Validates Email / Password Format
    Auth-->>Role: Successful Authentication Event
    User->>Role: Selects Persona ("I'm a Customer" or "I'm a Pharmacy / Manufacturer")
    alt Customer Selected
        Role-->>App: Launch Customer Mobile App (Home, My Medicines, Scan, Alerts, Profile)
    else Pharmacy / Manufacturer Selected
        Role-->>App: Launch Manufacturer Workspace (Overview, Inventory, Batch Registration, Foil Preview)
    end
```

---

## 5. Industrial Blister-Foil Printing & Proof Engine Flow

```mermaid
sequenceDiagram
    autonumber
    actor Chemist as Pharmaceutical Manufacturer
    participant Form as New Batch Entry Form
    participant Table as Editable Excel-like Table
    participant Gen as RP Lines Pattern Generator
    participant Foil as Foil Artwork Preview (160mm)
    participant Settings as Print Configuration Modal
    participant Preview as Industrial Print Preview
    participant Output as PDF / SVG / Browser Print Engine

    Chemist->>Form: Enters Drug Data (Name, Composition, Batch #, Mfg, Exp, Qty)
    Chemist->>Table: Clicks "Add Entry" (Validates and adds to table)
    Chemist->>Gen: Clicks "Generate Patterns"
    Gen->>Gen: Computes deterministic 4-color optical codes & batch hashes
    Gen-->>Foil: Displays Continuous Web Foil Preview with Eye-marks
    Chemist->>Settings: Clicks "Print Artwork"
    Settings-->>Chemist: Configures Width (160mm), Repeat (240mm), Scale, Orientation, Repeats
    Chemist->>Preview: Clicks "Proceed to Print Preview"
    Preview-->>Chemist: Displays High-Fidelity Proof with Dimensions, Registration Marks & Regulatory Disclaimer
    Chemist->>Output: Selects "Print" (@media print), "Download PDF", or "Export SVG"
    Output-->>Chemist: Produces dimensionally locked, print-ready pharmaceutical proof
```
