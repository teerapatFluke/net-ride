-- ==============================================================================
-- NET RIDE - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target User UID: ee68b45b-f854-4fcc-9af6-f9e7a707afb5 (teerapat.choet@gmail.com)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Driver Settings Table
CREATE TABLE IF NOT EXISTS public.driver_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    fuel_efficiency NUMERIC(6, 2) NOT NULL DEFAULT 15.00, -- อัตราสิ้นเปลือง (กม./ลิตร)
    last_fuel_price NUMERIC(6, 2) NOT NULL DEFAULT 38.00, -- ราคาน้ำมันล่าสุด (บาท/ลิตร)
    monthly_goal NUMERIC(10, 2) NOT NULL DEFAULT 8000.00, -- เป้าหมายกำไรสุทธิต่อเดือน (บาท)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Ride Logs Table (บันทึกการขับแต่ละรอบ/กะ)
CREATE TABLE IF NOT EXISTS public.ride_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    platform TEXT NOT NULL, -- รองรับ multiple platforms เช่น 'Grab, Bolt'
    gross_income NUMERIC(10, 2) NOT NULL CHECK (gross_income >= 0),
    distance_km NUMERIC(8, 2) NOT NULL CHECK (distance_km >= 0),
    fuel_price NUMERIC(6, 2) NOT NULL CHECK (fuel_price > 0),
    fuel_efficiency NUMERIC(6, 2) NOT NULL CHECK (fuel_efficiency > 0),
    fuel_cost NUMERIC(10, 2) GENERATED ALWAYS AS (ROUND((distance_km / NULLIF(fuel_efficiency, 0)) * fuel_price, 2)) STORED,
    net_income NUMERIC(10, 2) GENERATED ALWAYS AS (ROUND(gross_income - ((distance_km / NULLIF(fuel_efficiency, 0)) * fuel_price), 2)) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ปลดล็อก constraint เดิมเพื่อให้รองรับการเลือกหลายแพลตฟอร์มพร้อมกัน (เช่น 'Grab, Bolt')
ALTER TABLE public.ride_logs DROP CONSTRAINT IF EXISTS ride_logs_platform_check;

-- Create Index for fast date querying
CREATE INDEX IF NOT EXISTS idx_ride_logs_user_date ON public.ride_logs(user_id, log_date DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - PRIVACY & EXCLUSIVE ACCESS
-- ป้องกันไม่ให้คนอื่นเข้าถึงข้อมูลเด็ดขาด อนุญาตเฉพาะ user ของคุณเท่านั้น
-- ==============================================================================

-- Enable RLS on both tables
ALTER TABLE public.driver_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Exclusive access for owner driver_settings" ON public.driver_settings;
DROP POLICY IF EXISTS "Exclusive access for owner ride_logs" ON public.ride_logs;

-- Policy for driver_settings (เฉพาะคุณคนเดียวเท่านั้น)
CREATE POLICY "Exclusive access for owner driver_settings"
ON public.driver_settings
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id 
    AND (auth.uid() = 'ee68b45b-f854-4fcc-9af6-f9e7a707afb5' OR auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
)
WITH CHECK (
    auth.uid() = user_id 
    AND (auth.uid() = 'ee68b45b-f854-4fcc-9af6-f9e7a707afb5' OR auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
);

-- Policy for ride_logs (เฉพาะคุณคนเดียวเท่านั้น)
CREATE POLICY "Exclusive access for owner ride_logs"
ON public.ride_logs
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id 
    AND (auth.uid() = 'ee68b45b-f854-4fcc-9af6-f9e7a707afb5' OR auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
)
WITH CHECK (
    auth.uid() = user_id 
    AND (auth.uid() = 'ee68b45b-f854-4fcc-9af6-f9e7a707afb5' OR auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
);

-- 5. Insert default settings for your user if not present
INSERT INTO public.driver_settings (user_id, fuel_efficiency, last_fuel_price, monthly_goal)
VALUES ('ee68b45b-f854-4fcc-9af6-f9e7a707afb5', 15.00, 38.00, 8000.00)
ON CONFLICT (user_id) DO NOTHING;
