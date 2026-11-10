import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Compass,
  AlertCircle,
  HelpCircle,
  Save,
  UserCheck,
} from 'lucide-react';
import { StudentElectiveChoice, Subject, Profile, StudentDetail } from '../../types/database';

interface ElectiveSelectionModuleProps {
  electives: StudentElectiveChoice[];
  subjects: Subject[];
  students: StudentDetail[];
  currentUser: Profile;
  onSaveElectives: (updated: StudentElectiveChoice[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const ElectiveSelectionModule: React.FC<ElectiveSelectionModuleProps> = ({
  electives,
  subjects,
  students,
  currentUser,
  onSaveElectives,
  onLogAudit,
}) => {
  const isStudent = currentUser.role === 'siswa';
  const isCounselorOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru_bk' ||
    currentUser.role === 'wakasek_kurikulum' ||
    currentUser.role === 'wali_kelas';

  // Find current student's elective choice or default to first
  const currentStudentChoice =
    electives.find((e) => e.studentName === currentUser.fullName) ||
    electives[0];

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentStudentChoice?.id || electives[0]?.id || ''
  );

  const activeRecord =
    electives.find((e) => e.id === selectedStudentId) || currentStudentChoice || electives[0];

  const [targetMajor, setTargetMajor] = useState<string>(activeRecord?.targetMajor || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    activeRecord?.chosenSubjectNames || []
  );
  const [notification, setNotification] = useState<string | null>(null);

  // Available Elective Subjects in Fase F (Kelas XI & XII)
  const electiveSubjects = subjects.filter(
    (s) =>
      s.fase === 'Fase F' &&
      (s.category === 'Pilihan MIPA' ||
        s.category === 'Pilihan IPS' ||
        s.category === 'Pilihan Bahasa')
  );

  const mipaElectives = electiveSubjects.filter((s) => s.category === 'Pilihan MIPA');
  const ipsElectives = electiveSubjects.filter((s) => s.category === 'Pilihan IPS');
  const bahasaElectives = electiveSubjects.filter((s) => s.category === 'Pilihan Bahasa');

  const handleToggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(selectedSubjects.filter((name) => name !== subjectName));
    } else {
      if (selectedSubjects.length >= 5) {
        alert('Maksimal pemilihan adalah 5 Mata Pelajaran Pilihan sesuai regulasi Kurikulum Merdeka.');
        return;
      }
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleSaveChoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length < 4) {
      alert('Siswa wajib memilih minimal 4 mata pelajaran pilihan (disarankan 4 - 5 mapel).');
      return;
    }

    const updated: StudentElectiveChoice[] = electives.map((elc) =>
      elc.id === activeRecord.id
        ? {
            ...elc,
            targetMajor,
            chosenSubjectNames: selectedSubjects,
            chosenSubjectIds: selectedSubjects.map(
              (name) => subjects.find((s) => s.name === name)?.id || name
            ),
            updatedAt: new Date().toISOString(),
          }
        : elc
    );

    onSaveElectives(updated);
    onLogAudit(
      'PILIHAN_MAPEL_FASE_F',
      activeRecord.studentName,
      `Memperbarui kombinasi mapel pilihan: ${selectedSubjects.join(', ')}`
    );
    setNotification(
      `Pilihan mata pelajaran untuk ${activeRecord.studentName} berhasil disimpan dan disinkronkan ke sistem BK.`
    );
    setTimeout(() => setNotification(null), 3500);
  };

  const handleVerifyChoice = (choiceId: string) => {
    const updated: StudentElectiveChoice[] = electives.map((elc) =>
      elc.id === choiceId
        ? {
            ...elc,
            status: 'Diverifikasi BK' as const,
            updatedAt: new Date().toISOString(),
          }
        : elc
    );
    onSaveElectives(updated);
    onLogAudit('VERIFIKASI_MAPEL_BK', choiceId, 'Guru BK memverifikasi peminatan siswa');
    setNotification('Pilihan peminatan siswa telah diverifikasi oleh Guru BK & Kurikulum.');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Kurikulum Merdeka SMA
            </span>
            <span className="text-xs text-slate-400">&middot;</span>
            <span className="text-xs font-semibold text-slate-600">Fase F (Kelas XI & XII)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Pemilihan Mata Pelajaran Pilihan (Fase F)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem penjurusan IPA/IPS konvensional telah ditiadakan. Siswa mengikuti 7 Mapel Umum Wajib dan memilih 4–5 Mapel Pilihan untuk persiapan Perguruan Tinggi (SNBP/SNBT/Kedinasan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900">
            Beban Belajar: 40 - 44 JP/Minggu
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Information Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Mapel Umum (Wajib - 7 Mapel)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Agama & Budi Pekerti, Pancasila, Bahasa Indonesia, Matematika Umum, Bahasa Inggris, PJOK, dan Sejarah.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Aturan Pilihan (4 - 5 Mapel)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Siswa leluasa memilih lintas kelompok (MIPA, IPS, Bahasa) sesuai linearitas prodi kuliah idaman.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Linearitas Jalur SNBP</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pilihan diverifikasi oleh Guru BK dan Wakasek Kurikulum SMA PGRI 4 Gandrungmangu.
          </p>
        </div>
      </div>

      {/* Form / Selection Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Student Selector / Overview (BK & Admin view) */}
        {isCounselorOrAdmin && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Peserta Fase F ({electives.length})
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {electives.map((elc) => {
                const isSelected = elc.id === selectedStudentId;
                return (
                  <div
                    key={elc.id}
                    onClick={() => {
                      setSelectedStudentId(elc.id);
                      setTargetMajor(elc.targetMajor);
                      setSelectedSubjects(elc.chosenSubjectNames || []);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{elc.studentName}</span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                          elc.status === 'Diverifikasi BK' || elc.status === 'Disetujui Kurikulum'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {elc.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      Target: {elc.targetMajor}
                    </p>
                    <p className="text-[10px] text-blue-900 font-semibold mt-1">
                      {(elc.chosenSubjectNames || []).length} Mapel Pilihan Terpilih
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right: Elective Form & Selection */}
        <div className={`${isCounselorOrAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6`}>
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Peminatan: {activeRecord?.studentName}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Kelas: {activeRecord?.className} &middot; Status: {activeRecord?.status}
              </p>
            </div>

            {isCounselorOrAdmin && activeRecord?.status !== 'Diverifikasi BK' && activeRecord?.status !== 'Disetujui Kurikulum' && (
              <button
                onClick={() => handleVerifyChoice(activeRecord.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verifikasi Pilihan BK</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveChoice} className="space-y-6 text-xs">
            {/* Target Major Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Program Studi & Perguruan Tinggi yang Dituju (SNBP/SNBT/Kedinasan):
              </label>
              <input
                type="text"
                required
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                placeholder="Contoh: Teknik Informatika ITB / Kedokteran UGM / Akuntansi UNNES"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Pilihan mata pelajaran berikut harus selaras dengan mata pelajaran pendukung prodi SNBP yang dirilis Kemendikbudristek.
              </p>
            </div>

            {/* Selection Counter */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-950">
                Mata Pelajaran Pilihan yang Dipilih ({selectedSubjects.length} / 5 Maksimal):
              </span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                  selectedSubjects.length >= 4 && selectedSubjects.length <= 5
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedSubjects.length} Mapel ({selectedSubjects.length >= 4 ? 'Memenuhi Syarat' : 'Kurang ' + (4 - selectedSubjects.length)})
              </span>
            </div>

            {/* GROUP 1: MIPA ELECTIVES */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Kelompok Pilihan MIPA (Matematika & Sains Alam)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mipaElectives.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => handleToggleSubject(sub.name)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-50 border-blue-600 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className={`font-bold text-xs ${isChecked ? 'text-blue-900' : 'text-slate-800'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {sub.creditHours} JP/Minggu &middot; Pengampu: {sub.teacherName?.split(',')[0]}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border font-bold text-xs ${
                          isChecked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROUP 2: IPS ELECTIVES */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Kelompok Pilihan IPS (Ilmu Sosial & Humaniora)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ipsElectives.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => handleToggleSubject(sub.name)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className={`font-bold text-xs ${isChecked ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {sub.creditHours} JP/Minggu &middot; Pengampu: {sub.teacherName?.split(',')[0]}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border font-bold text-xs ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROUP 3: BAHASA & BUDAYA */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Kelompok Pilihan Bahasa & Budaya</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bahasaElectives.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => handleToggleSubject(sub.name)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-purple-50 border-purple-600 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className={`font-bold text-xs ${isChecked ? 'text-purple-900' : 'text-slate-800'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {sub.creditHours} JP/Minggu &middot; Pengampu: {sub.teacherName?.split(',')[0]}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border font-bold text-xs ${
                          isChecked
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pilihan Mapel Fase F</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
