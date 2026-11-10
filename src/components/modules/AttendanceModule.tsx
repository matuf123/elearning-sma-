import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Save,
  Download,
  Users,
} from 'lucide-react';
import { AttendanceRecord, StudentDetail, ClassInfo, Profile } from '../../types/database';

interface AttendanceModuleProps {
  attendance: AttendanceRecord[];
  students: StudentDetail[];
  classes: ClassInfo[];
  currentUser: Profile;
  onSaveAttendance: (updated: AttendanceRecord[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  attendance,
  students,
  classes,
  currentUser,
  onSaveAttendance,
  onLogAudit,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('XI MIPA 1');
  const [selectedDate, setSelectedDate] = useState<string>('2025-02-28');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>>({
    'std-1': 'Hadir',
    'std-2': 'Hadir',
    'std-3': 'Sakit',
    'std-4': 'Hadir',
  });
  const [notification, setNotification] = useState<string | null>(null);

  const isTeacherOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru' ||
    currentUser.role === 'wali_kelas' ||
    currentUser.role === 'operator';

  const classStudents = students.filter((s) => s.className === selectedClass);

  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    const newRecords: AttendanceRecord[] = classStudents.map((std) => ({
      id: `att-${std.id}-${selectedDate}`,
      studentId: std.id,
      studentName: std.profile.fullName,
      className: std.className,
      date: selectedDate,
      status: attendanceState[std.id] || 'Hadir',
    }));

    // Filter out existing records for this class and date, then prepend new ones
    const existingOthers = attendance.filter(
      (a) => !(a.className === selectedClass && a.date === selectedDate)
    );
    const updated = [...newRecords, ...existingOthers];
    onSaveAttendance(updated);

    onLogAudit('INPUT_ABSENSI', selectedClass, `Pencatatan presensi tanggal ${selectedDate}`);
    setNotification(`Presensi kelas ${selectedClass} tanggal ${selectedDate} berhasil disimpan.`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Stats
  const hadirCount = Object.values(attendanceState).filter((s) => s === 'Hadir').length;
  const sakitCount = Object.values(attendanceState).filter((s) => s === 'Sakit').length;
  const izinCount = Object.values(attendanceState).filter((s) => s === 'Izin').length;
  const alpaCount = Object.values(attendanceState).filter((s) => s === 'Alpa').length;
  const total = classStudents.length || 1;
  const hadirPct = Math.round((hadirCount / total) * 100);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Manajemen Absensi & Presensi Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan kehadiran harian, monitoring kehadiran real-time SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Presensi Hari Ini</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and stats strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 tabular-nums"
            />
          </div>
        </div>

        <div className="md:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-around text-center">
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
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase">% Hadir</p>
            <p className="text-lg font-bold text-blue-900 font-mono tabular-nums">{hadirPct}%</p>
          </div>
        </div>
      </div>

      {/* Attendance Form Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Nama Siswa</th>
              <th className="px-4 py-3">NISN / NIS</th>
              <th className="px-4 py-3 text-center">Status Kehadiran</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((std, idx) => {
              const currentStatus = attendanceState[std.id] || 'Hadir';
              return (
                <tr key={std.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{std.profile.fullName}</p>
                    <p className="text-[10px] text-slate-400">{std.className}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                    {std.nisn} / {std.nis}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((status) => {
                        const isSelected = currentStatus === status;
                        let activeClass = 'bg-blue-900 text-white';
                        if (status === 'Hadir') activeClass = 'bg-emerald-600 text-white';
                        if (status === 'Sakit') activeClass = 'bg-amber-600 text-white';
                        if (status === 'Izin') activeClass = 'bg-blue-600 text-white';
                        if (status === 'Alpa') activeClass = 'bg-rose-600 text-white';

                        return (
                          <button
                            key={status}
                            disabled={!isTeacherOrAdmin}
                            onClick={() => handleStatusChange(std.id, status)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                              isSelected ? activeClass : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                    {currentStatus === 'Hadir' ? 'Tepat Waktu' : `Keterangan tercatat (${currentStatus})`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
