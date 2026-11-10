import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  LogIn,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Laptop,
  CheckSquare,
  Library,
  Sparkles,
} from 'lucide-react';
import { SchoolSetting, Profile, Announcement, UserRole } from '../../types/database';
import { ROLE_LABELS } from '../../lib/auth';

interface LandingPageProps {
  settings: SchoolSetting;
  profiles: Profile[];
  announcements: Announcement[];
  onLoginAsRole: (profile: Profile) => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  settings,
  profiles,
  announcements,
  onLoginAsRole,
  onEnterDashboard,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Notification Strip */}
      <div className="bg-blue-950 text-blue-200 text-xs py-2 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide uppercase">
              {settings.schoolName}
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">NPSN: {settings.npsn} &middot; Terakreditasi {settings.accreditation}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Semester Genap 2024/2025</span>
            <span className="text-emerald-400">&bull; CBT Server Siap</span>
          </div>
        </div>
      </div>

      {/* Main Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl || '/src/assets/images/school_emblem_1794204647075.jpg'}
              alt="Logo SMA PGRI 4 Gandrungmangu"
              className="w-10 h-10 object-contain rounded-full border border-slate-200 p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-lg font-extrabold tracking-tight text-blue-950 block leading-tight">
                EduSphere
              </span>
              <span className="text-xs font-semibold text-slate-500 block leading-tight">
                {settings.schoolName}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#tentang" className="hover:text-blue-900 transition-colors">Profil Sekolah</a>
            <a href="#fitur" className="hover:text-blue-900 transition-colors">Fitur Terpadu</a>
            <a href="#pengumuman" className="hover:text-blue-900 transition-colors">Pengumuman</a>
            <a href="#kontak" className="hover:text-blue-900 transition-colors">Informasi Kontak</a>
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Sistem</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Portal Resmi Pembelajaran Digital & Administrasi Sekolah</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Mewujudkan Generasi Unggul Berkarakter di <span className="text-blue-900">SMA PGRI 4 GANDRUNGMANGU</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                EduSphere mengintegrasikan seluruh ekosistem akademik sekolah: Ruang Kelas Digital, CBT Ujian Online, Penilaian Kurikulum Merdeka, Presensi Real-Time, Monitoring Bimbingan Konseling, dan Rapor Digital terpadu untuk 9 peran pengguna.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Buka Dashboard EduSphere</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#tentang"
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
                >
                  Profil & Visi Sekolah
                </a>
              </div>

              {/* Quick stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-slate-700">
                <div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">450+</p>
                  <p className="text-xs text-slate-500">Siswa Aktif</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">32</p>
                  <p className="text-xs text-slate-500">Guru & Staf</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">12</p>
                  <p className="text-xs text-slate-500">Rombongan Belajar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">Grade B</p>
                  <p className="text-xs text-slate-500">Terakreditasi BAN-S/M</p>
                </div>
              </div>
            </div>

            {/* Right Campus Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-900">
                <img
                  src="/src/assets/images/hero_school_campus_1794204631473.jpg"
                  alt="Kampus SMA PGRI 4 Gandrungmangu"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Gandrungmangu, Cilacap, Jawa Tengah
                  </span>
                  <p className="text-sm font-semibold mt-1">
                    Gedung Utama & Laboratorium SMA PGRI 4 GANDRUNGMANGU
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Profile & Identity */}
      <section id="tentang" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-wider text-blue-900 uppercase">
              Identitas & Visi Sekolah
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Mengenal Lebih Dekat {settings.schoolName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Berada di bawah naungan Yayasan Pembina Lembaga Pendidikan PGRI Cilacap, berkomitmen menyelenggarakan pendidikan menengah atas yang berkualitas dan berdaya saing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-900 mb-4 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Visi Sekolah</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                "Terwujudnya peserta didik SMA PGRI 4 Gandrungmangu yang beriman, bertaqwa, berakhlak mulia, unggul dalam prestasi akademik, berwawasan iptek, serta berjiwa mandiri dan wirausaha."
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-900 mb-4 font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Misi Utama</h4>
              <ul className="text-xs text-slate-600 mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Menanamkan nilai-nilai religius dan profil pelajar Pancasila.</li>
                <li>Melaksanakan pembelajaran berbasis digital dan kurikulum merdeka.</li>
                <li>Mengembangkan minat, bakat, riset sains, dan kesiapan studi lanjut ke Perguruan Tinggi.</li>
                <li>Membangun kemitraan dengan perguruan tinggi dan lembaga pendidikan terkemuka.</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900 mb-4 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Pimpinan & Tenaga Ahli</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                <strong>Kepala Sekolah:</strong> {settings.principalName}<br />
                <strong>NIP:</strong> {settings.principalNip}<br />
                <strong>Didukung:</strong> 24 Guru Bersertifikasi Pendidik, Staf Tata Usaha, dan Konselor Bimbingan Konseling yang berdedikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / 9 Roles */}
      <section id="fitur" className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-wider text-blue-900 uppercase">
              Fitur Lengkap EduSphere
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Sistem Manajemen Sekolah & Pembelajaran Berbasis 9 Peran
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Setiap pihak sekolah memiliki modul dan antarmuka khusus yang dirancang sesuai tupoksi kerjanya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ruang Kelas Digital & Materi</h4>
                  <span className="text-[11px] text-slate-500">Guru & Siswa</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modul ajar interaktif, materi PDF/dokumen, video pembelajaran, silabus, dan forum diskusi dua arah antar guru dan siswa.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ujian Online CBT & Bank Soal</h4>
                  <span className="text-[11px] text-slate-500">Ulangan, PTS, PAS</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistem ujian dengan timer, pengacakan soal dan opsi, penilaian otomatis pilihan ganda, koreksi essay, dan anti-curang.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-900">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Rapor Digital Kurikulum Merdeka</h4>
                  <span className="text-[11px] text-slate-500">Wali Kelas & Orang Tua</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyusunan capaian pembelajaran, catatan sikap, ekstrakurikuler, dan cetak PDF resmi lengkap dengan Kop Surat SMA PGRI 4 Gandrungmangu.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Absensi & Presensi Terpadu</h4>
                  <span className="text-[11px] text-slate-500">Harian & Rekap Bulanan</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencatatan kehadiran Hadir, Sakit, Izin, Alpa, persentase kehadiran real-time, dan pemantauan langsung oleh orang tua murid.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-900">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Kesiswaan & BK Rahasia</h4>
                  <span className="text-[11px] text-slate-500">Guru BK & Kepala Sekolah</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencatatan konseling terenkripsi, poin pelanggaran tata tertib, reward prestasi siswa, dan bimbingan karir masa depan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Perpustakaan & Mapel Pilihan</h4>
                  <span className="text-[11px] text-slate-500">Buku Teks & Peminatan Fase F</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Katalog buku teks resmi Kemdikbud, e-book reader terintegrasi, sirkulasi peminjaman, serta pemetaan mata pelajaran pilihan Fase F untuk sukses SNBP & SNBT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="pengumuman" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xs font-bold tracking-wider text-blue-900 uppercase">
                Informasi & Warta Sekolah
              </h2>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Pengumuman Terbaru {settings.schoolName}
              </h3>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 self-start cursor-pointer"
            >
              Lihat seluruh arsip pengumuman <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span className="font-semibold text-blue-900 uppercase">{item.authorRole}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-4 leading-relaxed">
                    {item.content}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] font-medium text-slate-500">
                  Diumumkan oleh: <span className="font-semibold text-slate-700">{item.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="kontak" className="py-12 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Pusat Informasi & Pelayanan
              </span>
              <h3 className="text-2xl font-bold text-white">
                {settings.schoolName}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Melayani pertanyaan calon siswa, koordinasi orang tua murid, dan kemitraan pendidikan formal maupun kejuruan di wilayah Kabupaten Cilacap dan sekitarnya.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{settings.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{settings.email}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2">Akses Cepat Pengguna</h4>
              <p className="text-xs text-slate-400 mb-4">
                Pilih peran Anda untuk langsung masuk ke dashboard operasional tanpa perlu mengetik ulang sandi:
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Panel Masuk Sistem</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">
              EduSphere &copy; {new Date().getFullYear()} {settings.schoolName}
            </p>
            <p className="text-[11px] text-slate-500">
              Sistem Manajemen Sekolah & E-Learning Terpadu &middot; Hak Cipta Dilindungi Undang-Undang
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NPSN: {settings.npsn}</span>
            <span>&middot;</span>
            <span>Cilacap, Jawa Tengah</span>
          </div>
        </div>
      </footer>

      {/* Login Modal with 9 Roles Quick Selector */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={settings.logoUrl || '/src/assets/images/school_emblem_1794204647075.jpg'}
                  alt="Logo Sekolah"
                  className="w-9 h-9 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Masuk ke EduSphere
                  </h3>
                  <p className="text-xs text-slate-500">
                    {settings.schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Pilih Akun Berdasarkan Peran (9 Role Tersedia):
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Sistem menyediakan akses siap-uji untuk seluruh 9 peran di bawah:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
                  {profiles.map((p) => {
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onLoginAsRole(p);
                          setShowLoginModal(false);
                          onEnterDashboard();
                        }}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-900 truncate">
                          {p.fullName}
                        </p>
                        <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                          {ROLE_LABELS[p.role]}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {p.nipNisn || p.email}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
