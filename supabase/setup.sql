-- ============================================================
-- Alternatif Turizm Devremülk — TEK SEFERDE KURULUM
-- Supabase Dashboard > SQL Editor > yapıştır > Run
-- ============================================================

-- ── 1) TABLOLAR ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  price DECIMAL(12, 2),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('kiralama', 'satış')),
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  location TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('kiralama', 'satış')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE locations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- ── 2) ROW LEVEL SECURITY ────────────────────────────────────

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lokasyonlar herkese açık" ON locations;
CREATE POLICY "Lokasyonlar herkese açık"
ON locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "İlanlar herkese açık" ON listings;
CREATE POLICY "İlanlar herkese açık"
ON listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Herkes başvuru gönderebilir" ON submissions;
CREATE POLICY "Herkes başvuru gönderebilir"
ON submissions FOR INSERT WITH CHECK (true);

-- ── 3) LOKASYONLAR ───────────────────────────────────────────

INSERT INTO locations (name, slug, sort_order) VALUES
  ('Kızılcahamam', 'kizilcahamam', 1),
  ('Bolu', 'bolu', 2),
  ('Afyon', 'afyon', 3),
  ('Diğer', 'diger', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

-- ── 4) ÖRNEK İLANLAR (tablo boşsa) ─────────────────────────

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM listings) = 0 THEN
    INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
    SELECT
      'Eliz Termal Kızılcahamam',
      'Kızılcahamam''da termal tatil imkanı. Spa, havuz ve konforlu konaklama seçenekleri.',
      l.id, 'kiralama',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      true
    FROM locations l WHERE l.slug = 'kizilcahamam';

    INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
    SELECT
      'Narven Termal Bolu',
      'Bolu''da doğayla iç içe termal tatil. Aileler için ideal devremülk seçenekleri.',
      l.id, 'kiralama',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      true
    FROM locations l WHERE l.slug = 'bolu';

    INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
    SELECT
      'Özgül Termal Afyon',
      'Afyon''da kaplıca ve termal tedavi imkanlarıyla huzurlu bir tatil deneyimi.',
      l.id, 'satış',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      true
    FROM locations l WHERE l.slug = 'afyon';
  END IF;
END $$;

-- ── 5) STORAGE (ilan görselleri) ─────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

UPDATE storage.buckets
SET allowed_mime_types = NULL, file_size_limit = 5242880
WHERE id = 'listing-images';

DROP POLICY IF EXISTS "İlan görselleri herkese açık" ON storage.objects;
CREATE POLICY "İlan görselleri herkese açık"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "İlan görselleri yükleme" ON storage.objects;
CREATE POLICY "İlan görselleri yükleme"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "İlan görselleri güncelleme" ON storage.objects;
CREATE POLICY "İlan görselleri güncelleme"
ON storage.objects FOR UPDATE
USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "İlan görselleri silme" ON storage.objects;
CREATE POLICY "İlan görselleri silme"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-images');

-- ── 6) KONTROL ───────────────────────────────────────────────

SELECT 'locations' AS tablo, COUNT(*) AS kayit FROM locations
UNION ALL
SELECT 'listings', COUNT(*) FROM listings
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions;

SELECT id, name, public FROM storage.buckets WHERE id = 'listing-images';
