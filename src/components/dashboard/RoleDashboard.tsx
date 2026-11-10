import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  FileCheck2,
  CheckSquare,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Bell,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Profile,
  SchoolSetting,
  ClassInfo,
  StudentDetail,
  TeacherDetail,
  ScheduleItem,
  Assignment,
  OnlineExam,
  Announcement,
  StudentGrade,
} from '../../types/database';
import { ROLE_LABELS } from '../../lib/auth';

interface RoleDashboardProps {
  currentUser: Profile;
  settings: SchoolSetting;
  students: StudentDetail[];
  teachers: TeacherDetail[];
  classes: ClassInfo[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  exams: OnlineExam[];
  announcements: Announcement[];
  grades: StudentGrade[];
  onNavigate: (moduleId: string) => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  currentUser,
  settings,
  students,
  teachers,
  classes,
  schedules,
  assignments,
  exams,
  announcements,
  grades,
  onNavigate,
}) => {
  // Chart data: Attendance Trend
  const attendanceTrendData = [
    { day: 'Sen', hadir: 97.5, sakit: 1.5, izin: 1.0 },
    { day: 'Sel', hadir: 98.2, sakit: 1.0, izin: 0.8 },
    { day: 'Rab', hadir: 96.8, sakit: 2.1, izin: 1.1 },
    { day: 'Kam', hadir: 97.9, sakit: 1.2, izin: 0.9 },
    { day: 'Jum', hadir: 99.1, sakit: 0.5, izin: 0.4 },
    { day: 'Sab', hadir: 96.0, sakit: 2.5, izin: 1.5 },
  ];

  // Chart data: Grade distribution
  const gradeDistributionData = [
    { range: '90-100 (A)', count: 42, color: '#2563eb' },
    { range: '80-89 (B)', count: 68, color: '#059669' },
    { range: '75-79 (C)', count: 24, color: '#d97706' },
    { range: '< 75 (Remedial)', count: 6, color: '#dc2626' },
  ];

  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;
  const totalClassesCount = classes.length;
  const activeAssignmentsCount = assignments.length;
  const activeExamsCount = exams.filter((e) => e.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-300">
              {settings.schoolName}
            </span>
            <span className="text-slate-500">&middot;</span>
            <span className="text-[11px] text-blue-200">Semester {settings.activeSemester} TA {settings.activeAcademicYear}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Anda masuk sebagai <span className="font-semibold text-white">{ROLE_LABELS[currentUser.role]}</span>. Seluruh data akademik terhubung ke basis data terpusat.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('learning')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Ruang Belajar Digital
          </button>
          <button
            onClick={() => onNavigate('report_cards')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Rapor Digital
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {totalStudentsCount} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Data Valid Dapodik</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Dewan Guru & Pendidik</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {totalTeachersCount} <span className="text-xs font-normal text-slate-500">Guru</span>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <span>Semua rombel terfasilitasi</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Rombel & Kelas Aktif</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {totalClassesCount} <span className="text-xs font-normal text-slate-500">Kelas</span>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <span>Fase E & Fase F (Kurikulum Merdeka)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Rata-Rata Kehadiran</span>
            <CalendarDays className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2 tabular-nums">
            97.8%
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <span>Tingkat kehadiran prima</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Trend Line Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tren Kehadiran Siswa Mingguan
              </h3>
              <p className="text-[11px] text-slate-500">
                SMA PGRI 4 GANDRUNGMANGU (Senin s.d. Sabtu)
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 tabular-nums">
              Rata-rata: 97.8%
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis domain={[90, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Persentase Hadir']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="hadir"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Distribusi Nilai Siswa
              </h3>
              <p className="text-[11px] text-slate-500">
                Berdasarkan capaian KKM (75.00)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              95.7% Tuntas
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} Siswa`, 'Jumlah']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Split Row: Today's Schedule & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Jadwal Pelajaran Hari Ini (Senin)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('academic')}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {schedules.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.subjectName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.className}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pengampu: {item.teacherName} &middot; Ruang: {item.room}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-blue-900 tabular-nums">
                    {item.startTime} - {item.endTime}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-medium">Sesuai Kalender KBM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Warta & Pengumuman Sekolah
              </h3>
            </div>
            <button
              onClick={() => onNavigate('communication')}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Buka Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {announcements.slice(0, 3).map((anc) => (
              <div
                key={anc.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-blue-900 uppercase">{anc.authorRole}</span>
                  <span>{anc.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{anc.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {anc.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
