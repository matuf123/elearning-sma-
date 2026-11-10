import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  KeyRound,
  Trash2,
  Edit2,
  FileSpreadsheet,
} from 'lucide-react';
import { Profile, UserRole, StudentDetail, TeacherDetail } from '../../types/database';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../lib/auth';

interface UserManagementProps {
  profiles: Profile[];
  students: StudentDetail[];
  teachers: TeacherDetail[];
  onSaveProfiles: (updated: Profile[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
  currentUser: Profile;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  profiles,
  students,
  teachers,
  onSaveProfiles,
  onLogAudit,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<Profile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('siswa');
  const [nipNisn, setNipNisn] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Filtering
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nipNisn && p.nipNisn.includes(searchTerm)) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (target: Profile) => {
    const updated = profiles.map((p) =>
      p.id === target.id ? { ...p, isActive: !p.isActive } : p
    );
    onSaveProfiles(updated);
    onLogAudit(
      'UPDATE_STATUS_PENGGUNA',
      target.fullName,
      `Status diubah menjadi: ${!target.isActive ? 'Aktif' : 'Nonaktif'}`
    );
    showNotice(`Status akun ${target.fullName} berhasil diperbarui.`);
  };

  const handleDeleteUser = (target: Profile) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pengguna: ${target.fullName}?`)) {
      const updated = profiles.filter((p) => p.id !== target.id);
      onSaveProfiles(updated);
      onLogAudit('HAPUS_PENGGUNA', target.fullName, `Menghapus akun dengan role: ${target.role}`);
      showNotice(`Akun ${target.fullName} berhasil dihapus.`);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !username) {
      alert('Nama lengkap, email, dan username wajib diisi!');
      return;
    }

    if (editingProfile) {
      const updated = profiles.map((p) =>
        p.id === editingProfile.id
          ? {
              ...p,
              fullName,
              username,
              email,
              role,
              nipNisn,
              gender,
              phoneNumber,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      onSaveProfiles(updated);
      onLogAudit('EDIT_PENGGUNA', fullName, `Memperbarui profil ${fullName} (${role})`);
      showNotice(`Profil ${fullName} berhasil disimpan.`);
    } else {
      const newProfile: Profile = {
        id: 'user-' + Date.now(),
        fullName,
        username,
        email,
        role,
        nipNisn,
        gender,
        phoneNumber,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSaveProfiles([newProfile, ...profiles]);
      onLogAudit('TAMBAH_PENGGUNA', fullName, `Menambahkan pengguna baru role: ${role}`);
      showNotice(`Pengguna baru ${fullName} berhasil ditambahkan ke database.`);
    }

    closeModal();
  };

  const openAddModal = () => {
    setEditingProfile(null);
    setFullName('');
    setUsername('');
    setEmail('');
    setRole('siswa');
    setNipNisn('');
    setGender('Laki-laki');
    setPhoneNumber('');
    setShowAddModal(true);
  };

  const openEditModal = (p: Profile) => {
    setEditingProfile(p);
    setFullName(p.fullName);
    setUsername(p.username);
    setEmail(p.email);
    setRole(p.role);
    setNipNisn(p.nipNisn || '');
    setGender(p.gender);
    setPhoneNumber(p.phoneNumber || '');
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProfile(null);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Nama Lengkap,Username,Email,Role,NIP/NISN,Jenis Kelamin,Status\n';
    const rows = filteredProfiles
      .map(
        (p) =>
          `"${p.id}","${p.fullName}","${p.username}","${p.email}","${p.role}","${p.nipNisn || ''}","${p.gender}","${p.isActive ? 'Aktif' : 'Nonaktif'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_pengguna_smapgri4gandrungmangu_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAudit('EXPORT_CSV_PENGGUNA', 'Data Pengguna', 'Export CSV data pengguna');
    showNotice('Data pengguna berhasil diekspor ke file CSV.');
  };

  const handleImportSimulate = () => {
    alert('Simulasi Import Excel/CSV: File template Dapodik telah divalidasi. 5 data siswa siap disinkronkan.');
    onLogAudit('IMPORT_DAPODIK', 'Dapodik Kemdikbud', 'Validasi berkas import data siswa');
    showNotice('Sinkronisasi import data berhasil divalidasi.');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Manajemen Pengguna Terpadu
          </h1>
          <p className="text-xs text-slate-500">
            Kelola akun Guru, Siswa, Wali Murid, dan Tenaga Kependidikan SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleImportSimulate}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV/Excel</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Notice alert */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP/NISN, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="all">Semua Peran ({profiles.length})</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru Mata Pelajaran</option>
            <option value="wali_kelas">Wali Kelas</option>
            <option value="guru_bk">Guru BK</option>
            <option value="kepala_sekolah">Kepala Sekolah</option>
            <option value="wakasek_kurikulum">Wakasek Kurikulum</option>
            <option value="orang_tua">Orang Tua / Wali</option>
            <option value="operator">Operator Sekolah</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Peran Sistem</th>
                <th className="px-4 py-3">NIP / NISN</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.fullName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${ROLE_BADGE_COLORS[user.role]}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                      {user.nipNisn || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{user.email}</p>
                      <p className="text-[10px] text-slate-400 tabular-nums">{user.phoneNumber || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                        title="Klik untuk mengubah status aktif/nonaktif"
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setResetPasswordUser(user)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredProfiles.length} dari {profiles.length} total pengguna</span>
          <span>SMA PGRI 4 GANDRUNGMANGU Data Base</span>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {editingProfile ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
            </h3>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Tri Haryanto, S.Pd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="tri_haryanto"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran Sistem *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru Mata Pelajaran</option>
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="guru_bk">Guru BK</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="wakasek_kurikulum">Wakasek Kurikulum</option>
                    <option value="orang_tua">Orang Tua</option>
                    <option value="operator">Operator Sekolah</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Aktif *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@smapgri4gandrungmangu.sch.id"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP / NISN</label>
                  <input
                    type="text"
                    value={nipNisn}
                    onChange={(e) => setNipNisn(e.target.value)}
                    placeholder="1980... / 0071..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200 text-center">
            <KeyRound className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              Reset Password Pengguna
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Atur ulang password untuk akun <strong>{resetPasswordUser.fullName}</strong>. Sandi default akan diatur menjadi: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-900 font-bold">PGRI4Gandrung#2025</code>
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setResetPasswordUser(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onLogAudit('RESET_PASSWORD', resetPasswordUser.fullName, 'Mereset password ke default');
                  showNotice(`Password untuk ${resetPasswordUser.fullName} berhasil direset.`);
                  setResetPasswordUser(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
              >
                Konfirmasi Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
