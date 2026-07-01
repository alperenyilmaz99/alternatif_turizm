-- Mevcut Supabase veritabanını yeni lokasyon yapısına güncellemek için çalıştırın
-- SQL Editor'da bu dosyayı çalıştırın

-- sort_order sütunu ekle (yoksa)
ALTER TABLE locations ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Eski lokasyonları ve ilanları temizle
DELETE FROM listings;
DELETE FROM locations;

-- Yeni lokasyonlar
INSERT INTO locations (name, slug, sort_order) VALUES
  ('Kızılcahamam', 'kizilcahamam', 1),
  ('Bolu', 'bolu', 2),
  ('Afyon', 'afyon', 3),
  ('Diğer', 'diger', 4);

-- Yeni örnek ilanlar
INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Eliz Termal',
  'Kızılcahamam''da termal tatil imkanı. Spa, havuz ve konforlu konaklama seçenekleri.',
  l.id,
  'kiralama',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'kizilcahamam';

INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Narven Termal',
  'Bolu''da doğayla iç içe termal tatil. Aileler için ideal devremülk seçenekleri.',
  l.id,
  'kiralama',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'bolu';

INSERT INTO listings (title, description, location_id, listing_type, image_url, featured)
SELECT
  'Özgül Termal',
  'Afyon''da kaplıca ve termal tedavi imkanlarıyla huzurlu bir tatil deneyimi.',
  l.id,
  'satış',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  true
FROM locations l WHERE l.slug = 'afyon';
