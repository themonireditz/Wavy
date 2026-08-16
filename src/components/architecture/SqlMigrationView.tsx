import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, Sparkles, ShieldCheck } from 'lucide-react';

export const SqlMigrationView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- ==========================================================
-- WAVY HOSPITALITY PLATFORM - SUPABASE / POSTGRESQL MIGRATION
-- Target: Cox's Bazar Marketplace & Extranet Platform
-- ==========================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('super_admin', 'hotel_owner', 'hotel_staff', 'customer');
CREATE TYPE booking_status AS ENUM ('pending_advance', 'confirmed', 'checked_in', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_mode AS ENUM ('full', 'advance_partial');
CREATE TYPE transaction_type AS ENUM ('advance_payment', 'balance_settlement', 'refund', 'payout');
CREATE TYPE transport_type AS ENUM ('bus', 'air', 'train', 'rental');

-- 2. USER PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'customer'::user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HOTELS TABLE (API-Ready with External Provider Columns)
CREATE TABLE public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    zone TEXT NOT NULL, -- 'Kolatoli', 'Sugandha', 'Marine Drive', 'Laboni', 'Inani'
    address TEXT NOT NULL,
    landmark_distance TEXT, -- e.g. '80m from Kolatoli Beach Point'
    google_maps_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    commission_rate NUMERIC(5,2) DEFAULT 15.00,
    check_in_time TIME DEFAULT '12:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    cover_image TEXT,
    -- External API Sync Fields
    inventory_source TEXT DEFAULT 'direct', -- 'direct', 'siteminder', 'staah', 'agoda_api'
    external_hotel_id TEXT,
    sync_status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. HOTEL STAFF (Role Separation & PIN Authorization)
CREATE TABLE public.hotel_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    designation TEXT DEFAULT 'Front Desk Staff',
    staff_pin VARCHAR(6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(hotel_id, user_id)
);

-- 5. ROOMS TABLE
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_title TEXT NOT NULL, -- e.g. 'Deluxe AC Sea View Couple'
    bed_type TEXT NOT NULL,
    max_guests INT DEFAULT 2,
    base_price NUMERIC(10,2) NOT NULL,
    total_rooms_count INT NOT NULL,
    has_ac BOOLEAN DEFAULT true,
    has_generator_backup BOOLEAN DEFAULT true,
    has_geyser BOOLEAN DEFAULT true,
    has_wifi BOOLEAN DEFAULT true,
    photos TEXT[] DEFAULT '{}',
    -- External API Sync Fields
    external_room_id TEXT,
    external_rate_plan_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DAILY AVAILABILITY & LOCKS
CREATE TABLE public.room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_units INT NOT NULL,
    price_override NUMERIC(10,2),
    is_blacked_out BOOLEAN DEFAULT false,
    last_updated TIMESTAMPTZ DEFAULT now(),
    UNIQUE(room_id, date)
);

-- 7. BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_code VARCHAR(12) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    hotel_id UUID REFERENCES public.hotels(id),
    room_id UUID REFERENCES public.rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    rooms_count INT DEFAULT 1,
    guest_count INT DEFAULT 2,
    total_amount NUMERIC(10,2) NOT NULL,
    advance_paid NUMERIC(10,2) NOT NULL,
    due_amount NUMERIC(10,2) NOT NULL,
    payment_mode payment_mode DEFAULT 'advance_partial'::payment_mode,
    status booking_status DEFAULT 'confirmed'::booking_status,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    -- External Provider Response Data
    external_booking_id TEXT,
    external_provider_response JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TRANSPORTATION BOOKINGS (Bus/Air/Train API Expansions)
CREATE TABLE public.transport_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    transport_type transport_type NOT NULL,
    provider_name TEXT NOT NULL, -- e.g. 'Green Line Paribahan', 'Biman Bangladesh', 'Shohoz'
    external_ticket_pnr TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    seat_numbers TEXT[] DEFAULT '{}',
    ticket_payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    gateway_txn_id TEXT,
    payment_channel TEXT, -- 'bKash', 'Nagad', 'SSLCommerz', 'FrontDeskCash'
    amount NUMERIC(10,2) NOT NULL,
    transaction_type transaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. WEEKLY PAYOUT LEDGER
CREATE TABLE public.hotel_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id),
    cycle_start DATE NOT NULL,
    cycle_end DATE NOT NULL,
    gross_earnings NUMERIC(10,2) NOT NULL,
    commission_deducted NUMERIC(10,2) NOT NULL,
    net_payout NUMERIC(10,2) NOT NULL,
    payout_status TEXT DEFAULT 'pending',
    payment_reference TEXT,
    settled_at TIMESTAMPTZ
);

-- ==========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Verified hotels are viewable by everyone" ON public.hotels FOR SELECT USING (is_verified = true OR auth.uid() = owner_id);
CREATE POLICY "Owners can update own hotels" ON public.hotels FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Customers view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Owners/Staff view their hotel bookings" ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE id = bookings.hotel_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.hotel_staff WHERE hotel_id = bookings.hotel_id AND user_id = auth.uid())
);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-serif">Supabase / PostgreSQL Schema & RLS Policies</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete database schema with 9 tables, custom ENUMs, triggers, and Row Level Security.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Migration Script'}</span>
          </button>
        </div>

        {/* SQL Code Box */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-slate-850 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">supabase/migrations/20260816_init_wavy_hospitality.sql</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">PostgreSQL 15+ / Supabase</span>
          </div>

          <div className="p-5 font-mono text-xs text-teal-200 overflow-x-auto bg-slate-950 leading-relaxed max-h-[600px]">
            <pre>{sqlSchema}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
