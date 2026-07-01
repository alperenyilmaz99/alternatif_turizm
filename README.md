# Alternatif Turizm Devremülk Merkezi

Devremülk kiralama ve satış platformu. Next.js, Supabase ve Vercel ile geliştirilmiştir.

## Özellikler

- Lokasyon bazlı ilan filtreleme (Eliz, Afyon, Antalya, Bodrum)
- Öne çıkan devremülk ilanları (Fırsatlar bölümü)
- Kullanıcı başvuru formu (kiralama/satış talepleri)
- Supabase veritabanı entegrasyonu
- Vercel'e tek tıkla deploy

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Supabase projesi oluşturun

1. [supabase.com](https://supabase.com) adresinde yeni proje oluşturun
2. SQL Editor'da `supabase/schema.sql` dosyasını çalıştırın
3. Project Settings > API bölümünden URL ve anon key'i alın

### 3. Ortam değişkenlerini ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın ve değerleri doldurun:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Supabase yapılandırılmadan site demo verilerle çalışır.

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Vercel'e Deploy

1. Projeyi GitHub'a push edin
2. [vercel.com](https://vercel.com) üzerinde yeni proje oluşturun
3. Environment Variables bölümüne Supabase anahtarlarını ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy edin

## Veritabanı Tabloları

| Tablo | Açıklama |
|-------|----------|
| `locations` | Lokasyonlar (Eliz, Afyon vb.) |
| `listings` | Devremülk ilanları |
| `submissions` | Kullanıcı başvuruları |

## Proje Yapısı

```
src/
├── app/
│   ├── api/submissions/   # Form API endpoint
│   ├── page.tsx           # Ana sayfa
│   └── layout.tsx
├── components/
│   ├── Header.tsx         # Site başlığı
│   ├── LocationFilter.tsx # Lokasyon filtreleri
│   ├── ListingCard.tsx    # İlan kartı
│   ├── ListingsSection.tsx# Fırsatlar bölümü
│   ├── SubmissionForm.tsx # Başvuru formu
│   └── ContactSection.tsx # Form + görsel alanı
├── lib/
│   ├── supabase/          # Supabase client
│   ├── data.ts            # Veri çekme fonksiyonları
│   └── demo-data.ts       # Demo veriler
└── types/
    └── database.ts        # TypeScript tipleri
```
