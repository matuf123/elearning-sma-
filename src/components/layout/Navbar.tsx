import React, { useState } from 'react';
import {
  School,
  UserCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
  Shield,
  Bell,
  Search,
} from 'lucide-react';
import { Profile, SchoolSetting, UserRole } from '../../types/database';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../lib/auth';

interface NavbarProps {
  currentUser: Profile;
  profiles: Profile[];
  settings: SchoolSetting;
  onSwitchUser: (profile: Profile) => void;
  onViewLanding: () => void;
  onOpenNotifications: () => void;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  profiles,
  settings,
  onSwitchUser,
  onViewLanding,
  onOpenNotifications,
  searchTerm,
  onSearchChange,
}) => {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark with school identity */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onViewLanding}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
          title="Buka Beranda EduSphere SMA PGRI 4 Gandrungmangu"
        >
          <img
            src={settings.logoUrl || '/src/assets/images/school_emblem_1794204647075.jpg'}
            alt="Logo Sekolah"
            className="w-8 h-8 rounded-full object-contain border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-blue-950 whitespace-nowrap">
              EduSphere
            </span>
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
              SMA PGRI 4 GANDRUNGMANGU
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Search input + role badge indicator */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari siswa, guru, materi, tugas, ujian..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Zone 3: Quick Role Switcher + User Profile Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Role Switcher for Evaluators & Multi-Role Testing */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Ganti Peran Akun (Super Admin, Kepsek, Guru, Siswa, Ortu, BK, dll)"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-slate-500">Ganti Peran:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[120px]">
              {ROLE_LABELS[currentUser.role]?.split('/')[0]?.trim()}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Uji Coba 9 Role Sistem
                </p>
                <p className="text-[11px] text-slate-600">
                  Pilih salah satu peran untuk menguji hak akses RBAC:
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto py-1">
                {profiles.map((p) => {
                  const isSelected = p.id === currentUser.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSwitchUser(p);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 uppercase shrink-0">
                        {p.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {p.fullName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {ROLE_LABELS[p.role]}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Notifikasi Pengumuman"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Avatar & Details */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {currentUser.nipNisn || ROLE_LABELS[currentUser.role]?.split('/')[0]}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-1.5">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${ROLE_BADGE_COLORS[currentUser.role]}`}>
                    {ROLE_LABELS[currentUser.role]}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onViewLanding();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  Lihat Halaman Publik Sekolah
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onViewLanding();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  Keluar ke Landing Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
