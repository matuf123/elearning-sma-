import React from 'react';
import {
  Users,
  Award,
  CalendarDays,
  FileCheck2,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { StudentDetail, StudentGrade, AttendanceRecord, ReportCard, Profile, Announcement } from '../../types/database';

interface ParentDashboardModuleProps {
  students: StudentDetail[];
  grades: StudentGrade[];
  attendance: AttendanceRecord[];
  reportCards: ReportCard[];
  announcements: Announcement[];
  currentUser: Profile;
  onViewReportCard: (studentId: string) => void;
}

export const ParentDashboardModule: React.FC<ParentDashboardModuleProps> = ({
  students,
  grades,
  attendance,
  reportCards,
  announcements,
  currentUser,
  onViewReportCard,
}) => {
  // Connected child (Muhammad Rizky Pratama)
  const child = students[0];
  const childGrades = grades.filter((g) => g.studentId === child?.id);
  const childAttendance = attendance.filter((a) => a.studentId === child?.id);
  const childReport = reportCards.find((r) => r.studentId === child?.id);

  const hadirCount = childAttendance.filter((a) => a.status === 'Hadir').length || 5;
  const sakitCount = childAttendance.filter((a) => a.status === 'Sakit').length || 0;
  const izinCount = childAttendance.filter((a) => a.status === 'Izin').length || 0;
  const alpaCount = childAttendance.filter((a) => a.status === 'Alpa').length || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          Portal Monitoring Orang Tua / Wali Murid
        </h1>
        <p className="text-xs text-slate-500">
          Pemantauan kehadiran harian, nilai akademik, dan catatan perkembangan ananda di SMA PGRI 4 GANDRUNGMANGU
        </p>
      </div>

      {/* Child Bio Header Card */}
      {child && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-2xl border-2 border-blue-400">
              {child.profile.fullName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Peserta Didik Binaan
              </span>
              <h2 className="text-xl font-bold">{child.profile.fullName}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelas: <span className="font-semibold text-white">{child.className}</span> &middot; NISN: <span className="font-mono text-white">{child.nisn}</span> &middot; NIS: <span className="font-mono text-white">{child.nis}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewReportCard(child.id)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Buka Rapor Digital Anak
          </button>
        </div>
      )}

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
            <span>Presensi Kehadiran Anak</span>
            <CalendarDays className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center mt-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Hadir</p>
              <p className="text-lg font-bold text-emerald-700 font-mono tabular-nums">{hadirCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Sakit</p>
              <p className="text-lg font-bold text-amber-600 font-mono tabular-nums">{sakitCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Izin</p>
              <p className="text-lg font-bold text-blue-600 font-mono tabular-nums">{izinCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Alpa</p>
              <p className="text-lg font-bold text-rose-600 font-mono tabular-nums">{alpaCount}</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-3 text-center">
            Tingkat Kehadiran: 98% (Sangat Baik)
          </p>
        </div>

        {/* Academic Performance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
            <span>Rata-Rata Nilai Mapel</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2 font-mono tabular-nums">
            91.4 <span className="text-xs font-normal text-slate-400">/ 100 (Predikat A)</span>
          </p>
          <p className="text-[11px] text-slate-600 mt-2">
            Seluruh 6 mata pelajaran melampaui KKM sekolah (75.00).
          </p>
        </div>

        {/* Homeroom Note */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
            <span>Pesan Wali Kelas</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-slate-700 italic mt-2 leading-relaxed line-clamp-3">
            "{childReport?.homeroomNotes || 'Ananda sangat rajin dan santun dalam KBM sehari-hari.'}"
          </p>
          <p className="text-[10px] text-slate-400 mt-2">
            Wali Kelas: Rina Wulandari, S.Pd.
          </p>
        </div>
      </div>

      {/* Child Grades Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Rekap Nilai Perkembangan Anak per Mata Pelajaran
          </h3>
          <span className="text-xs text-slate-500 font-medium">Semester Genap 2024/2025</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Mata Pelajaran</th>
              <th className="px-4 py-3 text-center">Tugas</th>
              <th className="px-4 py-3 text-center">Kuis</th>
              <th className="px-4 py-3 text-center">PTS</th>
              <th className="px-4 py-3 text-center font-bold text-blue-900">Nilai Akhir</th>
              <th className="px-4 py-3 text-center">Predikat</th>
              <th className="px-4 py-3">Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {childGrades.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">{g.subjectName}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{g.assignmentScore}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{g.quizScore}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{g.midtermScore}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-900 font-mono text-sm tabular-nums">
                  {g.finalGrade}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {g.letterGrade}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-[11px] leading-relaxed">
                  {g.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
