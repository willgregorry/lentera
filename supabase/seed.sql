-- ============================================================================
-- Lenteraku — Demo Seed Data (Siap Demo & Penjurian)
-- Akun Demo:
--   1. Keluarga : budi@lenteraku.id (Budi Santoso)
--   2. Caregiver: rini@lenteraku.id (Rini Hartati)
--   Profil Lansia: Pak Joko (74 thn, Hipertensi ringan & Diabetes tipe 2)
-- ============================================================================

-- Fixed UUIDs for deterministic demo relations
-- Budi (Family): 11111111-1111-4111-8111-111111111111
-- Rini (Caregiver): 22222222-2222-4222-8222-222222222222
-- Sari (Caregiver 2): 33333333-3333-4333-8333-333333333333
-- Pak Joko (Elderly): aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa
-- Care Job 1: bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb

INSERT INTO public.profiles (id, email, full_name, role, phone, bio, skills, experience_years, location, is_verified)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'budi@lenteraku.id',
    'Budi Santoso',
    'family',
    '0812-3456-7890',
    'Anak pertama Pak Joko yang bekerja di Jakarta Selatan dan memantau kondisi ayah di rumah setiap hari.',
    '{}',
    0,
    'Jakarta Selatan',
    TRUE
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'rini@lenteraku.id',
    'Rini Hartati, A.Md.Kep',
    'caregiver',
    '0813-9876-5432',
    'Perawat lansia bersertifikat dengan pengalaman 5 tahun menangani pasien hipertensi, diabetes tipe 2, dan pemulihan pasca rawat inap.',
    ARRAY['Perawatan Hipertensi', 'Manajemen Diabetes', 'Pemantauan Obat Rutin', 'Pertolongan Pertama', 'Mobilisasi Lansia'],
    5,
    'Jakarta Selatan',
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'sari@lenteraku.id',
    'Sari Wulandari',
    'caregiver',
    '0856-1122-3344',
    'Caregiver pendamping aktivitas harian lansia, nutrisi seimbang, dan senam ringan.',
    ARRAY['Pendampingan Harian', 'Nutrisi Lansia', 'Senam Ringan'],
    2,
    'Depok',
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.elderly_profiles (
  id, family_id, name, age, gender, blood_type,
  medical_conditions, allergies, routine_medications, emergency_contacts,
  address, status
)
VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  'Pak Joko Widodo',
  74,
  'Laki-laki',
  'O+',
  ARRAY['Hipertensi Ringan', 'Diabetes Tipe 2 Terkontrol'],
  ARRAY['Antibiotik Sulfa', 'Udang / Makanan Laut'],
  '[
    {"name": "Amlodipine 5mg", "schedule": "Pagi setelah sarapan (07:30)", "purpose": "Kontrol tekanan darah"},
    {"name": "Metformin 500mg", "schedule": "Pagi & Malam sesudah makan", "purpose": "Kontrol gula darah"}
  ]'::jsonb,
  '[
    {"name": "Budi Santoso (Anak)", "phone": "0812-3456-7890", "relation": "Anak Kandung"},
    {"name": "RS Fatmawati (IGD)", "phone": "021-7501524", "relation": "Rumah Sakit Terdekat"}
  ]'::jsonb,
  'Jl. Kemang Timur No. 18, Jakarta Selatan',
  'aman'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.care_jobs (
  id, family_id, elderly_id, title, description, schedule, location,
  salary_min, salary_max, required_skills, status, assigned_caregiver_id
)
VALUES
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Perawat Harian Lansia (Hipertensi & Diabetes Ringan)',
    'Membutuhkan perawat/caregiver sabar dan teliti untuk mendampingi Pak Joko (74 thn) selama jam kerja keluarga: cek tensi pagi-sore, pastikan minum obat rutin tepat waktu, dan dampingi makan siang rendah gula/garam.',
    'Senin - Sabtu, 07:30 - 17:00 WIB',
    'Kemang, Jakarta Selatan',
    4000000,
    5000000,
    ARRAY['Perawatan Hipertensi', 'Manajemen Diabetes', 'Pemantauan Obat Rutin'],
    'filled',
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Caregiver Pendamping Akhir Pekan (Sabtu - Minggu)',
    'Pendampingan ringan akhir pekan untuk jalan pagi di taman, memastikan hidrasi cukup, dan menemani membaca koran.',
    'Sabtu - Minggu, 08:00 - 15:00 WIB',
    'Kemang, Jakarta Selatan',
    1800000,
    2200000,
    ARRAY['Pendampingan Harian', 'Pertolongan Pertama'],
    'open',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.job_applications (
  id, job_id, caregiver_id, cover_note, match_score, match_reason, status
)
VALUES
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'Saya memiliki pengalaman 5 tahun merawat pasien lansia dengan hipertensi dan diabetes tipe 2, terbiasa menggunakan tensimeter digital dan glucometer.',
    95,
    'Keahlian klinis Rini (hipertensi, diabetes, pemantauan obat) cocok 100% dengan profil medis Pak Joko dan berdomisili di Jakarta Selatan.',
    'accepted'
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '33333333-3333-4333-8333-333333333333',
    'Saya siap mendampingi Pak Joko di akhir pekan untuk jalan pagi dan menjaga pola makan serta hidrasi beliau.',
    84,
    'Berpengalaman dalam pendampingan harian dan nutrisi lansia, lokasi berdekatan.',
    'pending'
  )
ON CONFLICT (id) DO NOTHING;

-- Riwayat Care Logs 3 Hari Terakhir (Pak Joko)
INSERT INTO public.care_logs (
  elderly_id, caregiver_id, heart_rate, blood_pressure_systolic, blood_pressure_diastolic,
  temperature, meal_portion, medication_taken, mood, notes, logged_at
)
VALUES
  -- Hari -2 (2 hari lalu)
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    76, 128, 82, 36.5, 'Habis 1 porsi', TRUE, 'Tenang & Ceria',
    'Sarapan oatmeal dan telur rebus. Obat Amlodipine 5mg dan Metformin sudah diminum jam 07:45.',
    NOW() - INTERVAL '2 days' - INTERVAL '6 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    80, 132, 84, 36.6, 'Habis 3/4 porsi', TRUE, 'Sedikit Lelah',
    'Jalan santai 15 menit di teras. Sore hari tekanan darah sedikit naik namun masih terkendali.',
    NOW() - INTERVAL '2 days'
  ),
  -- Hari -1 (kemarin)
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    74, 125, 80, 36.4, 'Habis 1 porsi', TRUE, 'Ceria',
    'Tidur malam nyenyak. Pagi ini bersemangat mendengarkan radio dan sarapan sup ayam bening.',
    NOW() - INTERVAL '1 day' - INTERVAL '6 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    78, 129, 81, 36.5, 'Habis 1 porsi', TRUE, 'Tenang',
    'Minum air putih cukup (6 gelas). Gula darah sewaktu 138 mg/dL, kondisi stabil.',
    NOW() - INTERVAL '1 day'
  ),
  -- Hari ini
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    75, 124, 79, 36.5, 'Habis 1 porsi', TRUE, 'Sangat Baik',
    'Sarapan nasi merah porsi kecil dengan tumis bayam dan ikan kukus. Obat pagi sudah diminum tepat waktu.',
    NOW() - INTERVAL '4 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    77, 126, 80, 36.6, 'Habis 1 porsi', TRUE, 'Ceria',
    'Makan siang lahap, sempat video call sebentar dengan cucu sehingga suasana hati sangat baik.',
    NOW() - INTERVAL '1 hour'
  );

-- Sample AI Digest
INSERT INTO public.ai_digests (
  elderly_id, digest_date, summary, food_recommendation, hydration_recommendation,
  activity_recommendation, anomaly_detected, anomaly_notes, status_badge
)
VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  CURRENT_DATE,
  'Kondisi Pak Joko hari ini stabil dan positif. Tekanan darah berada di rentang 124/79 - 126/80 mmHg dengan detak jantung normal (75-77 bpm). Nafsu makan baik dan obat rutin pagi sudah dikonsumsi tepat waktu.',
  'Lanjutkan menu rendah garam dan rendah indeks glikemik: pepes ikan kembung, sayur bening katuk/bayam, dan buah potong apel atau pir sebagai camilan sore.',
  'Pertahankan target 1.5 - 1.8 liter air putih hangat per hari (sekitar 7-8 gelas bertahap) untuk menjaga sirkulasi dan fungsi ginjal.',
  'Lakukan peregangan ringan 10 menit di ruang tamu pada sore hari serta latihan pernapasan santai sebelum istirahat malam.',
  FALSE,
  NULL,
  'aman'
);

-- Sample Notifications
INSERT INTO public.notifications (user_id, title, body, type, is_read)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'Laporan Siang Pak Joko Diterima',
    'Rini Hartati mencatat tekanan darah 126/80 mmHg, makan siang habis 1 porsi, dan kondisi ceria.',
    'care_log',
    FALSE
  ),
  (
    NULL,
    'Tips Perawatan Lansia Musim Pancaroba',
    'Pastikan lansia cukup terhidrasi dan pantau suhu tubuh secara berkala pagi dan sore hari.',
    'announcement',
    FALSE
  );
