import React from 'react';
import { SchoolSetting } from '../../types/database';

interface LetterheadProps {
  settings: SchoolSetting;
  documentTitle?: string;
  documentNumber?: string;
}

export const Letterhead: React.FC<LetterheadProps> = ({
  settings,
  documentTitle,
  documentNumber,
}) => {
  return (
    <div className="w-full mb-6 text-slate-900">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        {/* Logo Sekolah */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          <img
            src={settings.logoUrl || '/src/assets/images/school_emblem_1794204647075.jpg'}
            alt="Logo SMA PGRI 4 Gandrungmangu"
            className="w-18 h-18 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Identitas Kop Surat */}
        <div className="flex-1 text-center px-4">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
            Yayasan Pembina Lembaga Pendidikan Dasar & Menengah PGRI Cilacap
          </h4>
          <h1 className="text-xl font-bold tracking-tight uppercase text-slate-900">
            {settings.schoolName}
          </h1>
          <p className="text-xs font-medium text-slate-700">
            TERAKREDITASI {settings.accreditation} &middot; NPSN: {settings.npsn}
          </p>
          <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
            {settings.address}
          </p>
          <p className="text-[10px] text-slate-500">
            Telp: {settings.phoneNumber} &middot; Email: {settings.email} &middot; Website: {settings.website}
          </p>
        </div>

        {/* Right Badge / PGRI Seal */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center opacity-90">
          <div className="w-16 h-16 rounded-full border border-slate-300 flex flex-col items-center justify-center text-center p-1 bg-slate-50">
            <span className="text-[9px] font-bold text-blue-900">YPLP PGRI</span>
            <span className="text-[8px] text-slate-600">CILACAP</span>
          </div>
        </div>
      </div>

      {/* Double Border Line */}
      <div className="h-0.5 bg-slate-900 mt-0.5"></div>

      {documentTitle && (
        <div className="text-center mt-4 mb-2">
          <h2 className="text-base font-bold uppercase tracking-wide underline underline-offset-4">
            {documentTitle}
          </h2>
          {documentNumber && (
            <p className="text-xs text-slate-600 mt-1">
              Nomor: {documentNumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
