# Striply — Technical Requirements Document (TRD)

> **Document Version:** 5.0  
> **Architecture:** Next.js 14 App Router + Express 5 TypeScript API + Supabase PostgreSQL 16 + OpenCV Core  
> **Status:** Active Baseline / Production Ready  
> **Color Model:** 4-Colour Spectral Micro-Encoding (Red=Med, Blue=Batch, Green=Mfg, Yellow=Exp)

---

## 1. System Architecture & Component Topology

```
                  ┌──────────────────────────────────────────────┐
                  │       Client Layer (Next.js 14 Portal)       │
                  │  - Customer App (Scanner, Planner, Cabinet) │
                  │  - Pharmacy (Existing Stock, Foil Artwork)  │
                  └───────────────────────┬──────────────────────┘
                                          │ HTTP / REST & WebSockets
                                          ▼
                  ┌──────────────────────────────────────────────┐
                  │       Central API Gateway (Express 5 TS)     │
                  │  - /api/v1/batches (ST-xxxxxx Generator)     │
                  │  - /api/v1/patterns (4-Color Vector Engine)  │
                  │  - /api/v1/scans (CV Decoding & Lookup)      │
                  │  - /api/v1/inventory (FEFO Dispatch Queue)   │
                  └───────────────┬──────────────────────┬───────┘
                                  │                      │
                   PostgreSQL DDL │                      │ Computer Vision
                                  ▼                      ▼
                  ┌───────────────────────┐      ┌────────────────────────┐
                  │ Supabase Cloud Core   │      │ OpenCV / Python CV Core│
                  │ - 14 Relational Tables│      │ - Glare Filter (<8%)   │
                  │ - RLS Security & FEFO │      │ - Alignment Rectifier  │
                  │ - Tamper-Proof Vault  │      │ - 4-Band Demodulator   │
                  └───────────────────────┘      └────────────────────────┘
```

---

## 2. 4-Colour Visual Encoding Specification

### 2.1 Spatial Geometry (Canonical 360 x 120 px Micro-Block)

* **Left Outer Alignment Marker:** `x: [8, 28]`, White (`#FFFFFF`), Height: 100px.
* **Left Inner Alignment Marker:** `x: [32, 40]`, Dark Blue (`#173B70`), Height: 100px.
* **Red Channel (Medicine Identity):** `x: [50, 110]`, `#EF4444`. Stripe count = `2 + (MedID % 4)`.
* **Blue Channel (Batch Identity):** `x: [118, 193]`, `#2563EB`. 8-bit binary pulse train representing the Striply Batch ID sequence + Modulo-11 parity checksum.
* **Green Channel (Manufacturing Date):** `x: [200, 255]`, `#10B981`. Line count = `3 + (MfgYear % 4)`.
* **Yellow Channel (Expiry Date):** `x: [262, 312]`, `#F59E0B`. Line count = `3 + (ExpYear % 3)`.
* **Right Inner Alignment Marker:** `x: [320, 328]`, Dark Blue (`#173B70`), Height: 100px.
* **Right Outer Alignment Marker:** `x: [332, 352]`, White (`#FFFFFF`), Height: 100px.
* **Rotation Invariance:** Dual circular registration notches placed at `(180, 6)` and `(180, 114)`.

### 2.2 Error Detection & Modulo-11 Parity Checksum

$$\text{Checksum} = \left( \sum_{i=1}^{n} d_i \cdot w_i \right) \pmod{11}$$

Where weights $w = [8, 7, 6, 5, 4, 3]$ are applied across the integer representation of the batch sequence. Any pattern failing parity validation is immediately flagged as `INVALID_CODE` and rejected.

---

## 3. Pharmaceutical Blister-Foil Repeat Layout Engine

The system generates continuous repeating foil artwork configured to industrial cylinder parameters:
* **Foil Substrate Width:** Configurable (Standard 160 mm).
* **Cylinder Repeat Length:** Configurable (Standard 240 mm).
* **Micro-Pattern Dimensions:** 45 mm x 15 mm.
* **Registration Eye Marks:** 8 mm dashed red slitter margin guides and optical crosshairs at top and bottom margins for gravure/flexo packaging presses.
* **Batch Mapping:** 1:1 association preserved across repeating grid cells.

---

## 4. Complete PostgreSQL DDL Schemas (Supabase)

```sql
-- Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Pharmacies & Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Medicines
CREATE TABLE public.medicines (
    medicine_code INT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL, -- Active composition
    dosage_form VARCHAR(50) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    usage_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Unique Striply Batches (Batch-Level Identification)
CREATE TABLE public.medicine_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    striply_batch_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. ST-000001
    medicine_id INT NOT NULL REFERENCES public.medicines(medicine_code) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    manufacturer_batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    unit VARCHAR(50) DEFAULT 'Strips',
    batch_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Visual Pattern Registry
CREATE TABLE public.visual_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    striply_batch_id VARCHAR(50) NOT NULL REFERENCES public.medicine_batches(striply_batch_id) ON DELETE CASCADE,
    encoded_payload JSONB NOT NULL,
    pattern_version VARCHAR(20) DEFAULT '4.1',
    pattern_svg TEXT NOT NULL,
    print_status VARCHAR(50) DEFAULT 'ready',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Scan Audit Log
CREATE TABLE public.scan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    striply_batch_id VARCHAR(50) NOT NULL,
    scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
    recognition_status VARCHAR(50) NOT NULL
);

-- 6. Pharmacy Inventory & FEFO Queue
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    days_to_expiry INT DEFAULT 0,
    last_scanned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, medicine_code, batch_code)
);

CREATE INDEX idx_fefo_expiry_queue ON public.inventory_items(org_id, days_to_expiry ASC);
```

---

## 5. API Gateway Endpoint Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/batches/register` | Registers single batch, generates unique `ST-xxxxxx` ID. |
| `POST` | `/api/v1/batches/register-bulk` | Bulk registers multiple batches in one operation. |
| `GET` | `/api/v1/batches/:striplyBatchId` | Retrieves batch details, composition, and current stock. |
| `PATCH` | `/api/v1/batches/:striplyBatchId/stock` | Updates received quantity preserving ID & pattern. |
| `GET` | `/api/v1/patterns/:striplyBatchId` | Returns deterministic 4-colour pattern in SVG/JSON format. |
| `POST` | `/api/v1/patterns/foil-artwork` | Generates continuous pharmaceutical blister-foil repeating layout. |
| `POST` | `/api/v1/scans/decode` | Decodes pattern, fetches composition from DB, and returns audit record. |
| `GET` | `/api/v1/inventory` | Returns store inventory sorted by FEFO dispatch priority. |
| `GET` | `/health` | Immediate health ping: `{"status": "ok", "service": "striply-backend"}`. |
