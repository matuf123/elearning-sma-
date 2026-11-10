import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  User,
  Award,
  Send,
  Trash2,
} from 'lucide-react';
import {
  Assignment,
  AssignmentSubmission,
  Subject,
  ClassInfo,
  Profile,
} from '../../types/database';

interface AssignmentModuleProps {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  subjects: Subject[];
  classes: ClassInfo[];
  currentUser: Profile;
  onSaveAssignments: (updated: Assignment[]) => void;
  onSaveSubmissions: (updated: AssignmentSubmission[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const AssignmentModule: React.FC<AssignmentModuleProps> = ({
  assignments,
  submissions,
  subjects,
  classes,
  currentUser,
  onSaveAssignments,
  onSaveSubmissions,
  onLogAudit,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(assignments[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [submitTaskModal, setSubmitTaskModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Create Assignment Form
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('2025-03-15T23:59');
  const [maxScore, setMaxScore] = useState(100);
  const [isRemedial, setIsRemedial] = useState(false);

  // Student Submit Form
  const [studentText, setStudentText] = useState('');
  const [studentFileName, setStudentFileName] = useState('');

  // Teacher Grading Form
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const isTeacherOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru' ||
    currentUser.role === 'wali_kelas';

  const isStudent = currentUser.role === 'siswa';

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === subjectId);
    const cls = classes.find((c) => c.id === classId);

    const newAsg: Assignment = {
      id: 'asg-' + Date.now(),
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      subjectId,
      subjectName: sub ? sub.name : 'Mata Pelajaran',
      classId,
      className: cls ? cls.name : 'Semua Kelas',
      title,
      instructions,
      dueDate: new Date(dueDate).toISOString(),
      maxScore: Number(maxScore),
      isRemedial,
      totalSubmissions: 0,
      gradedSubmissions: 0,
      createdAt: new Date().toISOString(),
    };

    onSaveAssignments([newAsg, ...assignments]);
    setSelectedAssignment(newAsg);
    onLogAudit('BUAT_TUGAS', title, `Membuat tugas baru untuk kelas ${cls?.name}`);
    showNotice(`Tugas "${title}" berhasil dibuat.`);
    setShowCreateModal(false);
    setTitle('');
    setInstructions('');
  };

  const handleDeleteAssignment = (id: string, name: string) => {
    if (confirm(`Hapus penugasan "${name}"?`)) {
      const updated = assignments.filter((a) => a.id !== id);
      onSaveAssignments(updated);
      if (selectedAssignment?.id === id) {
        setSelectedAssignment(updated[0] || null);
      }
      onLogAudit('HAPUS_TUGAS', name, 'Menghapus penugasan');
      showNotice(`Tugas "${name}" telah dihapus.`);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    // Check if already submitted
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === selectedAssignment.id && s.studentName === currentUser.fullName
    );

    const newSubm: AssignmentSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : 'subm-' + Date.now(),
      assignmentId: selectedAssignment.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentNis: currentUser.nipNisn || '23241001',
      className: 'XI MIPA 1',
      submissionText: studentText,
      fileUrl: '/uploads/' + (studentFileName || 'tugas_siswa.pdf'),
      fileName: studentFileName || 'tugas_mandiri.pdf',
      submittedAt: new Date().toISOString(),
      status: 'Sudah Dikumpulkan',
    };

    let updated: AssignmentSubmission[];
    if (existingIndex >= 0) {
      updated = [...submissions];
      updated[existingIndex] = newSubm;
    } else {
      updated = [newSubm, ...submissions];
    }

    onSaveSubmissions(updated);
    onLogAudit('KUMPULKAN_TUGAS', selectedAssignment.title, `Siswa ${currentUser.fullName} mengumpulkan tugas`);
    showNotice('Tugas Anda berhasil dikumpulkan ke sistem!');
    setSubmitTaskModal(false);
    setStudentText('');
    setStudentFileName('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = submissions.map((s) =>
      s.id === gradingSubmission.id
        ? {
            ...s,
            score: Number(gradeScore),
            feedback: gradeFeedback,
            status: 'Dinilai' as const,
            gradedAt: new Date().toISOString(),
            gradedBy: currentUser.fullName,
          }
        : s
    );

    onSaveSubmissions(updated);
    onLogAudit('NILAI_TUGAS', gradingSubmission.studentName, `Memberi nilai ${gradeScore} pada tugas`);
    showNotice(`Nilai untuk ${gradingSubmission.studentName} berhasil disimpan.`);
    setGradingSubmission(null);
  };

  const currentTaskSubmissions = submissions.filter(
    (s) => s.assignmentId === selectedAssignment?.id
  );

  const mySubmission = isStudent && selectedAssignment
    ? submissions.find((s) => s.assignmentId === selectedAssignment.id && s.studentName === currentUser.fullName)
    : null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Manajemen Tugas & Lembar Kerja Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Penugasan terstruktur, pengumpulan digital, dan penilaian langsung SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid: Task list on left, detail & submissions on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Task Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Tugas Aktif ({assignments.length})
          </h3>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {assignments.map((asg) => {
              const isSelected = selectedAssignment?.id === asg.id;
              const subCount = submissions.filter((s) => s.assignmentId === asg.id).length;
              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAssignment(asg)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-blue-900 uppercase">
                      {asg.subjectName}
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold text-[10px]">
                      {asg.className}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {asg.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Batas: {new Date(asg.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
                    <span>Oleh: {asg.teacherName.split(',')[0]}</span>
                    <span className="font-semibold text-blue-900 tabular-nums">
                      {subCount} Siswa Mengumpulkan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Task Details & Submissions */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          {selectedAssignment ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-blue-900 uppercase">
                    {selectedAssignment.subjectName} &middot; {selectedAssignment.className}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                    Bobot: {selectedAssignment.maxScore} Poin
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedAssignment.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-2 gap-2">
                  <span>Guru: <strong className="text-slate-800">{selectedAssignment.teacherName}</strong></span>
                  <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batas: {new Date(selectedAssignment.dueDate).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Petunjuk & Instruksi Pengerjaan:
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedAssignment.instructions}
                </div>
              </div>

              {/* Student View Action: Submit or View Score */}
              {isStudent && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-950 uppercase">
                        Status Pengumpulan Tugas Saya
                      </h4>
                      <p className="text-[11px] text-blue-800">
                        {currentUser.fullName} &middot; XI MIPA 1
                      </p>
                    </div>

                    {mySubmission ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{mySubmission.status}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        Belum Mengumpulkan
                      </span>
                    )}
                  </div>

                  {mySubmission && mySubmission.score !== undefined && (
                    <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 font-medium">Nilai yang Diperoleh:</p>
                        <p className="text-xl font-bold text-blue-900 tabular-nums">
                          {mySubmission.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </p>
                      </div>
                      <div className="text-right max-w-xs">
                        <p className="text-slate-500 font-medium">Umpan Balik Guru:</p>
                        <p className="text-slate-800 italic">"{mySubmission.feedback || 'Sangat baik.'}"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSubmitTaskModal(true)}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{mySubmission ? 'Perbarui Pengumpulan' : 'Kumpulkan Tugas Sekarang'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Teacher/Admin View: Submissions List */}
              {isTeacherOrAdmin && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Pengumpulan Siswa ({currentTaskSubmissions.length} Terkumpul)
                    </h3>
                    <button
                      onClick={() => handleDeleteAssignment(selectedAssignment.id, selectedAssignment.title)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Penugasan Ini</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {currentTaskSubmissions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Belum ada siswa yang mengumpulkan tugas ini.
                      </div>
                    ) : (
                      currentTaskSubmissions.map((subm) => (
                        <div key={subm.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{subm.studentName}</span>
                              <span className="font-mono text-[10px] text-slate-400">{subm.studentNis}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-semibold">
                                {subm.className}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                              "{subm.submissionText || 'Mengunggah file lampiran'}"
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Dikumpulkan: {new Date(subm.submittedAt).toLocaleString('id-ID')}
                            </p>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-3">
                            {subm.score !== undefined ? (
                              <div className="text-right">
                                <span className="text-sm font-bold text-blue-900 font-mono tabular-nums">
                                  {subm.score}
                                </span>
                                <p className="text-[10px] text-emerald-600 font-semibold">Dinilai</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                                Perlu Dinilai
                              </span>
                            )}

                            <button
                              onClick={() => {
                                setGradingSubmission(subm);
                                setGradeScore(subm.score || 90);
                                setGradeFeedback(subm.feedback || '');
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Koreksi & Nilai
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Pilih tugas di sebelah kiri untuk melihat rincian pengerjaan.
            </div>
          )}
        </div>
      </div>

      {/* Modal Create Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Buat Penugasan Baru
            </h3>
            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Penugasan *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tugas Mandiri 04: Analisis Gerak Harmonik Sederhana"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas Target</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Batas Waktu (Deadline) *</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bobot Nilai Maksimal</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruksi Pengerjaan *</label>
                <textarea
                  required
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Jelaskan langkah pengerjaan, format laporan, dan kriteria penilaian..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Student Submission */}
      {submitTaskModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Kumpulkan Tugas: {selectedAssignment.title}
            </h3>
            <form onSubmit={handleStudentSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jawaban / Catatan Pengantar *</label>
                <textarea
                  required
                  rows={4}
                  value={studentText}
                  onChange={(e) => setStudentText(e.target.value)}
                  placeholder="Tuliskan jawaban singkat, ringkasan, atau keterangan file yang Anda kumpulkan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama File Dokumen (PDF/DOCX/JPG)</label>
                <input
                  type="text"
                  value={studentFileName}
                  onChange={(e) => setStudentFileName(e.target.value)}
                  placeholder="Contoh: jawaban_tugas4_rizky.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                Pastikan seluruh jawaban Anda sudah sesuai instruksi guru sebelum menekan tombol kumpulkan.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmitTaskModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Kirim Pengumpulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Teacher Grading */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Koreksi & Beri Nilai Tugas Siswa
            </h3>
            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{gradingSubmission.studentName} ({gradingSubmission.studentNis})</p>
              <p className="text-slate-600 mt-1 italic">"{gradingSubmission.submissionText}"</p>
              {gradingSubmission.fileName && (
                <p className="text-[11px] text-blue-900 font-mono mt-1">Lampiran: {gradingSubmission.fileName}</p>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nilai Angka (Skala 0 - 100) *</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-base text-blue-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Koreksi / Umpan Balik Guru</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Berikan apresiasi atau arahan perbaikan materi..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
