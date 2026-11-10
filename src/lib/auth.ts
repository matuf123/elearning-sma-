/**
 * Authentication & RBAC validation service for SMA PGRI 4 GANDRUNGMANGU
 */

import { Profile, UserRole } from '../types/database';
import { INITIAL_PROFILES } from '../data/initialData';

const CURRENT_USER_KEY = 'edusphere_current_user_id';

export function getStoredUser(profiles: Profile[]): Profile {
  const storedId = typeof window !== 'undefined' ? localStorage.getItem(CURRENT_USER_KEY) : null;
  if (storedId) {
    const found = profiles.find((p) => p.id === storedId);
    if (found) return found;
  }
  // Default to Super Admin for immediate exploration, or Siswa/Guru
  return profiles[0] || INITIAL_PROFILES[0];
}

export function setStoredUser(profile: Profile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, profile.id);
  }
}

export function clearStoredUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin / Admin Sekolah',
  kepala_sekolah: 'Kepala Sekolah',
  wakasek_kurikulum: 'Wakasek Kurikulum',
  guru: 'Guru Mata Pelajaran',
  wali_kelas: 'Wali Kelas',
  guru_bk: 'Guru BK / Konselor',
  siswa: 'Siswa / Peserta Didik',
  orang_tua: 'Orang Tua / Wali Murid',
  operator: 'Operator Sekolah',
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  kepala_sekolah: 'bg-amber-50 text-amber-700 border-amber-200',
  wakasek_kurikulum: 'bg-blue-50 text-blue-700 border-blue-200',
  guru: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  wali_kelas: 'bg-teal-50 text-teal-700 border-teal-200',
  guru_bk: 'bg-purple-50 text-purple-700 border-purple-200',
  siswa: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  orang_tua: 'bg-orange-50 text-orange-700 border-orange-200',
  operator: 'bg-slate-100 text-slate-700 border-slate-200',
};

// RBAC Permission Helpers
export function hasPermission(role: UserRole, permission: string): boolean {
  switch (permission) {
    case 'manage_users':
      return role === 'super_admin' || role === 'operator';
    case 'view_executive_reports':
      return role === 'super_admin' || role === 'kepala_sekolah' || role === 'wakasek_kurikulum';
    case 'manage_curriculum':
      return role === 'super_admin' || role === 'wakasek_kurikulum';
    case 'create_materials':
    case 'create_assignments':
    case 'create_exams':
      return role === 'super_admin' || role === 'guru' || role === 'wali_kelas';
    case 'grade_submissions':
      return role === 'super_admin' || role === 'guru' || role === 'wali_kelas';
    case 'manage_homeroom':
      return role === 'super_admin' || role === 'wali_kelas';
    case 'manage_counseling':
      return role === 'super_admin' || role === 'guru_bk' || role === 'kepala_sekolah';
    case 'submit_assignments':
    case 'take_exams':
      return role === 'siswa';
    case 'view_child_data':
      return role === 'orang_tua';
    case 'manage_settings':
      return role === 'super_admin' || role === 'operator';
    default:
      return true;
  }
}
