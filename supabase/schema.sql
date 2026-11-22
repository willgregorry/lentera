-- ============================================================================
-- Lenteraku — Supabase PostgreSQL Schema, RLS Policies, Storage & Realtime
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper: auto-update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES (Keluarga & Caregiver)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('family', 'caregiver')),
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  location TEXT,
  fcm_token TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. ELDERLY PROFILES (Profil Lansia)
CREATE TABLE IF NOT EXISTS public.elderly_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 130),
  gender TEXT CHECK (gender IN ('Laki-laki', 'Perempuan')),
  blood_type TEXT,
  medical_conditions TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  routine_medications JSONB DEFAULT '[]'::jsonb,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  address TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'aman' CHECK (status IN ('aman', 'waspada', 'darurat')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_elderly_family_id ON public.elderly_profiles(family_id);

DROP TRIGGER IF EXISTS trg_elderly_updated_at ON public.elderly_profiles;
CREATE TRIGGER trg_elderly_updated_at
  BEFORE UPDATE ON public.elderly_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. CARE JOBS (Lowongan Perawatan Lansia)
CREATE TABLE IF NOT EXISTS public.care_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  elderly_id UUID NOT NULL REFERENCES public.elderly_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  schedule TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER NOT NULL DEFAULT 0,
  salary_max INTEGER NOT NULL DEFAULT 0,
  required_skills TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  assigned_caregiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_care_jobs_status ON public.care_jobs(status);
CREATE INDEX IF NOT EXISTS idx_care_jobs_family_id ON public.care_jobs(family_id);

DROP TRIGGER IF EXISTS trg_care_jobs_updated_at ON public.care_jobs;
CREATE TRIGGER trg_care_jobs_updated_at
  BEFORE UPDATE ON public.care_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. JOB APPLICATIONS (Lamaran Caregiver)
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.care_jobs(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_note TEXT,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  match_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, caregiver_id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_caregiver_id ON public.job_applications(caregiver_id);

DROP TRIGGER IF EXISTS trg_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. CARE LOGS (Catatan Monitoring Harian)
CREATE TABLE IF NOT EXISTS public.care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id UUID NOT NULL REFERENCES public.elderly_profiles(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  heart_rate INTEGER CHECK (heart_rate > 20 AND heart_rate < 250),
  blood_pressure_systolic INTEGER CHECK (blood_pressure_systolic > 40 AND blood_pressure_systolic < 300),
  blood_pressure_diastolic INTEGER CHECK (blood_pressure_diastolic > 20 AND blood_pressure_diastolic < 200),
  temperature NUMERIC(4, 1),
  meal_portion TEXT NOT NULL,
  medication_taken BOOLEAN NOT NULL DEFAULT TRUE,
  mood TEXT NOT NULL,
  notes TEXT,
  photo_url TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_care_logs_elderly_logged_at ON public.care_logs(elderly_id, logged_at DESC);

-- 6. AI DIGESTS (Ringkasan & Rekomendasi Harian Gemini)
CREATE TABLE IF NOT EXISTS public.ai_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id UUID NOT NULL REFERENCES public.elderly_profiles(id) ON DELETE CASCADE,
  digest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  food_recommendation TEXT NOT NULL,
  hydration_recommendation TEXT NOT NULL,
  activity_recommendation TEXT NOT NULL,
  anomaly_detected BOOLEAN NOT NULL DEFAULT FALSE,
  anomaly_notes TEXT,
  status_badge TEXT NOT NULL DEFAULT 'aman' CHECK (status_badge IN ('aman', 'waspada', 'darurat')),
  raw_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_digests_elderly_date ON public.ai_digests(elderly_id, digest_date DESC);

-- 7. SOS ALERTS (Peringatan Darurat Real-time)
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id UUID NOT NULL REFERENCES public.elderly_profiles(id) ON DELETE CASCADE,
  triggered_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  severity TEXT NOT NULL DEFAULT 'critical' CHECK (severity IN ('high', 'critical')),
  location_note TEXT,
  triage_brief JSONB,
  nearest_hospital JSONB,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_elderly_status ON public.sos_alerts(elderly_id, status);

-- 8. NOTIFICATIONS (Real-time Notifications & Announcements)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement' CHECK (type IN ('care_log', 'sos', 'job', 'announcement', 'ai_digest')),
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: authenticated users can read profiles; users can update own profile
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Elderly profiles: family owner or assigned caregiver can read; family owner can write
CREATE POLICY "elderly_select_authenticated" ON public.elderly_profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "elderly_insert_family" ON public.elderly_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = family_id);
CREATE POLICY "elderly_update_family" ON public.elderly_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = family_id);

-- Care jobs: authenticated users can view open jobs; family can manage own jobs
CREATE POLICY "jobs_select_authenticated" ON public.care_jobs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "jobs_insert_family" ON public.care_jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = family_id);
CREATE POLICY "jobs_update_family" ON public.care_jobs
  FOR UPDATE TO authenticated USING (auth.uid() = family_id);

-- Job applications: caregiver or job owner can view; caregiver can apply
CREATE POLICY "applications_select_involved" ON public.job_applications
  FOR SELECT TO authenticated USING (
    auth.uid() = caregiver_id OR
    EXISTS (SELECT 1 FROM public.care_jobs j WHERE j.id = job_id AND j.family_id = auth.uid())
  );
CREATE POLICY "applications_insert_caregiver" ON public.job_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = caregiver_id);
CREATE POLICY "applications_update_family" ON public.job_applications
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.care_jobs j WHERE j.id = job_id AND j.family_id = auth.uid())
  );

-- Care logs: authenticated involved parties can read; caregiver can insert
CREATE POLICY "care_logs_select_authenticated" ON public.care_logs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "care_logs_insert_caregiver" ON public.care_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = caregiver_id);

-- AI digests: authenticated users can read
CREATE POLICY "ai_digests_select_authenticated" ON public.ai_digests
  FOR SELECT TO authenticated USING (true);

-- SOS alerts: authenticated users can read/create/resolve
CREATE POLICY "sos_select_authenticated" ON public.sos_alerts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "sos_insert_authenticated" ON public.sos_alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = triggered_by);
CREATE POLICY "sos_update_authenticated" ON public.sos_alerts
  FOR UPDATE TO authenticated USING (true);

-- Notifications: user sees own notifications or global announcements (user_id IS NULL)
CREATE POLICY "notifications_select_own_or_global" ON public.notifications
  FOR SELECT TO authenticated USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKET FOR CARE LOG PHOTOS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('care-photos', 'care-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "care_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'care-photos');

CREATE POLICY "care_photos_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'care-photos');

-- ============================================================================
-- SUPABASE REALTIME PUBLICATION
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'care_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.care_logs;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'sos_alerts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
