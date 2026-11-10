# EduSphere – Integrated School Management & E-Learning System
### Resmi untuk: SMA PGRI 4 GANDRUNGMANGU

Platform digital komprehensif untuk tata kelola akademik, administrasi sekolah, dan kegiatan pembelajaran terpadu SMA/SMK berbasis **Kurikulum Merdeka** dan sistem nilai terstandarisasi.

---

## 🏛️ Identitas Resmi Sekolah
- **Nama Sekolah**: SMA PGRI 4 GANDRUNGMANGU
- **NPSN**: 20300645
- **Status Akreditasi**: B (BAN-S/M)
- **Yayasan**: Yayasan Pembina Lembaga Pendidikan Dasar & Menengah PGRI Cilacap
- **Alamat**: Jl. Raya Gandrungmangu No. 4, Gandrungmangu, Kec. Gandrungmangu, Kab. Cilacap, Jawa Tengah 53254
- **Telepon**: (0280) 6260123
- **Email**: smapgri4gandrungmangu@gmail.com
- **Kepala Sekolah**: H. Supriyanto, S.Pd., M.M. (NIP. 19680512 199403 1 008)

---

## 🚀 Fitur Unggulan Sistem

### 1. Sistem 9 Role dengan Role-Based Access Control (RBAC)
Sistem memiliki 9 peran yang masing-masing memiliki hak akses, dashboard, dan kontrol backend:
1. **Super Admin / Admin Sekolah**: Pengelolaan konfigurasi sistem, akun pengguna, database snapshot, dan audit log.
2. **Kepala Sekolah**: Pemantauan eksekutif kinerja sekolah, rekapitulasi nilai dan presensi, supervisi KBM.
3. **Wakasek Bidang Kurikulum**: Manajemen kurikulum, kalender akademik, rombongan belajar, dan jadwal pelajaran.
4. **Guru Mata Pelajaran**: Pengelolaan materi modul ajar, tugas, bank soal, penilaian CBT, dan rekap nilai.
5. **Wali Kelas (Homeroom)**: Pembinaan kelas (XI MIPA 1), input catatan sikap, evaluasi kenaikan kelas, dan penerbitan rapor.
6. **Guru BK (Bimbingan Konseling)**: Konseling rahasia siswa, pencatatan pelanggaran tata tertib, reward prestasi.
7. **Siswa**: Ruang kelas digital, pengumpulan tugas teks/file, pengerjaan ujian online CBT berbasis timer, akses rapor.
8. **Orang Tua / Wali Murid**: Monitoring nilai anak, kehadiran real-time, jadwal belajar, dan catatan wali kelas.
9. **Operator Sekolah**: Sinkronisasi data Dapodik Kemdikbud, verifikasi NISN/NIP, dan administrasi siswa/guru.

### 2. Modul-Modul Utama
- **Dashboard Interaktif**: Statistik real-time, grafik Recharts tren kehadiran dan distribusi nilai, jadwal pelajaran hari ini, warta pengumuman.
- **Manajemen Pengguna (User Management)**: CRUD lengkap Siswa, Guru, Staff, Orang Tua, toggle aktif/nonaktif, reset password, dan Export CSV.
- **Manajemen Akademik**: Pengaturan Tahun Ajaran (2024/2025 Genap), Rombel (X, XI, XII), Mata Pelajaran, Jadwal KBM, dan Kalender Pendidikan.
- **Ruang Belajar Digital (E-Learning)**: Modul ajar, silabus, dokumen materi PDF/Word, video pembelajaran, serta forum diskusi tanya jawab.
- **Manajemen Tugas**: Pembuatan tugas berbobot nilai, pengumpulan tugas digital siswa, koreksi guru, dan umpan balik nilai.
- **Ujian Online CBT (Computer Based Test)**: Bank soal pilihan ganda, benar/salah, essay, countdown timer otomatis, acak soal & opsi, serta auto-grading.
- **Manajemen Nilai**: Perhitungan bobot nilai otomatis (Tugas, Kuis, PTS, PAS/SAS, Praktik), kalkulasi Nilai Akhir (NA) dan Predikat (A/B/C/D), serta ekspor CSV.
- **Manajemen Absensi**: Pencatatan presensi Hadir, Sakit, Izin, Alpa dengan persentase kehadiran sekolah real-time.
- **Rapor Digital Kurikulum Merdeka**: Format dokumen resmi lengkap dengan Kop Surat SMA PGRI 4 Gandrungmangu, capaian kompetensi, kehadiran, ekstrakurikuler, catatan wali kelas, tanda tangan kepala sekolah, dan siap dicetak/PDF (`window.print()`).
- **Kesiswaan & BK**: Buku konseling rahasia terenkripsi, poin pelanggaran tata tertib, dan poin penghargaan prestasi.
- **Perpustakaan Digital**: Katalog buku teks Kemdikbudristek, pembaca e-book modul digital, sirkulasi peminjaman dan pengembalian buku.
- **Modul Vokasi & PKL**: Pencatatan kemitraan industri, pembimbing sekolah & dunia usaha, dan rekap nilai magang.
- **Pengaturan & Branding**: Penggantian identitas sekolah, unggah logo kustom sekolah dengan preview langsung, backup/restore JSON, dan audit logs.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)
- **Frontend Framework**: React 19 / Next.js compatible architecture with TypeScript
- **Styling**: Tailwind CSS v4 dengan Plus Jakarta Sans & JetBrains Mono typography
- **Data Visualization**: Recharts (Line Charts & Bar Charts)
- **Icons**: Lucide React
- **Full-Stack Server**: Express.js REST API dengan persistent file-based JSON database (`data/edusphere_db.json`)
- **Database Engine Target**: Supabase PostgreSQL dengan 38+ tabel relasional dan Row Level Security (RLS)

---

## 📁 Struktur Direktori Project

```text
├── database/
│   ├── supabase_schema.sql         # 38+ tabel, foreign key, constraint, indexes, dan RLS policies
│   └── migrations/
│       └── 001_initial_schema.sql  # SQL migration script untuk Supabase CLI
├── data/
│   └── edusphere_db.json           # File basis data persistent server-side
├── src/
│   ├── assets/
│   │   └── images/                 # Aset foto kampus & lambang resmi sekolah
│   ├── components/
│   │   ├── common/
│   │   │   └── Letterhead.tsx      # Kop Surat Resmi SMA PGRI 4 Gandrungmangu
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Top bar contract & role switcher
│   │   │   └── Sidebar.tsx         # Sidebar navigasi terfilter hak akses
│   │   ├── landing/
│   │   │   └── LandingPage.tsx     # Landing page publik profil sekolah & akses masuk
│   │   ├── dashboard/
│   │   │   └── RoleDashboard.tsx   # Dashboard dinamis 9 role dengan grafik Recharts
│   │   └── modules/
│   │       ├── UserManagement.tsx
│   │       ├── AcademicManagement.tsx
│   │       ├── LearningClassroom.tsx
│   │       ├── AssignmentModule.tsx
│   │       ├── OnlineExamModule.tsx
│   │       ├── GradeManagement.tsx
│   │       ├── AttendanceModule.tsx
│   │       ├── HomeroomModule.tsx
│   │       ├── ReportCardModule.tsx
│   │       ├── CounselingModule.tsx
│   │       ├── ParentDashboardModule.tsx
│   │       ├── LibraryModule.tsx
│   │       ├── VocationalModule.tsx
│   │       ├── CommunicationModule.tsx
│   │       ├── ReportsModule.tsx
│   │       └── SettingsModule.tsx
│   ├── data/
│   │   └── initialData.ts          # Seed data resmi SMA PGRI 4 Gandrungmangu
│   ├── lib/
│   │   ├── auth.ts                 # RBAC permission checks & role labels
│   │   └── storage.ts              # Service sinkronisasi REST API server
│   ├── types/
│   │   └── database.ts             # TypeScript definitions sesuai schema DB
│   ├── App.tsx                     # Aplikasi utama
│   ├── index.css                   # Global CSS & Tailwind styling
│   └── main.tsx                    # Entry point React
├── server.ts                       # Express backend API & Vite middleware
├── .env.example                    # Template environment variables
├── package.json                    # Konfigurasi dependensi & npm scripts
├── tsconfig.json
├── vite.config.ts
└── README.md                       # Dokumentasi lengkap sistem
```

---

## 💻 Panduan Menjalankan Secara Lokal

### Prasyarat
- Node.js (versi 18 ke atas)
- npm atau pnpm atau bun

### Langkah Instalasi
1. Clone repositori:
   ```bash
   git clone https://github.com/your-username/edusphere-sma-pgri-4-gandrungmangu.git
   cd edusphere-sma-pgri-4-gandrungmangu
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment:
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Jalankan Development Server:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada: `http://localhost:3000`

---

## 🗄️ Panduan Konfigurasi Supabase PostgreSQL

1. Buat project baru di [Supabase Console](https://supabase.com).
2. Buka menu **SQL Editor** pada project Supabase Anda.
3. Buka file `/database/supabase_schema.sql` pada repositori ini.
4. Salin seluruh isi SQL dan jalankan di SQL Editor Supabase.
   - Script akan membuat 38 tabel relasional lengkap: `profiles`, `roles`, `students`, `teachers`, `classes`, `subjects`, `assignments`, `exams`, `grades`, `attendance`, `report_cards`, `counseling_records`, `library_books`, `internships`, dll.
   - Script juga secara otomatis mengaktifkan **Row Level Security (RLS)** dan membuat policies keamanan data.
5. Salin URL dan Kunci API dari menu **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   Masukkan nilai tersebut ke dalam file `.env.local`.

---

## 🚀 Panduan Deploy ke Vercel

1. Pastikan kode telah di-push ke GitHub:
   ```bash
   git add .
   git commit -m "feat: complete EduSphere SMA PGRI 4 Gandrungmangu system"
   git push origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com) dan klik **Add New > Project**.
3. Hubungkan ke repositori GitHub Anda.
4. Pada bagian **Environment Variables**, tambahkan variabel sesuai `.env.example`:
   - `NEXT_PUBLIC_SCHOOL_NAME`: `SMA PGRI 4 GANDRUNGMANGU`
   - `NEXT_PUBLIC_SUPABASE_URL`: *(URL Supabase Anda)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Anon Key Supabase Anda)*
5. Klik tombol **Deploy**. Vercel akan mem-build dan menyebarkan website secara otomatis.

---

## 🔒 Hak Cipta & Lisensi
Sistem E-Learning & Manajemen Sekolah ini dikembangkan khusus untuk **SMA PGRI 4 GANDRUNGMANGU**, Kabupaten Cilacap, Jawa Tengah. Hak cipta dilindungi undang-undang.
