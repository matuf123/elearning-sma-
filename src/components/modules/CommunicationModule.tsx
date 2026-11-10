import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  Send,
  Pin,
  CheckCircle2,
  Trash2,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Announcement, Profile } from '../../types/database';

interface CommunicationModuleProps {
  announcements: Announcement[];
  currentUser: Profile;
  onSaveAnnouncements: (updated: Announcement[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  announcements,
  currentUser,
  onSaveAnnouncements,
  onLogAudit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<'semua' | 'guru' | 'siswa' | 'orang_tua'>('semua');
  const [notification, setNotification] = useState<string | null>(null);

  const canPost =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'kepala_sekolah' ||
    currentUser.role === 'wakasek_kurikulum' ||
    currentUser.role === 'operator';

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnc: Announcement = {
      id: 'anc-' + Date.now(),
      title,
      content,
      targetRole,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      date: new Date().toISOString().split('T')[0],
      isPinned: false,
    };

    onSaveAnnouncements([newAnc, ...announcements]);
    onLogAudit('PUBLISH_PENGUMUMAN', title, `Menerbitkan warta sekolah target: ${targetRole}`);
    showNotice('Pengumuman sekolah berhasil disiarkan.');
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const handleDeleteAnnouncement = (id: string, name: string) => {
    if (confirm(`Hapus pengumuman "${name}"?`)) {
      onSaveAnnouncements(announcements.filter((a) => a.id !== id));
      onLogAudit('HAPUS_PENGUMUMAN', name, 'Menghapus pengumuman');
      showNotice('Pengumuman telah dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Warta, Pengumuman & Pusat Komunikasi
          </h1>
          <p className="text-xs text-slate-500">
            Siaran informasi resmi kedinasan sekolah dan koordinasi sivitas akademika SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Terbitkan Pengumuman</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className={`p-6 rounded-2xl border transition-all ${
              anc.isPinned
                ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                    Target: {anc.targetRole}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">{anc.date}</span>
                  {anc.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3" /> Disematkan
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{anc.title}</h3>
              </div>

              {canPost && (
                <button
                  onClick={() => handleDeleteAnnouncement(anc.id, anc.title)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Hapus Pengumuman"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-3 whitespace-pre-line">
              {anc.content}
            </p>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                Penerbit: <strong className="text-slate-700">{anc.authorName}</strong> ({anc.authorRole})
              </span>
              <span className="text-[11px] text-blue-900 font-semibold">SMA PGRI 4 GANDRUNGMANGU</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Terbitkan Pengumuman Sekolah Baru
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Libur Awal Ramadhan 1446 H"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sasaran Pembaca (Target Role)</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="semua">Semua Sivitas Sekolah (Publik)</option>
                  <option value="guru">Dewan Guru & Tenaga Kependidikan</option>
                  <option value="siswa">Peserta Didik (Siswa)</option>
                  <option value="orang_tua">Orang Tua / Wali Murid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Berita / Surat Edaran *</label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan teks warta lengkap, jadwal, dan instruksi bagi penerima..."
                  className="w-full p-3 border border-slate-300 rounded-lg font-sans leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm"
                >
                  Siarkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
