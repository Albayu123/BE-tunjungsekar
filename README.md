# Backend API — Web Profil Kampung Mbois RW 01 Kelurahan Tunjungsekar

Backend REST API resmi untuk **Web Profil Kampung Mbois RW 01 Kelurahan Tunjungsekar, Kecamatan Lowokwaru, Kota Malang**. Memfasilitasi pengelolaan profil wilayah, pengurus RW, berita & pengumuman, agenda kegiatan warga, galeri foto dokumentasi, dan data 11 RT beserta prestasinya.

---

## 🚀 Tech Stack

- **Runtime & Language**: Node.js (TypeScript, CommonJS)
- **Framework**: Express.js (Express v5 dengan *Native Async Error Handling*)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma v7 (dengan `prisma.config.ts` & Prisma Client)
- **Authentication**: JWT (*Single-role Admin* dengan `bcryptjs`)
- **Image Storage**: Supabase Storage (Bucket `gallery`)
- **Interactive Documentation**: Swagger UI (`swagger-ui-express` di `/docs`)
- **Testing Framework**: Vitest
- **Linter & Formatter**: ESLint

---

## ✨ Fitur Utama & API Endpoints

 Seluruh rute diawali dengan Base URL: `/api/v1`

### 1. Dokumentasi Interactive & Health Check
- `GET /health` — Health check server
- `GET /docs` — Swagger UI Dokumentasi API interaktif

### 2. Autentikasi Admin (`/auth`)
- `POST /api/v1/auth/login` — Login admin & penerbitan token JWT
- `GET /api/v1/auth/me` — Ambil profil admin login (*membutuhkan JWT*)

### 3. Profil RW 01 (`/profile`)
- `GET /api/v1/profile` — Ambil data profil RW (Sejarah, Visi, Misi, Alamat, Kontak)
- `PUT /api/v1/admin/profile` — Update profil RW (*membutuhkan JWT*)

### 4. Pengurus RW / Bagian Organisasi (`/organization-members`)
- `GET /api/v1/organization-members` — Daftar pengurus terurut (`orderIndex`)
- `POST /api/v1/admin/organization-members` — Tambah pengurus (*membutuhkan JWT*)
- `PUT /api/v1/admin/organization-members/:id` — Update pengurus (*membutuhkan JWT*)
- `DELETE /api/v1/admin/organization-members/:id` — Hapus pengurus (*membutuhkan JWT*)

### 5. Data 11 RT & Prestasi (`/rts`)
- `GET /api/v1/rts` — Daftar 11 RT (support filter `?is_featured=true`)
- `GET /api/v1/rts/:id` — Detail RT berdasarkan ID
- `POST /api/v1/admin/rts` — Tambah data RT (*membutuhkan JWT*)
- `PUT /api/v1/admin/rts/:id` — Update data/prestasi RT (*membutuhkan JWT*)
- `DELETE /api/v1/admin/rts/:id` — Hapus data RT (*membutuhkan JWT*)

### 6. Berita & Pengumuman (`/announcements`)
- `GET /api/v1/announcements` — Daftar berita/pengumuman (support pagination `?page=&limit=` & filter `?category=berita|pengumuman`)
- `GET /api/v1/announcements/:slug` — Detail berita berdasarkan slug
- `POST /api/v1/admin/announcements` — Buat berita/pengumuman (*membutuhkan JWT*)
- `PUT /api/v1/admin/announcements/:id` — Update berita (*membutuhkan JWT*)
- `DELETE /api/v1/admin/announcements/:id` — Hapus berita (*membutuhkan JWT*)

### 7. Agenda Kegiatan (`/events`)
- `GET /api/v1/events` — Daftar kegiatan (support pagination `?page=&limit=` & filter `?status=upcoming|ongoing|done`)
- `GET /api/v1/events/:id` — Detail kegiatan
- `POST /api/v1/admin/events` — Buat agenda baru (*membutuhkan JWT*)
- `PUT /api/v1/admin/events/:id` — Update agenda (*membutuhkan JWT*)
- `DELETE /api/v1/admin/events/:id` — Hapus agenda (*membutuhkan JWT*)

### 8. Galeri Foto Dokumentasi (`/gallery`)
- `GET /api/v1/gallery` — Daftar foto (support pagination `?page=&limit=` & filter `?event_id=`)
- `POST /api/v1/admin/gallery` — Upload foto ke Supabase Storage & simpan URL (*multipart/form-data*, *membutuhkan JWT*)
- `DELETE /api/v1/admin/gallery/:id` — Hapus foto dari database & Supabase (*membutuhkan JWT*)

---

## 🔒 Keamanan & Arsitektur

1. **Row Level Security (RLS) Database**:
   - Seluruh 7 tabel PostgreSQL (`users`, `profiles`, `organization_members`, `announcements`, `events`, `gallery`, `rts`, `_prisma_migrations`) dilindungi dengan **RLS Enabled** dan `REVOKE ALL FROM anon, authenticated`. Akses PostgREST publik diblokir total, traffic hanya diperbolehkan via Prisma backend connection.
2. **YAGNI Lean Architecture (Ponytail Mode)**:
   - Menggunakan struktur direct **Route → Controller** (akses Prisma langsung), tanpa layer service berlebihan. Express 5 menangani async error secara *native*.
3. **Data Resmi Kampung Mbois**:
   - Seeder (`scripts/seed_dummy.ts`) terisi data resmi Kampung Mbois RW 01 (18 pengurus SK Lurah 2023-2028, 11 RT dengan branding tematik & prestasi, berita STBM Award, serta 7 foto asli di Supabase Storage).

---

## 🛠️ Panduan Instalasi & Pengembangan Lokal

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd BE-desa
npm install
```

### 2. Environment Variables (`.env`)
Buat file `.env` di direktori root dengan konfigurasi berikut:

```env
PORT=3000
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@db.<project-ref>.supabase.co:5432/postgres"
JWT_SECRET="rahasia_jwt_super_aman"
JWT_EXPIRES_IN="7d"
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
FRONTEND_URL="http://localhost:5173"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Seed Data Resmi Kampung Mbois
```bash
npm run seed:dummy
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`. Akses Swagger UI di `http://localhost:3000/docs`.

---

## 🧪 Testing & Quality Gate

```bash
# Jalankan test suite Vitest
npm run test

# Jalankan linter ESLint (0 errors, 0 warnings)
npm run lint
```

---

## 📁 Struktur Direktori

```
BE-desa/
├── api/                # Vercel Serverless handler (api/index.ts)
├── src/
│   ├── controllers/    # Handler logika & Prisma query langsung
│   ├── docs/           # Specifications (openapi.json)
│   ├── lib/            # Singleton Prisma (db.ts), Supabase (supabase.ts), AppError
│   ├── middlewares/    # Auth JWT & Error Handler
│   ├── routes/         # Definisi rute per resource
│   ├── app.ts          # Aplikasi Express utama
│   ├── server.ts       # Entry point dev/production
│   └── cluster.ts      # Cluster mode (opsional)
├── prisma/
│   ├── migrations/     # File histori SQL migration
│   └── schema.prisma   # Schema Prisma v7
├── scripts/            # Script seeder data resmi
├── tests/              # Vitest test suite
├── doc-project/        # Dokumentasi pendukung (SOP, AGENTS, SPEC)
└── prisma.config.ts    # Prisma v7 Root Config
```

---

## 📝 Lisensi

Proyek ini dikembangkan untuk kebutuhan kegiatan KKN & Serah Terima Pengurus RW 01 Kelurahan Tunjungsekar, Kota Malang.
