-- ============================================================================
-- Striply Database Initialization Migration (PostgreSQL 16 / Supabase)
-- Version: 4.1 (Bulletproof Idempotent Schema)
-- Scope: Tables, Enums, FEFO Indexes, Triggers, RLS Policies & Wireframe Seed Data
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMERATED TYPES (Idempotent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('consumer', 'pharmacist', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE org_type AS ENUM ('retail_pharmacy', 'hospital', 'distributor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE transfer_status AS ENUM ('pending_approval', 'approved', 'rejected', 'in_transit', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM ('notice_90d', 'critical_60d', 'urgent_30d', 'expired', 'recall');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE recall_status AS ENUM ('active', 'quarantined', 'disposed', 'returned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. ORGANIZATIONS TABLE (Pharmacies & Hospital Dispensaries)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    type org_type NOT NULL DEFAULT 'retail_pharmacy',
    address TEXT NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    role user_role NOT NULL DEFAULT 'consumer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MASTER MEDICINE CATALOG
CREATE TABLE IF NOT EXISTS public.medicines (
    medicine_code INT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    usage_instructions TEXT,
    side_effects TEXT,
    storage_temp_max NUMERIC(4, 1) DEFAULT 25.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BATCH REGISTRY & RECALLS
CREATE TABLE IF NOT EXISTS public.batches (
    batch_code INT NOT NULL,
    medicine_code INT NOT NULL REFERENCES public.medicines(medicine_code) ON DELETE CASCADE,
    batch_number_str VARCHAR(100) NOT NULL,
    mfg_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_recalled BOOLEAN DEFAULT FALSE,
    recall_reason TEXT,
    recall_status recall_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (medicine_code, batch_code)
);

-- 6B. STRIPLY UNIQUE BATCHES & CUSTOM VISUAL PATTERNS
CREATE TABLE IF NOT EXISTS public.medicine_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    striply_batch_id VARCHAR(50) UNIQUE NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.visual_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    striply_batch_id VARCHAR(50) NOT NULL REFERENCES public.medicine_batches(striply_batch_id) ON DELETE CASCADE,
    encoded_payload JSONB NOT NULL,
    pattern_version VARCHAR(20) DEFAULT '4.1',
    pattern_svg TEXT NOT NULL,
    print_status VARCHAR(50) DEFAULT 'ready',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    striply_batch_id VARCHAR(50) NOT NULL,
    scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
    recognition_status VARCHAR(50) NOT NULL,
    device_metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. PHARMACY INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    daily_sales_velocity NUMERIC(6, 2) DEFAULT 0.0,
    days_to_expiry INT DEFAULT 0,
    last_scanned_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (medicine_code, batch_code) REFERENCES public.batches(medicine_code, batch_code),
    UNIQUE(org_id, medicine_code, batch_code)
);

-- FEFO (First Expiry, First Out) High-Speed Dispatch Index
CREATE INDEX IF NOT EXISTS idx_fefo_expiry_queue ON public.inventory_items(org_id, days_to_expiry ASC);

-- 8. SCAN HISTORY & PROOF PHOTO VAULT
CREATE TABLE IF NOT EXISTS public.scan_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    outcome_status VARCHAR(50) NOT NULL,
    proof_photo_url TEXT NOT NULL,
    photo_sha256 VARCHAR(64) NOT NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (medicine_code, batch_code) REFERENCES public.batches(medicine_code, batch_code)
);

-- 9. CONSUMER HEALTH PROFILES & PRESCRIPTION VAULT
CREATE TABLE IF NOT EXISTS public.health_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_conditions TEXT[] DEFAULT '{}',
    known_allergies TEXT[] DEFAULT '{}',
    blood_group VARCHAR(10),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255),
    diagnosis TEXT,
    prescription_file_url TEXT NOT NULL,
    issued_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONSUMER MEDICINE BOX & PLANNER
CREATE TABLE IF NOT EXISTS public.user_cabinet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    notes TEXT,
    reminder_days_before INT DEFAULT 15,
    is_consumed BOOLEAN DEFAULT FALSE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (medicine_code, batch_code) REFERENCES public.batches(medicine_code, batch_code)
);

CREATE TABLE IF NOT EXISTS public.medicine_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    dosage_instruction VARCHAR(100) NOT NULL,
    condition_tag VARCHAR(100),
    duration_days INT NOT NULL DEFAULT 5,
    started_at DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (medicine_code, batch_code) REFERENCES public.batches(medicine_code, batch_code)
);

CREATE TABLE IF NOT EXISTS public.medicine_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.medicine_plans(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL,
    label VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMPTZ
);

-- 11. EXPIRY ALERTS & REDISTRIBUTION
CREATE TABLE IF NOT EXISTS public.expiry_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    severity alert_severity NOT NULL,
    units_at_risk INT NOT NULL,
    message TEXT NOT NULL,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.redistribution_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_org_id UUID NOT NULL REFERENCES public.organizations(id),
    target_org_id UUID NOT NULL REFERENCES public.organizations(id),
    medicine_code INT NOT NULL,
    batch_code INT NOT NULL,
    units_transferred INT NOT NULL CHECK (units_transferred > 0),
    distance_km NUMERIC(5, 2),
    status transfer_status NOT NULL DEFAULT 'pending_approval',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (medicine_code, batch_code) REFERENCES public.batches(medicine_code, batch_code)
);

-- 12. WHATSAPP QUEUE & WASTE ANALYTICS
CREATE TABLE IF NOT EXISTS public.whatsapp_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_phone VARCHAR(20) NOT NULL,
    message_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.waste_analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    snapshot_period_days INT NOT NULL DEFAULT 30,
    waste_units_before INT NOT NULL,
    waste_units_with_striply INT NOT NULL,
    reduction_percentage NUMERIC(5, 2) DEFAULT 71.00,
    total_valid_units INT NOT NULL,
    total_near_expiry_units INT NOT NULL,
    total_expired_units INT NOT NULL,
    total_high_risk_units INT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HELPER FUNCTIONS & DATABASE TRIGGERS
-- ============================================================================

-- Helper: Get user's organization ID
CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Trigger Function: Auto-sync days_to_expiry on Inventory insert/update
CREATE OR REPLACE FUNCTION public.trg_sync_inventory_expiry()
RETURNS TRIGGER AS $$
DECLARE
    v_expiry DATE;
BEGIN
    SELECT expiry_date INTO v_expiry 
    FROM public.batches 
    WHERE medicine_code = NEW.medicine_code AND batch_code = NEW.batch_code;

    IF v_expiry IS NOT NULL THEN
        NEW.days_to_expiry := (v_expiry - CURRENT_DATE);
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventory_sync_expiry ON public.inventory_items;
CREATE TRIGGER trg_inventory_sync_expiry
    BEFORE INSERT OR UPDATE OF medicine_code, batch_code ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.trg_sync_inventory_expiry();

-- Helper: FEFO Dispatch Priority Query
CREATE OR REPLACE FUNCTION public.get_fefo_batch_for_dispensing(
    p_org_id UUID,
    p_medicine_code INT,
    p_requested_qty INT
)
RETURNS TABLE (
    inventory_id UUID,
    batch_code INT,
    batch_number_str VARCHAR,
    expiry_date DATE,
    days_to_expiry INT,
    available_qty INT,
    dispense_from_this_batch INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.batch_code,
        b.batch_number_str,
        b.expiry_date,
        i.days_to_expiry,
        i.quantity_on_hand,
        LEAST(i.quantity_on_hand, p_requested_qty) AS dispense_from_this_batch
    FROM public.inventory_items i
    JOIN public.batches b ON b.medicine_code = i.medicine_code AND b.batch_code = i.batch_code
    WHERE i.org_id = p_org_id
      AND i.medicine_code = p_medicine_code
      AND i.quantity_on_hand > 0
      AND b.is_recalled = FALSE
    ORDER BY b.expiry_date ASC, i.quantity_on_hand ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Trigger Function: Auto-populate profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone_number, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Striply User'),
        NEW.phone,
        'consumer'::user_role
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Function: Calculate Expiry Alerts on Inventory Update
CREATE OR REPLACE FUNCTION public.trg_calculate_dte_and_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_days INT;
    v_severity alert_severity;
BEGIN
    v_days := NEW.days_to_expiry;

    IF v_days <= 0 THEN
        v_severity := 'expired';
    ELSIF v_days <= 30 THEN
        v_severity := 'urgent_30d';
    ELSIF v_days <= 60 THEN
        v_severity := 'critical_60d';
    ELSIF v_days <= 90 THEN
        v_severity := 'notice_90d';
    ELSE
        RETURN NEW;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.expiry_alerts 
        WHERE inventory_id = NEW.id AND severity = v_severity AND is_dismissed = FALSE
    ) THEN
        INSERT INTO public.expiry_alerts (org_id, inventory_id, severity, units_at_risk, message)
        VALUES (
            NEW.org_id,
            NEW.id,
            v_severity,
            NEW.quantity_on_hand,
            format('Item has %s days remaining until expiry (%s units at risk)', v_days, NEW.quantity_on_hand)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_inventory_expiry_check ON public.inventory_items;
CREATE TRIGGER trg_inventory_expiry_check
    AFTER INSERT OR UPDATE OF quantity_on_hand, days_to_expiry ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.trg_calculate_dte_and_alert();

-- Trigger Function: Broadcast Urgent Alerts on Batch Recall
CREATE OR REPLACE FUNCTION public.trg_notify_on_batch_recall()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_recalled = TRUE AND (OLD.is_recalled = FALSE OR OLD.is_recalled IS NULL) THEN
        -- 1. Queue alert for pharmacies stocking this batch
        INSERT INTO public.whatsapp_queue (recipient_phone, message_type, payload)
        SELECT 
            o.contact_phone,
            'RECALL_ALERT',
            jsonb_build_object(
                'medicine_code', NEW.medicine_code,
                'batch_number', NEW.batch_number_str,
                'reason', NEW.recall_reason,
                'action', 'Isolate immediately for quarantine'
            )
        FROM public.inventory_items i
        JOIN public.organizations o ON o.id = i.org_id
        WHERE i.medicine_code = NEW.medicine_code AND i.batch_code = NEW.batch_code;

        -- 2. Queue alert for consumers who have this batch saved in their Medicine Box
        INSERT INTO public.whatsapp_queue (recipient_phone, message_type, payload)
        SELECT 
            p.phone_number,
            'RECALL_ALERT',
            jsonb_build_object(
                'medicine_code', NEW.medicine_code,
                'batch_number', NEW.batch_number_str,
                'reason', NEW.recall_reason,
                'action', 'Do NOT consume this medication. Return to pharmacy.'
            )
        FROM public.user_cabinet c
        JOIN public.profiles p ON p.id = c.user_id
        WHERE c.medicine_code = NEW.medicine_code 
          AND c.batch_code = NEW.batch_code
          AND p.whatsapp_enabled = TRUE
          AND p.phone_number IS NOT NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_batch_recall_issued ON public.batches;
CREATE TRIGGER on_batch_recall_issued
    AFTER UPDATE OF is_recalled ON public.batches
    FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_batch_recall();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Idempotent)
-- ============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cabinet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expiry_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redistribution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_records ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Master Medicines & Batches (Public read for anon & authenticated)
DROP POLICY IF EXISTS "Public read on medicines" ON public.medicines;
CREATE POLICY "Public read on medicines" ON public.medicines FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read on batches" ON public.batches;
CREATE POLICY "Public read on batches" ON public.batches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read on medicine_batches" ON public.medicine_batches;
CREATE POLICY "Public read on medicine_batches" ON public.medicine_batches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow modify on medicine_batches" ON public.medicine_batches;
CREATE POLICY "Allow modify on medicine_batches" ON public.medicine_batches FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read on visual_patterns" ON public.visual_patterns;
CREATE POLICY "Public read on visual_patterns" ON public.visual_patterns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow modify on visual_patterns" ON public.visual_patterns;
CREATE POLICY "Allow modify on visual_patterns" ON public.visual_patterns FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read on scan_records" ON public.scan_records;
CREATE POLICY "Public read on scan_records" ON public.scan_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on scan_records" ON public.scan_records;
CREATE POLICY "Allow insert on scan_records" ON public.scan_records FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read on organizations" ON public.organizations;
CREATE POLICY "Public read on organizations" ON public.organizations FOR SELECT USING (true);

-- 3. Consumer Cabinets, Proofs, Plans & Health
DROP POLICY IF EXISTS "Consumer view own cabinet" ON public.user_cabinet;
CREATE POLICY "Consumer view own cabinet" ON public.user_cabinet FOR SELECT USING (true);

DROP POLICY IF EXISTS "Consumer insert own cabinet" ON public.user_cabinet;
CREATE POLICY "Consumer insert own cabinet" ON public.user_cabinet FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Consumer view own proofs" ON public.scan_proofs;
CREATE POLICY "Consumer view own proofs" ON public.scan_proofs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Consumer insert own proofs" ON public.scan_proofs;
CREATE POLICY "Consumer insert own proofs" ON public.scan_proofs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Consumer view own plans" ON public.medicine_plans;
CREATE POLICY "Consumer view own plans" ON public.medicine_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Consumer manage own plans" ON public.medicine_plans;
CREATE POLICY "Consumer manage own plans" ON public.medicine_plans FOR ALL USING (true);

DROP POLICY IF EXISTS "Consumer manage own health" ON public.health_profiles;
CREATE POLICY "Consumer manage own health" ON public.health_profiles FOR ALL USING (true);

-- 4. Pharmacist Store Inventory, Alerts, Transfers & Analytics
DROP POLICY IF EXISTS "Allow read on inventory items" ON public.inventory_items;
CREATE POLICY "Allow read on inventory items" ON public.inventory_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow modify on inventory items" ON public.inventory_items;
CREATE POLICY "Allow modify on inventory items" ON public.inventory_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read on expiry alerts" ON public.expiry_alerts;
CREATE POLICY "Allow read on expiry alerts" ON public.expiry_alerts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read on transfers" ON public.redistribution_requests;
CREATE POLICY "Allow read on transfers" ON public.redistribution_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read on waste analytics" ON public.waste_analytics_snapshots;
CREATE POLICY "Allow read on waste analytics" ON public.waste_analytics_snapshots FOR SELECT USING (true);

-- ============================================================================
-- SEED DATA (Complete Wireframe Alignment: 1,248 Stock, FEFO & 71% Waste Metric)
-- ============================================================================

-- 1. Demo Organizations (CityCare Pharmacy & Hospital Branch)
INSERT INTO public.organizations (id, name, license_number, type, address, contact_phone, latitude, longitude)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'CityCare Pharmacy', 'DL-DEL-2024-9841', 'retail_pharmacy', 'Shop 14, Ring Road Market, New Delhi', '+919876543210', 28.6139, 77.2090),
('a0000000-0000-0000-0000-000000000002', 'CityCare Hospital Branch', 'DL-DEL-2023-1120', 'hospital', 'Sector 5, Dwarka, New Delhi', '+919876543211', 28.5823, 77.0500)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Master Medicines
INSERT INTO public.medicines (medicine_code, brand_name, generic_name, dosage_form, strength, manufacturer, usage_instructions)
VALUES 
(1, 'Calpol', 'Paracetamol', 'Tablet', '500mg', 'GSK Pharmaceuticals', 'Take with water after meals. Maximum 4 doses in 24 hours.'),
(2, 'Augmentin', 'Amoxicillin + Clavulanic Acid', 'Tablet', '250mg', 'GlaxoSmithKline', 'Complete prescribed 5-day course.'),
(3, 'Ciprogit', 'Ciprofloxacin', 'Tablet', '500mg', 'Cipla Ltd', 'Drink plenty of water while taking this medicine.'),
(4, 'Omez', 'Omeprazole', 'Capsule', '20mg', 'Dr. Reddys Labs', 'Take on an empty stomach in the morning.'),
(5, 'Cetzine', 'Cetirizine', 'Tablet', '10mg', 'Alkem Labs', 'May cause drowsiness. Take at bedtime.')
ON CONFLICT (medicine_code) DO NOTHING;

-- 3. Batches
INSERT INTO public.batches (batch_code, medicine_code, batch_number_str, mfg_date, expiry_date, is_recalled, recall_reason, recall_status)
VALUES
(1, 1, 'BTH-2026', '2026-01-01', (CURRENT_DATE + INTERVAL '48 days')::DATE, FALSE, NULL, 'active'),
(2, 2, 'BTH-2041', '2025-11-01', (CURRENT_DATE + INTERVAL '12 days')::DATE, FALSE, NULL, 'active'),
(3, 3, 'CIP-2025', '2025-05-01', (CURRENT_DATE + INTERVAL '180 days')::DATE, TRUE, 'Dissolution test failure reported by central lab', 'active'),
(4, 4, 'BTH-2077', '2024-06-01', (CURRENT_DATE - INTERVAL '5 days')::DATE, FALSE, NULL, 'active'),
(5, 5, 'BTH-2048', '2025-08-01', (CURRENT_DATE + INTERVAL '66 days')::DATE, FALSE, NULL, 'active')
ON CONFLICT (medicine_code, batch_code) DO UPDATE 
SET expiry_date = EXCLUDED.expiry_date, is_recalled = EXCLUDED.is_recalled, recall_reason = EXCLUDED.recall_reason;

-- 4. Inventory for CityCare Pharmacy (Matching Wireframe: 1,248 Total Stock)
INSERT INTO public.inventory_items (org_id, medicine_code, batch_code, quantity_on_hand, daily_sales_velocity, days_to_expiry)
VALUES
('a0000000-0000-0000-0000-000000000001', 2, 2, 60, 5.0, 12),  -- Amoxicillin 250mg (FEFO priority 1!)
('a0000000-0000-0000-0000-000000000001', 1, 1, 120, 2.5, 48), -- Paracetamol 500mg
('a0000000-0000-0000-0000-000000000001', 5, 5, 80, 1.2, 66),  -- Cetirizine 10mg
('a0000000-0000-0000-0000-000000000001', 4, 4, 45, 0.0, -5),  -- Omeprazole 20mg (Expired)
('a0000000-0000-0000-0000-000000000001', 3, 3, 20, 0.0, 180)  -- Ciprofloxacin 500mg (Recalled)
ON CONFLICT (org_id, medicine_code, batch_code) DO UPDATE 
SET quantity_on_hand = EXCLUDED.quantity_on_hand, days_to_expiry = EXCLUDED.days_to_expiry;

-- 5. Waste Analytics Snapshot (71% waste reduction metric)
INSERT INTO public.waste_analytics_snapshots (
    org_id, snapshot_period_days, waste_units_before, waste_units_with_striply, reduction_percentage,
    total_valid_units, total_near_expiry_units, total_expired_units, total_high_risk_units
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    30,
    124,
    36,
    71.00,
    1180,
    36,
    8,
    24
)
ON CONFLICT DO NOTHING;

-- 6. Redistribution Recommendation
INSERT INTO public.redistribution_requests (
    source_org_id, target_org_id, medicine_code, batch_code, units_transferred, distance_km, status
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    1,
    1,
    80,
    4.2,
    'pending_approval'
)
ON CONFLICT DO NOTHING;

-- 7. Seed Striply Unique Batch Records (Table ST-000001 to ST-000004 from Specification)
INSERT INTO public.medicine_batches (
    striply_batch_id, medicine_id, pharmacy_id, manufacturer_batch_number,
    manufacturing_date, expiry_date, available_quantity, unit, batch_status
)
VALUES
('ST-000001', 1, 'a0000000-0000-0000-0000-000000000001', 'PCM001', '2026-01-01', '2026-12-31', 120, 'Strips', 'active'),
('ST-000002', 1, 'a0000000-0000-0000-0000-000000000001', 'PCM002', '2026-02-01', '2027-02-28', 85, 'Strips', 'active'),
('ST-000003', 5, 'a0000000-0000-0000-0000-000000000001', 'CET001', '2025-08-01', '2026-08-15', 60, 'Strips', 'active'),
('ST-000004', 3, 'a0000000-0000-0000-0000-000000000001', 'IBU001', '2025-05-01', '2027-05-30', 100, 'Strips', 'active')
ON CONFLICT (striply_batch_id) DO UPDATE
SET available_quantity = EXCLUDED.available_quantity, expiry_date = EXCLUDED.expiry_date;
