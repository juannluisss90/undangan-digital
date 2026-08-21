# 💌 UndanganKu - Website Jasa Undangan Digital

Platform undangan digital berbasis web dengan dashboard admin untuk pengelolaan pesanan, template, dan laporan bisnis.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Media**: Cloudinary
- **Payment**: Midtrans
- **Hosting**: Vercel

## Struktur Project

```
src/
├── app/
│   ├── (public)/              # Website undangan publik
│   │   ├── [slug]/            # Halaman undangan per pasangan
│   │   └── landing/           # Landing page utama
│   ├── (admin)/               # Dashboard admin (protected)
│   │   ├── dashboard/         # Statistik & ringkasan
│   │   ├── orders/            # Manajemen pesanan
│   │   ├── invitations/       # Editor konten undangan
│   │   ├── templates/         # Manajemen template
│   │   ├── payments/          # Riwayat pembayaran
│   │   └── reports/           # Laporan & grafik
│   ├── auth/login/            # Halaman login admin
│   └── api/                   # REST API routes
│       ├── orders/            # CRUD pesanan
│       ├── invitations/       # CRUD undangan
│       ├── rsvp/              # Konfirmasi kehadiran
│       ├── wishes/            # Ucapan tamu
│       ├── payments/midtrans/ # Webhook Midtrans
│       └── upload/            # Upload media Cloudinary
├── components/
│   ├── ui/                    # Komponen dasar (Button, Input, dll)
│   ├── invitation/            # Komponen halaman undangan
│   ├── admin/                 # Komponen dashboard admin
│   └── shared/                # Komponen berbagi
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Helper functions
├── types/                     # TypeScript types
├── hooks/                     # Custom React hooks
└── middleware.ts              # Auth protection middleware
```

## Cara Setup

### 1. Clone & Install
```bash
git clone [repo-url]
cd undangan-digital
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
# Isi semua variable di .env.local
```

### 3. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Roadmap

- [x] Setup project & struktur folder
- [x] Database schema (Prisma)
- [x] API routes dasar (orders, rsvp, wishes)
- [ ] Halaman undangan publik (template pertama)
- [ ] Dashboard admin (UI)
- [ ] Integrasi Midtrans
- [ ] Upload media Cloudinary
- [ ] Sistem notifikasi email
- [ ] Laporan & statistik
