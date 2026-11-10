import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  FileText,
  Video,
  ExternalLink,
  MessageSquare,
  Eye,
  CheckCircle2,
  Trash2,
  Send,
  Download,
  Share2,
} from 'lucide-react';
import { LearningMaterial, DiscussionComment, ClassInfo, Subject, Profile } from '../../types/database';

interface LearningClassroomProps {
  materials: LearningMaterial[];
  comments: DiscussionComment[];
  classes: ClassInfo[];
  subjects: Subject[];
  currentUser: Profile;
  onSaveMaterials: (updated: LearningMaterial[]) => void;
  onSaveComments: (updated: DiscussionComment[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const LearningClassroom: React.FC<LearningClassroomProps> = ({
  materials,
  comments,
  classes,
  subjects,
  currentUser,
  onSaveMaterials,
  onSaveComments,
  onLogAudit,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeMaterial, setActiveMaterial] = useState<LearningMaterial | null>(materials[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // New material form
  const [newTitle, setNewTitle] = useState('');
  const [newSubId, setNewSubId] = useState(subjects[0]?.id || '');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newType, setNewType] = useState<'Dokumen' | 'Video' | 'Modul Ajar' | 'Tautan Luar'>('Modul Ajar');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const filteredMaterials = materials.filter((m) =>
    selectedSubject === 'all' ? true : m.subjectId === selectedSubject
  );

  const activeComments = comments.filter((c) =>
    activeMaterial ? c.materialId === activeMaterial.id : false
  );

  const isTeacherOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru' ||
    currentUser.role === 'wali_kelas';

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === newSubId);
    const cls = classes.find((c) => c.id === newClassId);

    const created: LearningMaterial = {
      id: 'mat-' + Date.now(),
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      subjectId: newSubId,
      subjectName: sub ? sub.name : 'Mata Pelajaran',
      classId: newClassId,
      className: cls ? cls.name : 'Semua Kelas',
      title: newTitle,
      description: newDescription,
      content: newContent,
      materialType: newType,
      fileUrl: newFileUrl || '/documents/materi_pembelajaran_smadri4.pdf',
      videoUrl: newVideoUrl,
      isPublished: true,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      commentsCount: 0,
    };

    const updated = [created, ...materials];
    onSaveMaterials(updated);
    setActiveMaterial(created);
    onLogAudit('PUBLISH_MATERI', newTitle, `Menerbitkan materi ajar untuk ${cls?.name}`);
    showNotice(`Materi "${newTitle}" berhasil diterbitkan.`);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    if (confirm(`Hapus materi ajar "${title}"?`)) {
      const updated = materials.filter((m) => m.id !== id);
      onSaveMaterials(updated);
      if (activeMaterial?.id === id) {
        setActiveMaterial(updated[0] || null);
      }
      onLogAudit('HAPUS_MATERI', title, 'Menghapus materi pembelajaran');
      showNotice(`Materi "${title}" telah dihapus.`);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeMaterial) return;

    const newComment: DiscussionComment = {
      id: 'com-' + Date.now(),
      materialId: activeMaterial.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    onSaveComments([...comments, newComment]);
    setCommentText('');
    showNotice('Komentar diskusi berhasil dikirim.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Ruang Belajar Digital & Modul Pembelajaran
          </h1>
          <p className="text-xs text-slate-500">
            Materi ajar, silabus, capaian pembelajaran Kurikulum Merdeka, dan forum diskusi SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Terbitkan Materi Baru</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Mata Pelajaran */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            selectedSubject === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Semua Mapel ({materials.length})
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubject(sub.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedSubject === sub.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Split Viewer: List on Left, Active Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Materi Pembelajaran ({filteredMaterials.length})
          </h3>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredMaterials.map((mat) => {
              const isActive = activeMaterial?.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-blue-900 uppercase">
                      {mat.subjectName}
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold text-[10px]">
                      {mat.className}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {mat.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                    {mat.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
                    <span>Pengampu: {mat.teacherName.split(',')[0]}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {mat.viewsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />{' '}
                        {comments.filter((c) => c.materialId === mat.id).length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Material Preview */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          {activeMaterial ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-blue-900 uppercase">
                    {activeMaterial.subjectName} &middot; {activeMaterial.className}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    {activeMaterial.materialType}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {activeMaterial.title}
                </h2>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>
                    Dibuat oleh: <strong className="text-slate-800">{activeMaterial.teacherName}</strong>
                  </span>
                  <span>{new Date(activeMaterial.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {/* Description callout */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                "{activeMaterial.description}"
              </div>

              {/* Content body */}
              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap">
                {activeMaterial.content}
              </div>

              {/* Attachment Download & Video Link buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeMaterial.fileUrl && (
                    <a
                      href={activeMaterial.fileUrl}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Mengunduh dokumen materi pembelajaran resmi SMA PGRI 4 Gandrungmangu: ${activeMaterial.title}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Dokumen Modul (PDF)</span>
                    </a>
                  )}

                  {activeMaterial.videoUrl && (
                    <a
                      href={activeMaterial.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Tonton Video Pembelajaran</span>
                    </a>
                  )}
                </div>

                {isTeacherOrAdmin && (
                  <button
                    onClick={() => handleDeleteMaterial(activeMaterial.id, activeMaterial.title)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Hapus Materi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Discussion Forum on Material */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Forum Tanya Jawab & Diskusi Materi ({activeComments.length})
                  </h3>
                </div>

                {/* List Comments */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {activeComments.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      Belum ada pertanyaan pada materi ini. Jadilah yang pertama bertanya!
                    </p>
                  ) : (
                    activeComments.map((com) => (
                      <div
                        key={com.id}
                        className={`p-3 rounded-xl border text-xs ${
                          com.authorRole === 'guru' || com.authorRole === 'wali_kelas'
                            ? 'bg-blue-50/60 border-blue-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[11px]">
                          <span className="font-bold text-slate-900">
                            {com.authorName}{' '}
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({com.authorRole === 'guru' ? 'Guru Pengampu' : 'Siswa'})
                            </span>
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(com.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{com.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Form Add Comment */}
                <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tuliskan pertanyaan atau tanggapan Anda..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Pilih salah satu materi di sebelah kiri untuk melihat konten lengkap.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Material */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Terbitkan Materi Pembelajaran Baru
            </h3>
            <form onSubmit={handleCreateMaterial} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Materi *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Modul 05: Stoikiometri dan Larutan Asam Basa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newSubId}
                    onChange={(e) => setNewSubId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Kelas</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Media</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="Dokumen">Dokumen PDF/Word</option>
                    <option value="Video">Video Pembelajaran</option>
                    <option value="Tautan Luar">Tautan Luar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Video (Opsional)</label>
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan / Capaian Pembelajaran</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ringkasan kompetensi yang dicapai peserta didik..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Konten Materi & Uraian Lengkap *</label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan materi ajar, langkah praktikum, atau panduan belajar..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
