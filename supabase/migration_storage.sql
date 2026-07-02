-- İlan görselleri için Supabase Storage bucket
-- SQL Editor'da çalıştırın (schema.sql'den sonra)

-- 1) Bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2) Varsa eski kısıtları temizle
UPDATE storage.buckets
SET allowed_mime_types = NULL, file_size_limit = 5242880
WHERE id = 'listing-images';

-- 3) Bucket gerçekten var mı kontrol et (yoksa hata verir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'listing-images') THEN
    RAISE EXCEPTION 'listing-images bucket oluşturulamadı. Dashboard > Storage > New bucket ile manuel oluşturun.';
  END IF;
END $$;

-- 4) Storage politikaları
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

-- 5) Sonuç (1 satır görmelisiniz: listing-images | true)
SELECT id, name, public FROM storage.buckets WHERE id = 'listing-images';
