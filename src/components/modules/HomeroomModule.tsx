import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  Users,
  Eye,
  Edit3,
} from 'lucide-react';
import { StudentDetail, ReportCard, StudentGrade, Profile } from '../../types/database';

interface HomeroomModuleProps {
  students: StudentDetail[];
  reportCards: ReportCard[];
  grades: StudentGrade[];
  currentUser: Profile;
  onSaveReportCards: (updated: ReportCard[]) => void;
  onSelectStudentReport: (studentId: string) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const HomeroomModule: React.FC<HomeroomModuleProps> = ({
  students,
  reportCards,
  grades,
  currentUser,
  onSaveReportCards,
  onSelectStudentReport,
  onLogAudit,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [notesText, setNotesText] = useState(
    'Ananda menunjukkan kedisiplinan dan capaian akademik yang sangat konsisten. Aktif dalam kegiatan intrakurikuler dan kepemimpinan sekolah.'
  );
  const [attitude, setAttitude] = useState<'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang'>('Sangat Baik');
  const [promotion, setPromotion] = useState<'Naik ke Kelas Berikutnya' | 'Tinggal di Kelas' | 'Lulus' | 'Belum Ditentukan'>('Naik ke Kelas Berikutnya');
  const [notification, setNotification] = useState<string | null>(null);

  const homeroomClass = 'XI MIPA 1';
  const classStudents = students.filter((s) => s.className === homeroomClass);
  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const handleSaveHomeroomNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const existingCard = reportCards.find((r) => r.studentId === currentStudent.id);
    let updated: ReportCard[];

    if (existingCard) {
      updated = reportCards.map((r) =>
        r.studentId === currentStudent.id
          ? {
              ...r,
              homeroomNotes: notesText,
              attitudeGrade: attitude,
              promotionStatus: promotion,
            }
          : r
      );
    } else {
      const newCard: ReportCard = {
        id: 'rep-' + currentStudent.id,
        studentId: currentStudent.id,
        studentName: currentStudent.profile.fullName,
        nis: currentStudent.nis,
        nisn: currentStudent.nisn,
        className: currentStudent.className,
        homeroomTeacherName: currentUser.fullName,
        semester: 'Genap',
        academicYear: '2024/2025',
        homeroomNotes: notesText,
        attitudeGrade: attitude,
        extracurricularNotes: 'Pramuka (Baik), OSIS (Aktif)',
        attendanceSummary: { hadir: 88, sakit: 1, izin: 1, alpa: 0 },
        grades: [],
        promotionStatus: promotion,
        isPublished: true,
        publishedDate: '2025-06-20',
      };
      updated = [...reportCards, newCard];
    }

    onSaveReportCards(updated);
    onLogAudit('CATATAN_WALI_KELAS', currentStudent.profile.fullName, 'Menyimpan catatan sikap dan evaluasi wali kelas');
    setNotification(`Catatan wali kelas untuk ${currentStudent.profile.fullName} berhasil disimpan.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Dashboard Wali Kelas & Pembinaan Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Kelas Binaan: <strong className="text-blue-900">{homeroomClass}</strong> &middot; Wali Kelas: {currentUser.fullName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-xs font-semibold border border-blue-200">
            Total Binaan: {classStudents.length} Siswa
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Student List on left, Homeroom Evaluator on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Class Students List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Siswa Binaan Kelas {homeroomClass}
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {classStudents.map((std) => {
              const isSelected = selectedStudentId === std.id;
              const hasReport = reportCards.some((r) => r.studentId === std.id);
              return (
                <div
                  key={std.id}
                  onClick={() => setSelectedStudentId(std.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{std.profile.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      NIS: {std.nis} &middot; NISN: {std.nisn}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        hasReport
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {hasReport ? 'Rapor Siap' : 'Draf Rapor'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Notes, Attitude & Promotion Status Input */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          {currentStudent ? (
            <>
              <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {currentStudent.profile.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    NISN: {currentStudent.nisn} &middot; Kelas: {currentStudent.className}
                  </p>
                </div>

                <button
                  onClick={() => onSelectStudentReport(currentStudent.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Lembar Rapor Lengkap</span>
                </button>
              </div>

              {/* Homeroom form */}
              <form onSubmit={handleSaveHomeroomNotes} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Penilaian Sikap & Karakter</label>
                    <select
                      value={attitude}
                      onChange={(e) => setAttitude(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Sangat Baik">Sangat Baik (A)</option>
                      <option value="Baik">Baik (B)</option>
                      <option value="Cukup">Cukup (C)</option>
                      <option value="Kurang">Kurang (D)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keputusan Kenaikan / Kelulusan</label>
                    <select
                      value={promotion}
                      onChange={(e) => setPromotion(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold text-blue-900"
                    >
                      <option value="Naik ke Kelas Berikutnya">Naik ke Kelas Berikutnya</option>
                      <option value="Tinggal di Kelas">Tinggal di Kelas</option>
                      <option value="Lulus">Lulus (Tingkat XII)</option>
                      <option value="Belum Ditentukan">Belum Ditentukan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Pembinaan Wali Kelas (Dicetak pada Halaman Rapor Resmi) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Tuliskan catatan perkembangan karakter, apresiasi, dan motivasi belajar peserta didik..."
                    className="w-full p-3 border border-slate-300 rounded-lg leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Catatan & Validasi Rapor</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Pilih salah satu siswa di sebelah kiri untuk mengelola rapor dan catatan binaan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
