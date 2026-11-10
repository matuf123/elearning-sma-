import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Building,
  CalendarDays,
} from 'lucide-react';
import { ClassInfo, Subject, ScheduleItem, TeacherDetail, SchoolSetting } from '../../types/database';

interface AcademicManagementProps {
  classes: ClassInfo[];
  subjects: Subject[];
  schedules: ScheduleItem[];
  teachers: TeacherDetail[];
  settings: SchoolSetting;
  onSaveClasses: (updated: ClassInfo[]) => void;
  onSaveSubjects: (updated: Subject[]) => void;
  onSaveSchedules: (updated: ScheduleItem[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const AcademicManagement: React.FC<AcademicManagementProps> = ({
  classes,
  subjects,
  schedules,
  teachers,
  settings,
  onSaveClasses,
  onSaveSubjects,
  onSaveSchedules,
  onLogAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'rombel' | 'mapel' | 'jadwal' | 'kalender'>('rombel');
  const [notification, setNotification] = useState<string | null>(null);

  // Class form
  const [showAddClass, setShowAddClass] = useState(false);
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<'X' | 'XI' | 'XII'>('XI');
  const [deptCode, setDeptCode] = useState<'MIPA' | 'IPS' | 'FASE_E' | 'FASE_F'>('MIPA');
  const [homeroomId, setHomeroomId] = useState(teachers[0]?.profileId || '');
  const [roomNum, setRoomNum] = useState('');

  // Subject form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subHours, setSubHours] = useState(3);
  const [subKkm, setSubKkm] = useState(75);
  const [subTeacherId, setSubTeacherId] = useState(teachers[0]?.profileId || '');

  // Schedule form
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [schClassId, setSchClassId] = useState(classes[0]?.id || '');
  const [schSubjectId, setSchSubjectId] = useState(subjects[0]?.id || '');
  const [schDay, setSchDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');
  const [schStartTime, setSchStartTime] = useState('07:30');
  const [schEndTime, setSchEndTime] = useState('09:00');
  const [schRoom, setSchRoom] = useState('R. 201');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const homeroomTeacher = teachers.find((t) => t.profileId === homeroomId);
    const newClass: ClassInfo = {
      id: 'cls-' + Date.now(),
      academicYear: settings.activeAcademicYear,
      departmentCode: deptCode,
      gradeLevel,
      name: className,
      homeroomTeacherId: homeroomId,
      homeroomTeacherName: homeroomTeacher ? homeroomTeacher.profile.fullName : 'Belum Ditentukan',
      roomNumber: roomNum || 'R. Baru',
      capacity: 36,
      totalStudents: 32,
    };
    onSaveClasses([...classes, newClass]);
    onLogAudit('TAMBAH_ROMBEL', className, `Membuat kelas baru ${className} (${deptCode})`);
    showNotice(`Kelas ${className} berhasil ditambahkan.`);
    setShowAddClass(false);
    setClassName('');
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Hapus rombongan belajar ${name}?`)) {
      onSaveClasses(classes.filter((c) => c.id !== id));
      onLogAudit('HAPUS_ROMBEL', name, 'Menghapus rombongan belajar');
      showNotice(`Kelas ${name} telah dihapus.`);
    }
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const tch = teachers.find((t) => t.profileId === subTeacherId);
    const newSub: Subject = {
      id: 'sub-' + Date.now(),
      code: subCode.toUpperCase(),
      name: subName,
      creditHours: Number(subHours),
      kkm: Number(subKkm),
      teacherId: subTeacherId,
      teacherName: tch ? tch.profile.fullName : '',
    };
    onSaveSubjects([...subjects, newSub]);
    onLogAudit('TAMBAH_MAPEL', subName, `Membuat mata pelajaran ${subName} (${subCode})`);
    showNotice(`Mata pelajaran ${subName} berhasil disimpan.`);
    setShowAddSubject(false);
    setSubName('');
    setSubCode('');
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (confirm(`Hapus mata pelajaran ${name}?`)) {
      onSaveSubjects(subjects.filter((s) => s.id !== id));
      onLogAudit('HAPUS_MAPEL', name, 'Menghapus mata pelajaran');
      showNotice(`Mata pelajaran ${name} telah dihapus.`);
    }
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find((c) => c.id === schClassId);
    const sub = subjects.find((s) => s.id === schSubjectId);
    const newSch: ScheduleItem = {
      id: 'sch-' + Date.now(),
      classId: schClassId,
      className: cls ? cls.name : '',
      subjectId: schSubjectId,
      subjectName: sub ? sub.name : '',
      teacherId: sub?.teacherId || '',
      teacherName: sub?.teacherName || 'Guru Pengampu',
      dayOfWeek: schDay,
      startTime: schStartTime,
      endTime: schEndTime,
      room: schRoom,
    };
    onSaveSchedules([...schedules, newSch]);
    onLogAudit('TAMBAH_JADWAL', sub?.name || '', `Menambahkan jadwal ${schDay} ${schStartTime}-${schEndTime}`);
    showNotice('Jadwal pelajaran berhasil ditambahkan.');
    setShowAddSchedule(false);
  };

  const handleDeleteSchedule = (id: string) => {
    onSaveSchedules(schedules.filter((s) => s.id !== id));
    showNotice('Jadwal pelajaran telah dihapus.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Manajemen Akademik & Kurikulum
          </h1>
          <p className="text-xs text-slate-500">
            Konfigurasi Rombel, Mata Pelajaran, Jadwal Mengajar, dan Kalender Pendidikan SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-xs font-semibold border border-blue-200">
            TA: {settings.activeAcademicYear} ({settings.activeSemester})
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('rombel')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'rombel'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rombongan Belajar ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('mapel')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'mapel'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Mata Pelajaran ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'jadwal'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Jadwal Pelajaran ({schedules.length})
        </button>
        <button
          onClick={() => setActiveTab('kalender')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'kalender'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kalender Pendidikan
        </button>
      </div>

      {/* TAB 1: ROMBEL */}
      {activeTab === 'rombel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Kelas & Wali Kelas
            </h3>
            <button
              onClick={() => setShowAddClass(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kelas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{cls.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {cls.departmentCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Wali Kelas:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]">
                      {cls.homeroomTeacherName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ruangan:</span>
                    <span className="font-semibold text-slate-700">{cls.roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kapasitas:</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {cls.totalStudents} / {cls.capacity} Siswa
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MAPEL */}
      {activeTab === 'mapel' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daftar Mata Pelajaran SMA ({subjects.length})
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh 21 mata pelajaran SMA PGRI 4 Gandrungmangu ditampilkan secara langsung tanpa pembatasan rumpun atau filter kategori.
              </p>
            </div>
            <button
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-3 text-center w-12">No</th>
                  <th className="px-4 py-3 w-28">Kode</th>
                  <th className="px-4 py-3">Nama Mata Pelajaran</th>
                  <th className="px-4 py-3 text-center w-28">Beban Jam</th>
                  <th className="px-4 py-3 text-center w-20">KKM</th>
                  <th className="px-4 py-3">Guru Pengampu</th>
                  <th className="px-4 py-3 text-right w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-center font-mono text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-900">{sub.code}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                    <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-700">{sub.creditHours} JP</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700 font-mono tabular-nums">
                      {sub.kkm}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{sub.teacherName || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Hapus mata pelajaran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL */}
      {activeTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Jadwal Pelajaran Mingguan
            </h3>
            <button
              onClick={() => setShowAddSchedule(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jadwal KBM</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Hari</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Mata Pelajaran</th>
                  <th className="px-4 py-3">Guru Pengampu</th>
                  <th className="px-4 py-3">Ruang</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-blue-900">{sch.dayOfWeek}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 tabular-nums">
                      {sch.startTime} - {sch.endTime}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{sch.className}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{sch.subjectName}</td>
                    <td className="px-4 py-3 text-slate-700">{sch.teacherName}</td>
                    <td className="px-4 py-3 text-slate-600">{sch.room}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSchedule(sch.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: KALENDER */}
      {activeTab === 'kalender' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <CalendarDays className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kalender Akademik Semester Genap TA 2024/2025
              </h3>
              <p className="text-xs text-slate-500">
                Agenda resmi pembelajaran dan evaluasi SMA PGRI 4 GANDRUNGMANGU
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <span className="font-bold text-blue-900">06 Januari 2025</span>
              <h4 className="font-bold text-slate-900 mt-1">Hari Pertama Masuk Semester Genap</h4>
              <p className="text-slate-600 mt-0.5">Apel pembukaan KBM dan penyerahan jadwal baru.</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900">17 - 22 Maret 2025</span>
              <h4 className="font-bold text-slate-900 mt-1">Penilaian Tengah Semester (PTS) Genap</h4>
              <p className="text-slate-600 mt-0.5">CBT serentak untuk jenjang kelas X, XI, dan XII.</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900">02 - 13 Juni 2025</span>
              <h4 className="font-bold text-slate-900 mt-1">Sumatif Akhir Semester (SAS / PAS)</h4>
              <p className="text-slate-600 mt-0.5">Evaluasi akhir kenaikan kelas dan kelulusan.</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <span className="font-bold text-purple-900">20 Juni 2025</span>
              <h4 className="font-bold text-slate-900 mt-1">Pembagian Rapor Digital Kurikulum Merdeka</h4>
              <p className="text-slate-600 mt-0.5">Penyerahan dokumen laporan hasil belajar kepada orang tua.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Class */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Tambah Rombongan Belajar Baru
            </h3>
            <form onSubmit={handleCreateClass} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: XI MIPA 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok Rombel</label>
                  <select
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="FASE_E">Fase E (Kelas X)</option>
                    <option value="FASE_F">Fase F (Kelas XI/XII)</option>
                    <option value="MIPA">Peminatan MIPA</option>
                    <option value="IPS">Peminatan IPS</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wali Kelas</label>
                <select
                  value={homeroomId}
                  onChange={(e) => setHomeroomId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.profileId}>
                      {t.profile.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruang Kelas</label>
                <input
                  type="text"
                  value={roomNum}
                  onChange={(e) => setRoomNum(e.target.value)}
                  placeholder="R. 203"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Subject */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Tambah Mata Pelajaran Baru
            </h3>
            <form onSubmit={handleCreateSubject} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Mapel *</label>
                <input
                  type="text"
                  required
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="KODE-01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Masukkan nama mata pelajaran..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Beban (JP)</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={subHours}
                    onChange={(e) => setSubHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KKM Sekolah</label>
                  <input
                    type="number"
                    min={60}
                    max={100}
                    value={subKkm}
                    onChange={(e) => setSubKkm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pengampu</label>
                <select
                  value={subTeacherId}
                  onChange={(e) => setSubTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.profileId}>
                      {t.profile.fullName} ({t.fieldOfStudy})
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Schedule */}
      {showAddSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Tambah Jadwal Pelajaran
            </h3>
            <form onSubmit={handleCreateSchedule} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas *</label>
                  <select
                    value={schClassId}
                    onChange={(e) => setSchClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari *</label>
                  <select
                    value={schDay}
                    onChange={(e) => setSchDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran *</label>
                <select
                  value={schSubjectId}
                  onChange={(e) => setSchSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.teacherName})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={schStartTime}
                    onChange={(e) => setSchStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={schEndTime}
                    onChange={(e) => setSchEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruang</label>
                <input
                  type="text"
                  value={schRoom}
                  onChange={(e) => setSchRoom(e.target.value)}
                  placeholder="R. 201 / Lab Komputer"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSchedule(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
