import React, { useState } from 'react';
import {
  HeartHandshake,
  Award,
  AlertTriangle,
  Plus,
  Shield,
  Lock,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  CounselingRecord,
  ViolationRecord,
  AchievementRecord,
  StudentDetail,
  Profile,
} from '../../types/database';

interface CounselingModuleProps {
  counseling: CounselingRecord[];
  violations: ViolationRecord[];
  achievements: AchievementRecord[];
  students: StudentDetail[];
  currentUser: Profile;
  onSaveCounseling: (updated: CounselingRecord[]) => void;
  onSaveViolations: (updated: ViolationRecord[]) => void;
  onSaveAchievements: (updated: AchievementRecord[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const CounselingModule: React.FC<CounselingModuleProps> = ({
  counseling,
  violations,
  achievements,
  students,
  currentUser,
  onSaveCounseling,
  onSaveViolations,
  onSaveAchievements,
  onLogAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'konseling' | 'pelanggaran' | 'prestasi'>('konseling');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [problemSummary, setProblemSummary] = useState('');
  const [followUp, setFollowUp] = useState('');

  // Violation form
  const [violationType, setViolationType] = useState('Keterlambatan Masuk Sekolah');
  const [penaltyPoints, setPenaltyPoints] = useState(5);
  const [violationDesc, setViolationDesc] = useState('');
  const [violationAction, setViolationAction] = useState('Pembinaan dan literasi perpustakaan');

  // Achievement form
  const [achTitle, setAchTitle] = useState('');
  const [achLevel, setAchLevel] = useState<'Sekolah' | 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional'>('Kabupaten');
  const [achPoints, setAchPoints] = useState(25);

  const isCounselorOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru_bk' ||
    currentUser.role === 'kepala_sekolah';

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === studentId);
    const newRecord: CounselingRecord = {
      id: 'cnsl-' + Date.now(),
      studentId,
      studentName: std ? std.profile.fullName : 'Siswa',
      className: std ? std.className : 'XI MIPA 1',
      counselorName: currentUser.fullName,
      date: new Date().toISOString().split('T')[0],
      topic,
      problemSummary,
      followUpAction: followUp,
      status: 'Dalam Proses',
      isConfidential: true,
    };
    onSaveCounseling([newRecord, ...counseling]);
    onLogAudit('CATATAN_KONSELING', std?.profile.fullName || '', 'Mencatat sesi bimbingan konseling rahasia');
    showNotice('Catatan sesi konseling berhasil disimpan.');
    setShowAddModal(false);
    setTopic('');
    setProblemSummary('');
    setFollowUp('');
  };

  const handleCreateViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === studentId);
    const newViol: ViolationRecord = {
      id: 'viol-' + Date.now(),
      studentId,
      studentName: std ? std.profile.fullName : 'Siswa',
      className: std ? std.className : 'XI MIPA 1',
      violationType,
      penaltyPoints: Number(penaltyPoints),
      date: new Date().toISOString().split('T')[0],
      description: violationDesc,
      actionTaken: violationAction,
    };
    onSaveViolations([newViol, ...violations]);
    onLogAudit('INPUT_PELANGGARAN', std?.profile.fullName || '', `Pencatatan pelanggaran (${penaltyPoints} poin)`);
    showNotice('Data pelanggaran berhasil dicatat.');
    setShowAddModal(false);
  };

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === studentId);
    const newAch: AchievementRecord = {
      id: 'ach-' + Date.now(),
      studentId,
      studentName: std ? std.profile.fullName : 'Siswa',
      className: std ? std.className : 'XI MIPA 1',
      title: achTitle,
      level: achLevel,
      date: new Date().toISOString().split('T')[0],
      rewardPoints: Number(achPoints),
    };
    onSaveAchievements([newAch, ...achievements]);
    onLogAudit('INPUT_PRESTASI', std?.profile.fullName || '', `Pencatatan prestasi: ${achTitle}`);
    showNotice('Prestasi siswa berhasil dicatat.');
    setShowAddModal(false);
    setAchTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Kesiswaan & Bimbingan Konseling (BK)
          </h1>
          <p className="text-xs text-slate-500">
            Layanan Konseling Rahasia, Kedisiplinan Poin Pelanggaran, dan Penghargaan Prestasi SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {isCounselorOrAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {activeTab === 'konseling'
                ? 'Catat Sesi Konseling'
                : activeTab === 'pelanggaran'
                ? 'Catat Pelanggaran'
                : 'Catat Prestasi'}
            </span>
          </button>
        )}
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
          onClick={() => setActiveTab('konseling')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'konseling'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Sesi Konseling Rahasia ({counseling.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pelanggaran')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pelanggaran'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Poin Pelanggaran ({violations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('prestasi')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'prestasi'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Prestasi Siswa ({achievements.length})</span>
        </button>
      </div>

      {/* TAB 1: KONSELING */}
      {activeTab === 'konseling' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Perhatian Kerahasiaan:</strong> Dokumen dan catatan bimbingan konseling bersifat rahasia (confidential) sesuai kode etik Guru BK dan hanya dapat diakses oleh Konselor Sekolah dan Kepala Sekolah.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counseling.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{c.studentName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Kelas: {c.className} &middot; {c.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                    {c.status}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700">Topik Konseling:</p>
                  <p className="text-xs text-slate-900 font-semibold">{c.topic}</p>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700">Uraian Permasalahan / Kebutuhan:</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{c.problemSummary}"</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-700">Tindak Lanjut & Arahan:</p>
                  <p className="text-xs text-emerald-800">{c.followUpAction}</p>
                </div>

                <div className="text-[10px] text-slate-400 pt-2 flex justify-between">
                  <span>Konselor: {c.counselorName}</span>
                  <span className="text-amber-700 font-semibold">Tersimpan Aman</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PELANGGARAN */}
      {activeTab === 'pelanggaran' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Jenis Pelanggaran</th>
                <th className="px-4 py-3 text-center">Poin</th>
                <th className="px-4 py-3">Tindakan Pembinaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">{v.date}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{v.studentName}</td>
                  <td className="px-4 py-3 text-slate-600">{v.className}</td>
                  <td className="px-4 py-3 text-slate-800">{v.violationType}</td>
                  <td className="px-4 py-3 text-center font-bold text-rose-600 font-mono tabular-nums">
                    +{v.penaltyPoints}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{v.actionTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PRESTASI */}
      {activeTab === 'prestasi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-blue-900 uppercase">Tingkat {ach.level}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{ach.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ach.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Peraih: <strong className="text-slate-800">{ach.studentName}</strong> ({ach.className})
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    +{ach.rewardPoints} Poin Apresiasi
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {activeTab === 'konseling'
                ? 'Catat Sesi Bimbingan Konseling'
                : activeTab === 'pelanggaran'
                ? 'Input Pelanggaran Tata Tertib'
                : 'Input Prestasi Siswa'}
            </h3>

            {activeTab === 'konseling' && (
              <form onSubmit={handleCreateCounseling} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siswa Terkait *</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.profile.fullName} ({s.className})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Topik Konsultasi *</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Bimbingan Karir & Minat Kuliah"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ringkasan Masalah / Pembahasan *</label>
                  <textarea
                    required
                    rows={3}
                    value={problemSummary}
                    onChange={(e) => setProblemSummary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tindak Lanjut & Rekomendasi</label>
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="Rencana sesi berikutnya..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                    Simpan Konseling
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'pelanggaran' && (
              <form onSubmit={handleCreateViolation} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siswa Terkait *</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.profile.fullName} ({s.className})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Poin Pelanggaran</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={penaltyPoints}
                      onChange={(e) => setPenaltyPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenis</label>
                    <input
                      type="text"
                      value={violationType}
                      onChange={(e) => setViolationType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Uraian Kejadian</label>
                  <textarea
                    rows={2}
                    value={violationDesc}
                    onChange={(e) => setViolationDesc(e.target.value)}
                    placeholder="Waktu dan kronologi kejadian..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tindakan Pembinaan</label>
                  <input
                    type="text"
                    value={violationAction}
                    onChange={(e) => setViolationAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                    Simpan Pelanggaran
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'prestasi' && (
              <form onSubmit={handleCreateAchievement} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siswa Berprestasi *</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.profile.fullName} ({s.className})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Prestasi / Juara *</label>
                  <input
                    type="text"
                    required
                    value={achTitle}
                    onChange={(e) => setAchTitle(e.target.value)}
                    placeholder="Contoh: Juara 1 Lomba Pidato Bahasa Inggris"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tingkat</label>
                    <select
                      value={achLevel}
                      onChange={(e) => setAchLevel(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Sekolah">Sekolah</option>
                      <option value="Kecamatan">Kecamatan</option>
                      <option value="Kabupaten">Kabupaten</option>
                      <option value="Provinsi">Provinsi</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Internasional">Internasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Poin Apresiasi</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={achPoints}
                      onChange={(e) => setAchPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                    />
                  </div>
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
                    Simpan Prestasi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
