import React, { useState } from 'react';
import {
  Library,
  Search,
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  RotateCcw,
  BookCheck,
} from 'lucide-react';
import { LibraryBook, BookLoan, Profile } from '../../types/database';

interface LibraryModuleProps {
  books: LibraryBook[];
  loans: BookLoan[];
  currentUser: Profile;
  onSaveBooks: (updated: LibraryBook[]) => void;
  onSaveLoans: (updated: BookLoan[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({
  books,
  loans,
  currentUser,
  onSaveBooks,
  onSaveLoans,
  onLogAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'katalog' | 'peminjaman'>('katalog');
  const [notification, setNotification] = useState<string | null>(null);

  // New Loan Modal
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowBookId, setBorrowBookId] = useState(books[0]?.id || '');

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(books.map((b) => b.category)));

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBorrowBook = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find((b) => b.id === borrowBookId);
    if (!targetBook || targetBook.availableCount <= 0) {
      alert('Stok buku tidak tersedia untuk dipinjam saat ini.');
      return;
    }

    const newLoan: BookLoan = {
      id: 'loan-' + Date.now(),
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      borrowerName: currentUser.fullName,
      borrowerRole: currentUser.role,
      borrowerNipNis: currentUser.nipNisn || '23241001',
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      fineAmount: 0,
      status: 'Dipinjam',
    };

    // Decrement available count
    const updatedBooks = books.map((b) =>
      b.id === targetBook.id ? { ...b, availableCount: b.availableCount - 1 } : b
    );
    onSaveBooks(updatedBooks);
    onSaveLoans([newLoan, ...loans]);

    onLogAudit('PINJAM_BUKU', targetBook.title, `Peminjaman buku oleh ${currentUser.fullName}`);
    showNotice(`Buku "${targetBook.title}" berhasil dipinjam (Jatuh tempo: 14 hari).`);
    setShowBorrowModal(false);
  };

  const handleReturnBook = (loan: BookLoan) => {
    const updatedLoans = loans.map((l) =>
      l.id === loan.id
        ? {
            ...l,
            status: 'Dikembalikan' as const,
            returnDate: new Date().toISOString().split('T')[0],
          }
        : l
    );

    const updatedBooks = books.map((b) =>
      b.id === loan.bookId ? { ...b, availableCount: b.availableCount + 1 } : b
    );

    onSaveLoans(updatedLoans);
    onSaveBooks(updatedBooks);
    onLogAudit('KEMBALIKAN_BUKU', loan.bookTitle, 'Pengembalian buku perpustakaan');
    showNotice(`Buku "${loan.bookTitle}" telah dikembalikan.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Perpustakaan Digital SMA PGRI 4 GANDRUNGMANGU
          </h1>
          <p className="text-xs text-slate-500">
            Katalog Buku Teks Kurikulum Merdeka, Modul Digital E-Book, dan Sirkulasi Peminjaman Terpadu
          </p>
        </div>

        <button
          onClick={() => setShowBorrowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajukan Peminjaman Buku</span>
        </button>
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
          onClick={() => setActiveTab('katalog')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'katalog'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Katalog Buku & E-Book ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('peminjaman')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'peminjaman'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sirkulasi & Riwayat Peminjaman ({loans.length})
        </button>
      </div>

      {activeTab === 'katalog' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul buku, penulis, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Kategori:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map((bk) => (
              <div
                key={bk.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span className="font-semibold text-blue-900 uppercase">{bk.category}</span>
                    <span className="font-mono">{bk.publicationYear}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{bk.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Penulis: {bk.author}</p>
                  <p className="text-[10px] text-slate-400">Penerbit: {bk.publisher}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">ISBN: {bk.isbn}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Tersedia:</span>
                    <span className="font-bold text-emerald-700 font-mono tabular-nums">
                      {bk.availableCount} / {bk.stockCount} Eks
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 space-y-1.5">
                  {bk.ebookUrl ? (
                    <button
                      onClick={() => alert(`Membuka berkas e-book digital resmi SMA PGRI 4 Gandrungmangu: ${bk.title}`)}
                      className="w-full py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baca E-Book Digital</span>
                    </button>
                  ) : (
                    <span className="block text-center text-[11px] text-slate-400 py-1">
                      Koleksi Fisik Perpustakaan
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'peminjaman' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Buku Dipinjam</th>
                <th className="px-4 py-3">Peminjam</th>
                <th className="px-4 py-3">Tgl Pinjam</th>
                <th className="px-4 py-3">Jatuh Tempo</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{l.bookTitle}</td>
                  <td className="px-4 py-3 text-slate-800">
                    <p className="font-bold">{l.borrowerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{l.borrowerNipNis} ({l.borrowerRole})</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">{l.loanDate}</td>
                  <td className="px-4 py-3 font-mono text-amber-700 font-semibold tabular-nums">{l.dueDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Dipinjam'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.status === 'Dipinjam' && (
                      <button
                        onClick={() => handleReturnBook(l)}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded cursor-pointer"
                      >
                        Kembalikan Buku
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Formulir Peminjaman Buku Perpustakaan
            </h3>
            <form onSubmit={handleBorrowBook} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Judul Buku *</label>
                <select
                  value={borrowBookId}
                  onChange={(e) => setBorrowBookId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (Tersedia: {b.availableCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peminjam</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.fullName} (${currentUser.nipNisn || currentUser.role})`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-semibold"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                Durasi peminjaman standar perpustakaan SMA PGRI 4 Gandrungmangu adalah 14 hari kalender. Harap menjaga keutuhan buku fisik maupun modul digital.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBorrowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Konfirmasi Pinjam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
