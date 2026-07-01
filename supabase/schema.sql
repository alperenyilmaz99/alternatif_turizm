-- Devremülk sitesi veritabanı şeması
-- Supabase SQL Editor'da çalıştırın

-- Lokasyonlar tablosu
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
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

-- Örnek veriler
INSERT INTO locations (name, slug) VALUES
  ('Eliz', 'eliz'),
  ('Afyon', 'afyon'),
  ('Antalya', 'antalya'),
  ('Bodrum', 'bodrum')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO listings (title, description, location_id, price, listing_type, image_url, featured)
SELECT
  'Eliz Termal Resort - 1 Hafta',
  '5 yıldızlı termal otelde 2+1 daire, tam donanımlı mutfak ve spa erişimi.',
  l.id,
  15000.00,
  'kiralama',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'eliz'
ON CONFLICT DO NOTHING;

INSERT INTO listings (title, description, location_id, price, listing_type, image_url, featured)
SELECT
  'Afyon Grand Otel - Devremülk',
  'Merkezi konumda, kaplıca ve havuz imkanlarıyla ideal tatil seçeneği.',
  l.id,
  850000.00,
  'satış',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'afyon'
ON CONFLICT DO NOTHING;

INSERT INTO listings (title, description, location_id, price, listing_type, image_url, featured)
SELECT
  'Eliz Spa & Wellness',
  'Haftalık kiralama, 4 kişilik suit oda, kahvaltı dahil.',
  l.id,
  22000.00,
  'kiralama',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'eliz'
ON CONFLICT DO NOTHING;
