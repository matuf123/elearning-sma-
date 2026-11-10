import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  FileSpreadsheet,
  CheckSquare,
  Award,
  HeartHandshake,
  Library,
  Compass,
  BarChart3,
  Settings,
  BellRing,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { Profile, UserRole } from '../../types/database';

interface SidebarProps {
  currentUser: Profile;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeModule,
  onSelectModule,
}) => {
  const allRoles: UserRole[] = [
    'super_admin',
    'kepala_sekolah',
    'wakasek_kurikulum',
    'guru',
    'wali_kelas',
    'guru_bk',
    'siswa',
    'orang_tua',
    'operator',
  ];

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: allRoles,
    },
    {
      id: 'users',
      label: 'Manajemen Pengguna',
      icon: Users,
      roles: ['super_admin', 'operator'],
    },
    {
      id: 'academic',
      label: 'Manajemen Akademik',
      icon: GraduationCap,
      roles: ['super_admin', 'wakasek_kurikulum', 'kepala_sekolah', 'operator'],
    },
    {
      id: 'learning',
      label: 'Ruang Pembelajaran',
      icon: BookOpen,
      roles: ['super_admin', 'wakasek_kurikulum', 'guru', 'wali_kelas', 'siswa'],
      badge: 'Aktif',
    },
    {
      id: 'assignments',
      label: 'Manajemen Tugas',
      icon: FileCheck2,
      roles: ['super_admin', 'guru', 'wali_kelas', 'siswa', 'orang_tua'],
    },
    {
      id: 'exams',
      label: 'Ujian Online CBT',
      icon: CheckSquare,
      roles: ['super_admin', 'wakasek_kurikulum', 'guru', 'wali_kelas', 'siswa'],
      badge: 'PTS',
    },
    {
      id: 'grades',
      label: 'Manajemen Nilai',
      icon: FileSpreadsheet,
      roles: ['super_admin', 'wakasek_kurikulum', 'guru', 'wali_kelas', 'siswa', 'orang_tua', 'kepala_sekolah'],
    },
    {
      id: 'attendance',
      label: 'Manajemen Absensi',
      icon: CalendarDays,
      roles: ['super_admin', 'wakasek_kurikulum', 'guru', 'wali_kelas', 'siswa', 'orang_tua', 'operator'],
    },
    {
      id: 'homeroom',
      label: 'Wali Kelas & Binaan',
      icon: UserCheck,
      roles: ['super_admin', 'wali_kelas', 'kepala_sekolah'],
    },
    {
      id: 'report_cards',
      label: 'Rapor Digital',
      icon: Award,
      roles: ['super_admin', 'wali_kelas', 'siswa', 'orang_tua', 'kepala_sekolah', 'wakasek_kurikulum'],
      badge: 'Merdeka',
    },
    {
      id: 'counseling',
      label: 'Kesiswaan & BK',
      icon: HeartHandshake,
      roles: ['super_admin', 'guru_bk', 'kepala_sekolah'],
    },
    {
      id: 'parent_portal',
      label: 'Monitoring Anak',
      icon: Users,
      roles: ['orang_tua'],
    },
    {
      id: 'library',
      label: 'Perpustakaan Digital',
      icon: Library,
      roles: allRoles,
    },
    {
      id: 'electives',
      label: 'Mapel Pilihan (Fase F)',
      icon: Compass,
      roles: ['super_admin', 'wakasek_kurikulum', 'guru', 'wali_kelas', 'guru_bk', 'siswa'],
      badge: 'Fase F',
    },
    {
      id: 'communication',
      label: 'Pengumuman & Pesan',
      icon: BellRing,
      roles: allRoles,
    },
    {
      id: 'reports',
      label: 'Laporan & Statistik',
      icon: BarChart3,
      roles: ['super_admin', 'kepala_sekolah', 'wakasek_kurikulum', 'operator'],
    },
    {
      id: 'settings',
      label: 'Pengaturan Sistem',
      icon: Settings,
      roles: ['super_admin', 'operator'],
    },
  ];

  const allowedNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] border-r border-slate-800">
      {/* School identity micro banner */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40">
        <p className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          Portal Terpadu Akademik
        </p>
        <p className="text-xs font-semibold text-white truncate mt-0.5">
          SMA PGRI 4 GANDRUNGMANGU
        </p>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allowedNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Tahun Ajaran:</span>
          <span className="font-semibold text-slate-300 tabular-nums">2024/2025</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Semester:</span>
          <span className="font-semibold text-slate-300">Genap</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Status Server:</span>
          <span className="text-emerald-400 font-medium">Terhubung DB</span>
        </div>
      </div>
    </aside>
  );
};
