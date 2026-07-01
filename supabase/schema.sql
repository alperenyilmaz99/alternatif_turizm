-- Devremülk sitesi veritabanı şeması
-- Supabase SQL Editor'da çalıştırın

-- Lokasyonlar tablosu
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İlanlar tablosu
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

-- Kullanıcı başvuruları tablosu
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

-- Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (ilanlar ve lokasyonlar)
CREATE POLICY "Lokasyonlar herkese açık" ON locations FOR SELECT USING (true);
CREATE POLICY "İlanlar herkese açık" ON listings FOR SELECT USING (true);

-- Herkes başvuru gönderebilir
CREATE POLICY "Herkes başvuru gönderebilir" ON submissions FOR INSERT WITH CHECK (true);

-- Lokasyonlar (sıralama: Kızılcahamam, Bolu, Afyon, Diğer)
INSERT INTO locations (name, slug, sort_order) VALUES
  ('Kızılcahamam', 'kizilcahamam', 1),
  ('Bolu', 'bolu', 2),
  ('Afyon', 'afyon', 3),
  ('Diğer', 'diger', 4)
ON CONFLICT (slug) DO NOTHING;

-- Örnek ilanlar
INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Eliz Termal Kızılcahamam',
  'Kızılcahamam''da termal tatil imkanı. Spa, havuz ve konforlu konaklama seçenekleri.',
  l.id,
  'kiralama',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'kizilcahamam'
ON CONFLICT DO NOTHING;

INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Narven Termal Bolu',
  'Bolu''da doğayla iç içe termal tatil. Aileler için ideal devremülk seçenekleri.',
  l.id,
  'kiralama',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'bolu'
ON CONFLICT DO NOTHING;

INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Özgül Termal Afyon',
  'Afyon''da kaplıca ve termal tedavi imkanlarıyla huzurlu bir tatil deneyimi.',
  l.id,
  'satış',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'afyon'
ON CONFLICT DO NOTHING;
