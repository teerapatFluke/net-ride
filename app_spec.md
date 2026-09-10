# App Specification: Net Ride (Ride-Hailing Income & Cost Calculator)

## 1. Project Overview
**App Name:** Net Ride  
**Description:** A progressive, mobile-first web application designed for ride-hailing drivers (Grab, Bolt, LINE MAN, inDrive, etc.) to log trips, calculate real net profit after fuel and vehicle depreciation, track monthly targets, and export accounting data.

- **GitHub Repository:** `https://github.com/teerapatFluke/net-ride-qwen.git`
- **Frontend Stack:** React, Vite, Vanilla CSS (Design system with glassmorphism, HSL dark mode, responsive bottom sheets)
- **Backend / Database:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Supabase Credentials:**
  - `VITE_SUPABASE_URL=https://rlaxicqlwjpsdvvruhei.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZpYC85rlZladI3di4T96Eg_tAgdbBoD`
- **Owner / Target Account:** `teerapat.choet@gmail.com`
- **LINE LIFF Integration:** LIFF ID `2011538034-u50VZuPm` (`https://liff.line.me/2011538034-u50VZuPm`)

---

## 2. Core Architecture & Features

### 2.1 User Authentication & Persistence
- **Email / Password & Magic Link Login:** Authentication powered by Supabase Auth.
- **Single-User Exclusive Access (RLS):** Protected by Supabase Row Level Security, restricted strictly to `teerapat.choet@gmail.com`. Unauthorized users receive an immediate security access guard screen.
- **Persistent Login:** Session stored in `localStorage` (`netride_custom_session`). Users remain logged in across mobile browser sessions and LINE LIFF reloads without needing to re-enter credentials.

---

### 2.2 Profit & Cost Calculation Engine
- **Full Decimal Support:** All numerical inputs support arbitrary decimal precision (`step="any"`, `inputMode="decimal"`).
- **Automated Fuel Cost:**
  $$\text{Fuel Cost} = \left(\frac{\text{Distance (km)}}{\text{Fuel Efficiency (km/L)}}\right) \times \text{Fuel Price (THB/L)}$$
- **Vehicle Depreciation & Maintenance (ค่าเสื่อมและค่าสึกหรอรถ):**
  $$\text{Depreciation Cost} = \text{Distance (km)} \times \text{Depreciation Rate (THB/km)}$$
  *(Configurable in settings, default e.g. 0.50 THB/km).*
- **Dual-Mode Net Profit Switch (Segmented Toggle):**
  - **🔧 หักค่าเสื่อมรถ (Real Net Profit):**  
    $$\text{Net Income} = \text{Gross Income} - \text{Fuel Cost} - \text{Depreciation Cost}$$
  - **💵 ไม่หักค่าเสื่อม (Cash Profit):**  
    $$\text{Cash Net Income} = \text{Gross Income} - \text{Fuel Cost}$$
  - Selection is reactive across the entire dashboard and saved in `localStorage` (`netride_deduct_depreciation`).

---

### 2.3 Dashboard & UI Hierarchy (Top to Bottom)
1. **Navbar:** App branding, date picker shortcut, export data trigger, settings modal, and logout.
2. **Monthly Goal Card (Top Position):**
   - Placed at the top of the dashboard for immediate driver motivation.
   - Dynamic Thai month naming automatically synced with the selected date (e.g. "เป้าหมายกำไรเดือนกันยายน", "เป้าหมายกำไรเดือนตุลาคม").
   - Live progress bar, target percentage, and remaining amount to reach goal.
3. **Daily Summary Card:**
   - Date navigation (Previous Day, Today, Next Day).
   - Profit toggle (หักค่าเสื่อมรถ vs ไม่หักค่าเสื่อม).
   - KPI metrics: Gross Income (รายได้รวม), Fuel Cost (ค่าน้ำมัน), Distance (ระยะทาง), and Net Profit (กำไรสุทธิ).
4. **Ride List:**
   - Detailed trip cards per day sorted by time.
   - Shows platform badge, gross income, distance, fuel efficiency, fuel cost, net profit, and optional driver notes.
   - Quick action buttons for Edit and Delete.
5. **Floating Action Button (FAB):**
   - High-contrast emerald add button fixed to bottom right for single-hand mobile operation.

---

### 2.4 Trip Entry & Edit Modal (AddRideModal)
- **Single-Select Platform Selector:**
  - Fast selection with clean brand cards: **Grab**, **Bolt**, **LINE MAN**, **inDrive**, and **Other**.
  - Displays official vector brand logos directly inside the cards without duplicate text or nested pill badges.
  - Active selection highlighted with green glow and checkmark (`✓`).
  - Drivers operating multiple platforms simultaneously or unlisted providers can select **Other**.
- **Input Fields:**
  - Date (Default to selected/current day).
  - Gross Income (รายได้รวม - THB).
  - Distance Driven (ระยะทาง - km).
  - Fuel Price (ราคาน้ำมัน - THB/L, auto-filled with last saved price).
  - Fuel Efficiency (อัตราสิ้นเปลือง - km/L, defaults to vehicle setting).
  - Depreciation per km (ค่าเสื่อมต่อกม. - THB/km).
  - Notes (หมายเหตุ - optional text).
- **Live Calculation Preview:** Real-time calculation card showing estimated fuel cost, depreciation, and net earnings before saving.

---

### 2.5 Data Export & LINE LIFF In-App Compatibility
- **Export Filters:** Export All Data or Current Month Only.
- **UTF-8 BOM CSV Generation:** Fully compatible with Microsoft Excel and Google Sheets with Thai character rendering.
- **LINE LIFF & Mobile In-App Browser Solutions:**
  - *Problem:* Mobile in-app WebViews (especially LINE LIFF) block standard `<a download>` and Blob downloads.
  - *Solution 1 - Send Download Link to LINE Chat (`https://line.me/R/msg/text/?...`):* 1-tap action to share a direct download link into LINE Keep Memo or chat. When tapped in chat, LINE routes the link with `?openExternalBrowser=1` directly to Safari/Chrome to download the CSV.
  - *Solution 2 - Auto External Browser Handoff (`DownloadLanding`):* Injects encoded payload into query/hash and triggers `liff.openWindow({ url, external: true })` or external browser handoff to start native file saving without requiring re-login.
  - *Solution 3 - 1-Tap Clipboard Copy:* Copies raw CSV lines directly to clipboard for immediate paste into Google Sheets / Excel app.

---

## 3. Database Schema & RLS Policies (PostgreSQL)

```sql
-- 1. Driver Settings Table
CREATE TABLE IF NOT EXISTS public.driver_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    fuel_efficiency NUMERIC(6, 2) NOT NULL DEFAULT 15.00,
    last_fuel_price NUMERIC(6, 2) NOT NULL DEFAULT 38.00,
    depreciation_per_km NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    monthly_goal NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Ride Logs Table
CREATE TABLE IF NOT EXISTS public.ride_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    platform TEXT NOT NULL,
    gross_income NUMERIC(10, 2) NOT NULL CHECK (gross_income >= 0),
    distance_km NUMERIC(8, 2) NOT NULL CHECK (distance_km >= 0),
    fuel_price NUMERIC(6, 2) NOT NULL CHECK (fuel_price > 0),
    fuel_efficiency NUMERIC(6, 2) NOT NULL CHECK (fuel_efficiency > 0),
    depreciation_per_km NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    fuel_cost NUMERIC(10, 2) GENERATED ALWAYS AS (ROUND((distance_km / NULLIF(fuel_efficiency, 0)) * fuel_price, 2)) STORED,
    net_income NUMERIC(10, 2) GENERATED ALWAYS AS (
        ROUND(gross_income - ((distance_km / NULLIF(fuel_efficiency, 0)) * fuel_price) - (distance_km * COALESCE(depreciation_per_km, 0)), 2)
    ) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for date queries
CREATE INDEX IF NOT EXISTS idx_ride_logs_user_date ON public.ride_logs(user_id, log_date DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE public.driver_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exclusive access for owner driver_settings"
ON public.driver_settings FOR ALL TO authenticated
USING (auth.uid() = user_id AND auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
WITH CHECK (auth.uid() = user_id AND auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com');

CREATE POLICY "Exclusive access for owner ride_logs"
ON public.ride_logs FOR ALL TO authenticated
USING (auth.uid() = user_id AND auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com')
WITH CHECK (auth.uid() = user_id AND auth.jwt() ->> 'email' = 'teerapat.choet@gmail.com');
```

---

## 4. Design & Mobile Usability Tokens
- **Typography:** Google Fonts (`Outfit` for english numbers & headings, `Prompt` for Thai body text).
- **Color Palette:**
  - Background: Deep Dark Slate (`#080c14`, `#0f172a`)
  - Primary Accent: Emerald (`#10b981`, `#059669`)
  - Platform Brand Colors: Grab (`#00b14f`), Bolt (`#34d186`), LINE MAN (`#06c755`), inDrive (`#a2ff00`)
- **Mobile UX Details:**
  - Bottom sheet dialogs on mobile screens (`max-width: 640px`) with drag handle.
  - Safe-area bottom insets for notch and modern home bar devices.
  - Single-hand accessible touch targets (min height 48px - 52px).
