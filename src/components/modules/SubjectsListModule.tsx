import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  GraduationCap,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { Subject, Profile } from '../../types/database';

interface SubjectsListModuleProps {
  subjects: Subject[];
  currentUser: Profile;
}

export const SubjectsListModule: React.FC<SubjectsListModuleProps> = ({
  subjects,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalJP = subjects.reduce((acc, curr) => acc + (curr.creditHours || 0), 0);
  const avgKKM =
    subjects.length > 0
      ? (subjects.reduce((acc, curr) => acc + (curr.kkm || 0), 0) / subjects.length).toFixed(1)
      : '75';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Kurikulum SMA Nasional
            </span>
            <span className="text-xs text-slate-400">&middot;</span>
            <span className="text-xs font-semibold text-slate-600">SMA PGRI 4 GANDRUNGMANGU</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Daftar Mata Pelajaran SMA ({subjects.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Seluruh 21 mata pelajaran ditampilkan secara langsung tanpa pemisahan rumpun atau batasan kategori pilihan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Daftar Mapel</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Mata Pelajaran</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">
            {subjects.length} <span className="text-xs font-normal text-slate-500">Mapel</span>
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">Lengkap 21 mapel</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Jam Pelajaran</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">
            {totalJP} <span className="text-xs font-normal text-slate-500">JP / Pekan</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Beban tatap muka terdistribusi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Standar KKM Rata-rata</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1.5 tabular-nums">
            {avgKKM} <span className="text-xs font-normal text-slate-500">Poin</span>
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Standar Ketuntasan Minimal</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Status Kurikulum</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-base font-bold text-slate-900 mt-2 truncate">
            SMA PGRI 4
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Cilacap, Jawa Tengah</p>
        </div>
      </div>

      {/* Search Input (No rumpun filters, no category checkboxes) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari mata pelajaran berdasarkan nama atau kode..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-slate-900">{filteredSubjects.length}</span> dari {subjects.length} mata pelajaran
        </div>
      </div>

      {/* Clean Subjects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-center w-14">No</th>
                <th className="px-4 py-3.5 w-28">Kode Mapel</th>
                <th className="px-4 py-3.5">Nama Mata Pelajaran</th>
                <th className="px-4 py-3.5 text-center w-28">Beban Belajar</th>
                <th className="px-4 py-3.5 text-center w-20">KKM</th>
                <th className="px-4 py-3.5">Guru Pengampu</th>
                <th className="px-4 py-3.5 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-center font-mono text-slate-400 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-900">
                    <span className="bg-blue-50 text-blue-900 border border-blue-200/80 px-2 py-0.5 rounded text-[11px]">
                      {sub.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {sub.name}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-700 tabular-nums">
                    {sub.creditHours} JP
                  </td>
                  <td className="px-4 py-3 text-center font-bold font-mono tabular-nums">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      {sub.kkm}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">
                        {sub.teacherName ? sub.teacherName.charAt(0) : '-'}
                      </div>
                      <span className="font-medium text-slate-800 truncate">{sub.teacherName || 'Belum Ditugaskan'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Aktif</span>
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Tidak ditemukan mata pelajaran dengan kata kunci "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
