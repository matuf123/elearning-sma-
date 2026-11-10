import React, { useState } from 'react';
import {
  Settings,
  Upload,
  CheckCircle2,
  Shield,
  Database,
  Download,
  RotateCcw,
  Building,
  History,
} from 'lucide-react';
import { SchoolSetting, AuditLogItem, Profile } from '../../types/database';

interface SettingsModuleProps {
  settings: SchoolSetting;
  auditLogs: AuditLogItem[];
  currentUser: Profile;
  onSaveSettings: (updated: SchoolSetting) => void;
  onResetDatabase: () => void;
  onExportDatabaseJson: () => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  auditLogs,
  currentUser,
  onSaveSettings,
  onResetDatabase,
  onExportDatabaseJson,
  onLogAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'identitas' | 'logo' | 'audit' | 'database'>('identitas');
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [npsn, setNpsn] = useState(settings.npsn);
  const [accreditation, setAccreditation] = useState(settings.accreditation);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phoneNumber);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [principalName, setPrincipalName] = useState(settings.principalName);
  const [principalNip, setPrincipalNip] = useState(settings.principalNip);
  const [academicYear, setAcademicYear] = useState(settings.activeAcademicYear);
  const [semester, setSemester] = useState(settings.activeSemester);
  const [customLogoUrl, setCustomLogoUrl] = useState(settings.logoUrl);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolSetting = {
      ...settings,
      schoolName,
      npsn,
      accreditation,
      address,
      phoneNumber: phone,
      email,
      website,
      principalName,
      principalNip,
      activeAcademicYear: academicYear,
      activeSemester: semester,
    };
    onSaveSettings(updated);
    onLogAudit('UPDATE_PENGATURAN_SEKOLAH', 'Identitas Sekolah', 'Memperbarui profil resmi sekolah');
    showNotice('Pengaturan identitas sekolah berhasil diperbarui.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomLogoUrl(result);
        const updated: SchoolSetting = {
          ...settings,
          logoUrl: result,
        };
        onSaveSettings(updated);
        onLogAudit('UPLOAD_LOGO_SEKOLAH', 'Logo Resmi', `Mengunggah logo baru: ${file.name}`);
        showNotice('Logo sekolah berhasil diperbarui dan diterapkan ke seluruh dokumen!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultLogo = () => {
    const defaultLogo = '/src/assets/images/school_emblem_1794204647075.jpg';
    setCustomLogoUrl(defaultLogo);
    onSaveSettings({
      ...settings,
      logoUrl: defaultLogo,
    });
    onLogAudit('RESET_LOGO', 'Logo Sekolah', 'Mengembalikan logo ke lambang pendidikan standar');
    showNotice('Logo berhasil dikembalikan ke lambang pendidikan standar.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Pengaturan Sistem & Identitas Sekolah
          </h1>
          <p className="text-xs text-slate-500">
            Konfigurasi Profil Resmi, Upload Logo Sekolah, Audit Log Keamanan, dan Cadangan Basis Data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportDatabaseJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Backup Data JSON</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('identitas')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
            activeTab === 'identitas'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Identitas Sekolah Resmi
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upload Logo Sekolah
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Log Aktivitas ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
            activeTab === 'database'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manajemen Basis Data
        </button>
      </div>

      {/* TAB 1: IDENTITAS */}
      {activeTab === 'identitas' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-3xl">
          <form onSubmit={handleSaveIdentity} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah *</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Pokok Sekolah Nasional (NPSN) *</label>
                <input
                  type="text"
                  required
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Akreditasi BAN-S/M</label>
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester Aktif</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Situs Web</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={principalNip}
                  onChange={(e) => setPrincipalNip(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Simpan Perubahan Identitas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: UPLOAD LOGO */}
      {activeTab === 'logo' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pengaturan Lambang & Logo Sekolah
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Logo ini secara otomatis digunakan pada Kop Surat laporan resmi, lembar Rapor Digital, Navbar, dan Halaman Login SMA PGRI 4 GANDRUNGMANGU.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-28 h-28 rounded-2xl bg-white border border-slate-300 p-2 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src={customLogoUrl || '/src/assets/images/school_emblem_1794204647075.jpg'}
                alt="Logo Sekolah Saat Ini"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3 flex-1 text-xs">
              <div>
                <h4 className="font-bold text-slate-900">Unggah Logo Resmi Baru:</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Format didukung: PNG, JPG, WEBP, atau SVG beresolusi tinggi dengan latar belakang transparan/putih.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Berkas Logo...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Gunakan Lambang Standar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 uppercase">Jejak Audit Aktivitas Sistem</span>
            <span className="text-slate-500">Mencatat riwayat login, perubahan nilai, dan administrasi</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Aktivitas</th>
                <th className="px-4 py-3">Sumber Daya</th>
                <th className="px-4 py-3">Rincian Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{log.userName}</p>
                    <p className="text-[10px] text-slate-400">{log.userRole}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{log.resource}</td>
                  <td className="px-4 py-3 text-slate-600 text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: DATABASE */}
      {activeTab === 'database' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Manajemen & Cadangan Basis Data
            </h3>
            <p className="text-slate-500 mt-1">
              Data tersimpan secara persisten pada backend server (/api/database) dan dapat disinkronkan dengan Supabase PostgreSQL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900">Ekspor Cadangan (Backup JSON):</h4>
            <p className="text-slate-600 text-[11px]">
              Simpan seluruh snapshot data sekolah: profil pengguna, jadwal, nilai rapor, tugas, dan bank soal ke format file JSON terenkripsi.
            </p>
            <button
              onClick={onExportDatabaseJson}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Snapshot Database (.json)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
            <h4 className="font-bold text-rose-900">Setel Ulang Data Demonstrasi:</h4>
            <p className="text-rose-700 text-[11px]">
              Mengembalikan seluruh data ke kondisi awal seed SMA PGRI 4 GANDRUNGMANGU. Tindakan ini akan menghapus data percobaan baru.
            </p>
            <button
              onClick={() => {
                if (confirm('Yakin ingin mereset seluruh database ke data awal SMA PGRI 4 Gandrungmangu?')) {
                  onResetDatabase();
                  showNotice('Database berhasil direset ke kondisi awal.');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Seed Awal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
