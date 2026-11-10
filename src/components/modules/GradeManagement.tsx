import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Plus,
  CheckCircle2,
  TrendingUp,
  FileText,
  Sliders,
} from 'lucide-react';
import { StudentGrade, Subject, ClassInfo, Profile, StudentDetail } from '../../types/database';

interface GradeManagementProps {
  grades: StudentGrade[];
  students: StudentDetail[];
  subjects: Subject[];
  classes: ClassInfo[];
  currentUser: Profile;
  onSaveGrades: (updated: StudentGrade[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const GradeManagement: React.FC<GradeManagementProps> = ({
  grades,
  students,
  subjects,
  classes,
  currentUser,
  onSaveGrades,
  onLogAudit,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('XI MIPA 1');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showInputModal, setShowInputModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [asgScore, setAsgScore] = useState(85);
  const [quizScore, setQuizScore] = useState(85);
  const [midScore, setMidScore] = useState(85);
  const [finScore, setFinScore] = useState(85);
  const [pracScore, setPracScore] = useState(85);
  const [projScore, setProjScore] = useState(85);
  const [desc, setDesc] = useState('');

  // Weightings (configurable)
  const [weights, setWeights] = useState({
    assignment: 20,
    quiz: 15,
    midterm: 25,
    final: 25,
    practical: 15,
  });

  const isTeacherOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru' ||
    currentUser.role === 'wali_kelas' ||
    currentUser.role === 'wakasek_kurikulum';

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const calculateFinalGrade = (
    asg: number,
    quiz: number,
    mid: number,
    fin: number,
    prac: number
  ) => {
    const total =
      (asg * weights.assignment +
        quiz * weights.quiz +
        mid * weights.midterm +
        fin * weights.final +
        prac * weights.practical) /
      100;
    return Math.round(total * 10) / 10;
  };

  const getLetter = (num: number): 'A' | 'B' | 'C' | 'D' => {
    if (num >= 90) return 'A';
    if (num >= 80) return 'B';
    if (num >= 75) return 'C';
    return 'D';
  };

  const filteredGrades = grades.filter((g) => {
    const matchesClass = selectedClass === 'all' || g.className === selectedClass;
    const matchesSubject = selectedSubject === 'all' || g.subjectId === selectedSubject;
    return matchesClass && matchesSubject;
  });

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === studentId);
    const sub = subjects.find((s) => s.id === subjectId);

    const calculatedFinal = calculateFinalGrade(
      asgScore,
      quizScore,
      midScore,
      finScore,
      pracScore
    );
    const letter = getLetter(calculatedFinal);

    if (editingGrade) {
      const updated = grades.map((g) =>
        g.id === editingGrade.id
          ? {
              ...g,
              assignmentScore: asgScore,
              quizScore,
              midtermScore: midScore,
              finalScore: finScore,
              practicalScore: pracScore,
              projectScore: projScore,
              finalGrade: calculatedFinal,
              letterGrade: letter,
              description: desc || g.description,
            }
          : g
      );
      onSaveGrades(updated);
      onLogAudit('UPDATE_NILAI', editingGrade.studentName, `Memperbarui nilai ${editingGrade.subjectName} (NA: ${calculatedFinal})`);
      showNotice(`Nilai ${editingGrade.studentName} berhasil diperbarui.`);
    } else {
      const newGrade: StudentGrade = {
        id: 'grd-' + Date.now(),
        studentId,
        studentName: std ? std.profile.fullName : 'Siswa',
        nis: std ? std.nis : '23241001',
        className: std ? std.className : selectedClass,
        subjectId,
        subjectName: sub ? sub.name : 'Mata Pelajaran',
        semester: 'Genap',
        academicYear: '2024/2025',
        assignmentScore: asgScore,
        quizScore,
        midtermScore: midScore,
        finalScore: finScore,
        practicalScore: pracScore,
        projectScore: projScore,
        finalGrade: calculatedFinal,
        letterGrade: letter,
        description: desc || 'Menunjukkan penguasaan materi yang baik.',
      };
      onSaveGrades([...grades, newGrade]);
      onLogAudit('INPUT_NILAI', newGrade.studentName, `Input nilai baru ${newGrade.subjectName}`);
      showNotice(`Nilai ${newGrade.studentName} berhasil disimpan.`);
    }

    setShowInputModal(false);
    setEditingGrade(null);
  };

  const openEdit = (g: StudentGrade) => {
    setEditingGrade(g);
    setStudentId(g.studentId);
    setSubjectId(g.subjectId);
    setAsgScore(g.assignmentScore);
    setQuizScore(g.quizScore);
    setMidScore(g.midtermScore);
    setFinScore(g.finalScore);
    setPracScore(g.practicalScore);
    setProjScore(g.projectScore);
    setDesc(g.description);
    setShowInputModal(true);
  };

  const handleExportCSV = () => {
    const headers = 'NIS,Nama Siswa,Kelas,Mata Pelajaran,Tugas,Kuis,PTS,PAS,Praktik,Nilai Akhir,Predikat\n';
    const rows = filteredGrades
      .map(
        (g) =>
          `"${g.nis}","${g.studentName}","${g.className}","${g.subjectName}",${g.assignmentScore},${g.quizScore},${g.midtermScore},${g.finalScore},${g.practicalScore},${g.finalGrade},"${g.letterGrade}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_nilai_${selectedClass}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAudit('EXPORT_NILAI', selectedClass, 'Mengekspor rekapitulasi nilai ke format CSV');
    showNotice('Rekap nilai berhasil diekspor.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Manajemen & Rekapitulasi Nilai Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Penilaian Tugas, Kuis, PTS, PAS/SAS, dan Perhitungan Nilai Akhir Otomatis SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Nilai Excel/CSV</span>
          </button>
          {isTeacherOrAdmin && (
            <button
              onClick={() => {
                setEditingGrade(null);
                setShowInputModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Nilai Siswa</span>
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Mata Pelajaran:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Bobot: Tugas ({weights.assignment}%), Kuis ({weights.quiz}%), PTS ({weights.midterm}%), PAS ({weights.final}%), Praktik ({weights.practical}%)
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Mata Pelajaran</th>
                <th className="px-3 py-3 text-center">Tugas</th>
                <th className="px-3 py-3 text-center">Kuis</th>
                <th className="px-3 py-3 text-center">PTS</th>
                <th className="px-3 py-3 text-center">PAS</th>
                <th className="px-3 py-3 text-center">Praktik</th>
                <th className="px-4 py-3 text-center font-bold text-blue-900">Nilai Akhir</th>
                <th className="px-3 py-3 text-center">Predikat</th>
                {isTeacherOrAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada catatan nilai pada filter kelas atau mapel yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{g.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NIS: {g.nis}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{g.className}</td>
                    <td className="px-4 py-3 text-slate-800">{g.subjectName}</td>
                    <td className="px-3 py-3 text-center font-mono tabular-nums">{g.assignmentScore}</td>
                    <td className="px-3 py-3 text-center font-mono tabular-nums">{g.quizScore}</td>
                    <td className="px-3 py-3 text-center font-mono tabular-nums">{g.midtermScore}</td>
                    <td className="px-3 py-3 text-center font-mono tabular-nums">{g.finalScore}</td>
                    <td className="px-3 py-3 text-center font-mono tabular-nums">{g.practicalScore}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-900 font-mono text-sm tabular-nums">
                      {g.finalGrade}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.letterGrade === 'A'
                            ? 'bg-blue-100 text-blue-800'
                            : g.letterGrade === 'B'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.letterGrade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {g.letterGrade}
                      </span>
                    </td>
                    {isTeacherOrAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(g)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-900 hover:bg-blue-50 rounded border border-blue-200 cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredGrades.length} rekaman nilai</span>
          <span>Standar KKM Sekolah: 75.00</span>
        </div>
      </div>

      {/* Modal Input/Edit Grade */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {editingGrade ? `Edit Nilai: ${editingGrade.studentName}` : 'Input Nilai Siswa Baru'}
            </h3>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-3.5 text-xs">
              {!editingGrade && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.profile.fullName} ({s.className})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran *</label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tugas (20%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={asgScore}
                    onChange={(e) => setAsgScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kuis (15%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={quizScore}
                    onChange={(e) => setQuizScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PTS (25%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={midScore}
                    onChange={(e) => setMidScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PAS / SAS (25%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={finScore}
                    onChange={(e) => setFinScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Praktik (15%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={pracScore}
                    onChange={(e) => setPracScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Capaian Pembelajaran</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Contoh: Sangat baik dalam memahami konsep perhitungan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Nilai ke DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
