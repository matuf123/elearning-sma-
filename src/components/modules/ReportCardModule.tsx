import React, { useState } from 'react';
import {
  Printer,
  Download,
  Award,
  CheckCircle2,
  Calendar,
  User,
  School,
  FileCheck,
} from 'lucide-react';
import { Letterhead } from '../common/Letterhead';
import { ReportCard, SchoolSetting, StudentDetail, Profile } from '../../types/database';

interface ReportCardModuleProps {
  reportCards: ReportCard[];
  students: StudentDetail[];
  settings: SchoolSetting;
  currentUser: Profile;
  targetStudentId?: string;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const ReportCardModule: React.FC<ReportCardModuleProps> = ({
  reportCards,
  students,
  settings,
  currentUser,
  targetStudentId,
  onLogAudit,
}) => {
  // If currentUser is student, lock to own report card
  const isStudent = currentUser.role === 'siswa';
  const defaultStudentId = isStudent
    ? students.find((s) => s.profileId === currentUser.id)?.id || students[0]?.id
    : targetStudentId || students[0]?.id;

  const [activeStudentId, setActiveStudentId] = useState<string>(defaultStudentId || '');

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const activeReport =
    reportCards.find((r) => r.studentId === activeStudent?.id) || reportCards[0];

  const handlePrint = () => {
    onLogAudit('CETAK_RAPOR', activeStudent?.profile.fullName || '', 'Mencetak dokumen resmi Rapor Digital Kurikulum Merdeka');
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden during print) */}
      <div className="no-print pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Rapor Digital Kurikulum Merdeka
          </h1>
          <p className="text-xs text-slate-500">
            Laporan Hasil Capaian Kompetensi Belajar Peserta Didik SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isStudent && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Pilih Siswa:</span>
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.profile.fullName} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Card Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Kop Surat Resmi */}
        <Letterhead
          settings={settings}
          documentTitle="LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR)"
          documentNumber="421.3 / 184 / RAPOR / 2025"
        />

        {/* Identitas Siswa */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-slate-800 my-5 pb-4 border-b border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Nama Peserta Didik:</span>
            <span className="font-bold text-slate-900 uppercase">
              {activeStudent ? activeStudent.profile.fullName : activeReport.studentName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Kelas / Fase:</span>
            <span className="font-bold text-slate-900">
              {activeStudent?.className || activeReport.className} / Fase F
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Nomor Induk Siswa (NIS):</span>
            <span className="font-mono text-slate-900 tabular-nums">
              {activeStudent?.nis || activeReport.nis}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Semester:</span>
            <span className="font-bold text-slate-900">{activeReport.semester} (Genap)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">NISN:</span>
            <span className="font-mono text-slate-900 tabular-nums">
              {activeStudent?.nisn || activeReport.nisn}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Tahun Ajaran:</span>
            <span className="font-mono text-slate-900 tabular-nums">{activeReport.academicYear}</span>
          </div>
        </div>

        {/* Tabel Capaian Kompetensi Mata Pelajaran */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            A. Capaian Hasil Belajar Mata Pelajaran
          </h3>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300 text-center w-8">No</th>
                <th className="px-3 py-2 border-r border-slate-300 w-52">Mata Pelajaran</th>
                <th className="px-3 py-2 border-r border-slate-300 text-center w-14">KKM</th>
                <th className="px-3 py-2 border-r border-slate-300 text-center w-16">Nilai Akhir</th>
                <th className="px-3 py-2 border-r border-slate-300 text-center w-14">Predikat</th>
                <th className="px-3 py-2">Capaian Kompetensi (Kurikulum Merdeka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeReport.grades.map((grd, idx) => (
                <tr key={idx} className="print-break-inside-avoid">
                  <td className="px-3 py-2 text-center border-r border-slate-300 font-mono tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900 border-r border-slate-300">
                    {grd.subjectName}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-slate-300 font-mono tabular-nums">
                    {grd.kkm}
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-slate-900 border-r border-slate-300 font-mono tabular-nums">
                    {grd.score}
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-blue-900 border-r border-slate-300">
                    {grd.letterGrade}
                  </td>
                  <td className="px-3 py-2 text-slate-700 leading-snug">
                    {grd.competencyAchievement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ekstrakurikuler & Kehadiran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs print-break-inside-avoid">
          {/* Ekstrakurikuler */}
          <div className="border border-slate-300 rounded-lg p-3 space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">
              B. Kegiatan Ekstrakurikuler
            </h4>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
              {activeReport.extracurricularNotes || 'Pramuka (Predikat Baik)'}
            </div>
          </div>

          {/* Ketidakhadiran */}
          <div className="border border-slate-300 rounded-lg p-3 space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">
              C. Rekapitulasi Ketidakhadiran
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>1. Sakit (S):</span>
                <span className="font-bold font-mono tabular-nums">{activeReport.attendanceSummary.sakit} hari</span>
              </div>
              <div className="flex justify-between">
                <span>2. Izin (I):</span>
                <span className="font-bold font-mono tabular-nums">{activeReport.attendanceSummary.izin} hari</span>
              </div>
              <div className="flex justify-between">
                <span>3. Tanpa Keterangan (A):</span>
                <span className="font-bold font-mono tabular-nums">{activeReport.attendanceSummary.alpa} hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Wali Kelas */}
        <div className="mt-4 border border-slate-300 rounded-lg p-3 text-xs space-y-1 print-break-inside-avoid">
          <h4 className="font-bold text-slate-900 uppercase text-[11px]">
            D. Catatan Wali Kelas
          </h4>
          <p className="text-slate-800 leading-relaxed italic">
            "{activeReport.homeroomNotes}"
          </p>
        </div>

        {/* Status Kenaikan Kelas */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs flex items-center justify-between print-break-inside-avoid">
          <span className="font-bold text-slate-900">Keputusan Akhir Semester:</span>
          <span className="font-bold text-blue-900 uppercase tracking-wide">
            {activeReport.promotionStatus}
          </span>
        </div>

        {/* Tanda Tangan Resmi Pengesahan */}
        <div className="grid grid-cols-3 gap-6 text-center text-xs text-slate-800 mt-12 pt-6 border-t border-slate-200 print-break-inside-avoid">
          <div>
            <p>Mengetahui,</p>
            <p className="font-medium mt-0.5">Orang Tua / Wali Murid</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">( ......................................... )</p>
          </div>

          <div>
            <p>Gandrungmangu, 20 Juni 2025</p>
            <p className="font-medium mt-0.5">Wali Kelas XI MIPA 1</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">{activeReport.homeroomTeacherName}</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. 19841103 200902 2 006</p>
          </div>

          <div>
            <p>Mengetahui,</p>
            <p className="font-medium mt-0.5">Kepala SMA PGRI 4 Gandrungmangu</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">{settings.principalName}</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. {settings.principalNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
