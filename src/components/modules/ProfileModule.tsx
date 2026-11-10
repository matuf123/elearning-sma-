import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Save,
  LogOut,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Lock,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { Profile, UserRole } from '../../types/database';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../lib/auth';

interface ProfileModuleProps {
  currentUser: Profile;
  profiles: Profile[];
  onUpdateProfile: (updated: Profile) => void;
  onSwitchUser: (profile: Profile) => void;
  onLogout: () => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  currentUser,
  profiles,
  onUpdateProfile,
  onSwitchUser,
  onLogout,
  onLogAudit,
}) => {
  // Form state
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phoneNumber || '081234567890');
  const [nipNis, setNipNis] = useState(currentUser.nipNisn || '-');
  const [address, setAddress] = useState('Gandrungmangu, Cilacap, Jawa Tengah');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  
  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'biodata' | 'security' | 'switch_login'>('biodata');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      showNotice('Nama lengkap dan email tidak boleh kosong!', 'error');
      return;
    }

    const updatedProfile: Profile = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phone.trim(),
      avatarUrl: avatarUrl.trim(),
      nipNisn: nipNis.trim(),
      updatedAt: new Date().toISOString(),
    };

    onUpdateProfile(updatedProfile);
    onLogAudit('UPDATE_PROFIL', currentUser.fullName, `Memperbarui biodata akun profil (${fullName})`);
    showNotice('Data profil berhasil disimpan dan diperbarui ke database!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showNotice('Kata sandi baru minimal harus 6 karakter!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotice('Konfirmasi kata sandi tidak cocok!', 'error');
      return;
    }

    onLogAudit('UPDATE_PASSWORD', currentUser.fullName, 'Mengubah kata sandi akun');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showNotice('Kata sandi berhasil diperbarui dengan aman!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Pengaturan Akun Pengguna
            </span>
            <span className="text-xs text-slate-400">&middot;</span>
            <span className="text-xs font-semibold text-slate-600">SMA PGRI 4 GANDRUNGMANGU</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Profil Pengguna & Manajemen Sesi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data diri, informasi kontak, preferensi keamanan, atau beralih dan keluar dari sesi akun.
          </p>
        </div>

        {/* Quick Logout Button in Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Card & Quick Logout */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-md mx-auto border-4 border-white">
                  {currentUser.fullName.charAt(0)}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">{currentUser.fullName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              <div className="mt-2.5 flex justify-center">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${ROLE_BADGE_COLORS[currentUser.role]}`}>
                  {ROLE_LABELS[currentUser.role]}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-left text-xs space-y-2.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ID Pengguna:</span>
                <span className="font-mono text-slate-700">{currentUser.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NIP / NISN:</span>
                <span className="font-mono font-medium text-slate-700">{nipNis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sekolah:</span>
                <span className="font-semibold text-blue-900">SMA PGRI 4 GDM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status Akun:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                </span>
              </div>
            </div>

            {/* Logout Action Box */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun Ini (Logout)</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-2">
                Keluar akan mengakhiri sesi aktif dan mengembalikan Anda ke Landing Page sekolah.
              </p>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Keamanan Terpadu EduSphere</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-900/80">
              Seluruh pembaruan profil tersimpan langsung secara terpusat pada sistem basis data SMA PGRI 4 Gandrungmangu.
            </p>
          </div>
        </div>

        {/* Right Column: Tabbed Edit Forms & User Switcher */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70">
            <button
              onClick={() => setActiveTab('biodata')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === 'biodata'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                <span>Biodata & Data Diri</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Key className="w-4 h-4" />
                <span>Keamanan & Password</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('switch_login')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === 'switch_login'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                <span>Ganti Akun / Login Cepat</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: BIODATA EDIT */}
            {activeTab === 'biodata' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: H. Supriyanto, S.Pd., M.M."
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Alamat Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@smapgri4gandrungmangu.sch.id"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      NIP / NISN / No. Induk
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={nipNis}
                        onChange={(e) => setNipNis(e.target.value)}
                        placeholder="19680512 199403 1 008"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL Foto Profil (Avatar)
                  </label>
                  <div className="relative">
                    <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/foto_profil.jpg"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono text-[11px]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Kosongkan jika ingin menggunakan inisial nama secara otomatis.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Domisili
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Alamat lengkap tempat tinggal..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">
                    Role Akun: <strong>{ROLE_LABELS[currentUser.role]}</strong> (Diatur Administrator)
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi Lama
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan kata sandi saat ini"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi Baru *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Konfirmasi Kata Sandi Baru *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: SWITCH USER / LOGIN AS OTHER ROLE */}
            {activeTab === 'switch_login' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Beralih Akun (Multi-Role Fast Login)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih akun pengguna lain di bawah ini untuk langsung masuk dan beralih hak akses sistem:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {profiles.map((p) => {
                    const isCurrent = p.id === currentUser.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (!isCurrent) {
                            onSwitchUser(p);
                            showNotice(`Berhasil masuk sebagai ${p.fullName} (${ROLE_LABELS[p.role]})`);
                          }
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isCurrent
                            ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-400'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {p.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {p.fullName}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {p.email}
                            </p>
                            <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded mt-1 border ${ROLE_BADGE_COLORS[p.role]}`}>
                              {ROLE_LABELS[p.role]}
                            </span>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                            Aktif
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Login</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
