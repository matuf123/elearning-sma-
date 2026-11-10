import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import { OnlineExam, ExamQuestion, Profile, Subject, ClassInfo } from '../../types/database';

interface OnlineExamModuleProps {
  exams: OnlineExam[];
  subjects: Subject[];
  classes: ClassInfo[];
  currentUser: Profile;
  onSaveExams: (updated: OnlineExam[]) => void;
  onLogAudit: (action: string, resource: string, details: string) => void;
}

export const OnlineExamModule: React.FC<OnlineExamModuleProps> = ({
  exams,
  subjects,
  classes,
  currentUser,
  onSaveExams,
  onLogAudit,
}) => {
  const [activeExam, setActiveExam] = useState<OnlineExam | null>(exams[0] || null);
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScoreResult, setExamScoreResult] = useState<{ score: number; total: number } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Teacher Create Exam modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState<'Kuis' | 'Ulangan Harian' | 'PTS' | 'PAS/SAS' | 'Remedial'>('Ulangan Harian');
  const [examSubId, setExamSubId] = useState(subjects[0]?.id || '');
  const [examClassId, setExamClassId] = useState(classes[0]?.id || '');
  const [duration, setDuration] = useState(60);

  const isTeacherOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'guru' ||
    currentUser.role === 'wali_kelas' ||
    currentUser.role === 'wakasek_kurikulum';

  const isStudent = currentUser.role === 'siswa';

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (isTakingExam && !examSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTakingExam, examSubmitted, timeLeftSeconds]);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartExam = (exam: OnlineExam) => {
    setActiveExam(exam);
    setIsTakingExam(true);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setExamSubmitted(false);
    setExamScoreResult(null);
    onLogAudit('MULAI_UJIAN_CBT', exam.title, `Siswa ${currentUser.fullName} memulai ujian online CBT`);
  };

  const handleSelectAnswer = (qId: string, answerKey: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qId]: answerKey,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam || !activeExam.questions) return;

    let totalPoints = 0;
    let earnedPoints = 0;

    activeExam.questions.forEach((q) => {
      totalPoints += q.points;
      const givenAns = studentAnswers[q.id];
      if (q.questionType === 'pilihan_ganda' || q.questionType === 'benar_salah') {
        const correctChoice = q.choices?.find((c) => c.isCorrect);
        if (correctChoice && correctChoice.key === givenAns) {
          earnedPoints += q.points;
        }
      } else if (q.questionType === 'essay') {
        // Essay awarded provisional partial points pending manual review
        if (givenAns && givenAns.length > 10) {
          earnedPoints += q.points * 0.85;
        }
      }
    });

    const finalPct = Math.round((earnedPoints / totalPoints) * 100);
    setExamScoreResult({ score: finalPct, total: 100 });
    setExamSubmitted(true);
    setIsTakingExam(false);

    onLogAudit('SUBMIT_UJIAN_CBT', activeExam.title, `Menyelesaikan ujian dengan nilai otomatis: ${finalPct}`);
    showNotice(`Ujian berhasil diselesaikan! Skor otomatis: ${finalPct}`);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === examSubId);
    const cls = classes.find((c) => c.id === examClassId);

    const sampleQuestions: ExamQuestion[] = [
      {
        id: 'q-' + Date.now() + '-1',
        examId: 'exam-' + Date.now(),
        questionText: 'Manakah dari berikut ini yang merupakan karakteristik utama dari sistem pemerintahan di era modern?',
        questionType: 'pilihan_ganda',
        points: 25,
        orderNumber: 1,
        choices: [
          { id: 'c1', key: 'A', text: 'Transparansi dan akuntabilitas publik', isCorrect: true },
          { id: 'c2', key: 'B', text: 'Pemusatan kekuasaan mutlak', isCorrect: false },
          { id: 'c3', key: 'C', text: 'Ketertutupan birokrasi', isCorrect: false },
          { id: 'c4', key: 'D', text: 'Peniadaan pemilu', isCorrect: false },
        ],
      },
      {
        id: 'q-' + Date.now() + '-2',
        examId: 'exam-' + Date.now(),
        questionText: 'Pernyataan: "Teknologi informasi memfasilitasi integrasi data sekolah secara transparan dan real-time." Benar atau Salah?',
        questionType: 'benar_salah',
        points: 25,
        orderNumber: 2,
        choices: [
          { id: 'c5', key: 'A', text: 'BENAR', isCorrect: true },
          { id: 'c6', key: 'B', text: 'SALAH', isCorrect: false },
        ],
      },
      {
        id: 'q-' + Date.now() + '-3',
        examId: 'exam-' + Date.now(),
        questionText: 'Jelaskan bagaimana konsep pemodelan matematis dapat diterapkan untuk menyelesaikan persoalan di dunia nyata!',
        questionType: 'essay',
        points: 50,
        orderNumber: 3,
        correctAnswer: 'Mengidentifikasi variabel, membuat fungsi objektif, menyelesaikan persamaan, dan menginterpretasikan hasil.',
      },
    ];

    const newExam: OnlineExam = {
      id: 'exam-' + Date.now(),
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      subjectId: examSubId,
      subjectName: sub ? sub.name : 'Mata Pelajaran',
      classId: examClassId,
      className: cls ? cls.name : 'Semua Kelas',
      title: examTitle,
      examType,
      durationMinutes: Number(duration),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 86400000).toISOString(),
      isRandomizeQuestions: true,
      isRandomizeOptions: true,
      isPublished: true,
      totalQuestions: sampleQuestions.length,
      questions: sampleQuestions,
      createdAt: new Date().toISOString(),
    };

    onSaveExams([newExam, ...exams]);
    setActiveExam(newExam);
    onLogAudit('BUAT_UJIAN_CBT', examTitle, `Menerbitkan paket ujian online untuk kelas ${cls?.name}`);
    showNotice(`Paket ujian "${examTitle}" berhasil diterbitkan.`);
    setShowCreateModal(false);
    setExamTitle('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If taking CBT Exam
  if (isTakingExam && activeExam && activeExam.questions) {
    const q = activeExam.questions[currentQuestionIndex];
    const isAnswered = studentAnswers[q.id] !== undefined;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* CBT Top Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
              CBT SMA PGRI 4 GANDRUNGMANGU
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {activeExam.title}
            </h2>
            <p className="text-xs text-slate-400">
              Peserta: {currentUser.fullName} ({currentUser.nipNisn})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Sisa Waktu</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 tabular-nums">
                {formatTime(timeLeftSeconds)}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian ini sekarang?')) {
                  handleSubmitExam();
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
            >
              Selesai Ujian
            </button>
          </div>
        </div>

        {/* Question Sheet */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-900 uppercase">
              Soal Nomor {currentQuestionIndex + 1} dari {activeExam.questions.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 font-mono">
              Bobot: {q.points} Poin &middot; Tipe: {q.questionType.replace('_', ' ')}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-sm text-slate-900 leading-relaxed font-medium">
            {q.questionText}
          </div>

          {/* Options for Multiple Choice or True/False */}
          {q.choices && q.choices.length > 0 && (
            <div className="space-y-2.5 pt-2">
              {q.choices.map((choice) => {
                const isSelected = studentAnswers[q.id] === choice.key;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectAnswer(q.id, choice.key)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 font-mono ${
                        isSelected
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {choice.key}
                    </span>
                    <span className="text-xs sm:text-sm">{choice.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Essay Input */}
          {q.questionType === 'essay' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ketikkan Jawaban Uraian Anda di Bawah Ini:
              </label>
              <textarea
                rows={5}
                value={studentAnswers[q.id] || ''}
                onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                placeholder="Tuliskan analisis, langkah perhitungan, dan penjelasan Anda..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            {/* Question Quick Jump Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
              {activeExam.questions.map((ques, idx) => {
                const ans = studentAnswers[ques.id] !== undefined;
                const isCurr = idx === currentQuestionIndex;
                return (
                  <button
                    key={ques.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer shrink-0 ${
                      isCurr
                        ? 'ring-2 ring-blue-600 bg-blue-900 text-white'
                        : ans
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestionIndex < activeExam.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm('Sudah memeriksa semua jawaban? Selesaikan ujian?')) {
                    handleSubmitExam();
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Selesai Ujian
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Ujian Online CBT & Bank Soal
          </h1>
          <p className="text-xs text-slate-500">
            Sistem evaluasi berbasis komputer Computer Based Test (CBT) SMA PGRI 4 GANDRUNGMANGU
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Ujian CBT Baru</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Result Card after taking exam */}
      {examScoreResult && activeExam && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Hasil Ujian CBT Tersimpan
              </span>
              <h3 className="text-base font-bold text-slate-900">{activeExam.title}</h3>
              <p className="text-xs text-slate-600">
                Nilai otomatis Anda: <strong className="text-emerald-700 text-sm font-mono">{examScoreResult.score} / 100</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setExamScoreResult(null)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Tutup Lembar Hasil
          </button>
        </div>
      )}

      {/* Exam Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-bold text-blue-900 uppercase">{ex.subjectName}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-semibold text-[10px]">
                  {ex.examType}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{ex.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Kelas: {ex.className}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Durasi:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {ex.durationMinutes} Menit
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Jumlah Soal:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {ex.totalQuestions} Butir Soal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Guru Pengampu:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                    {ex.teacherName}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              {isStudent ? (
                <button
                  onClick={() => handleStartExam(ex)}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Mulai Kerjakan CBT</span>
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartExam(ex)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer text-center"
                  >
                    Simulasi CBT
                  </button>
                  <button
                    onClick={() => {
                      alert(`Bank Soal ${ex.title} memiliki ${ex.totalQuestions} butir soal aktif siap cetak/unduh.`);
                    }}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Bank Soal
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create Exam */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Buat Paket Ujian CBT Baru
            </h3>
            <form onSubmit={handleCreateExam} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Ujian *</label>
                <input
                  type="text"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Contoh: Ulangan Harian 2: Polinomial & Suku Banyak"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Ujian</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Ulangan Harian">Ulangan Harian</option>
                    <option value="Kuis">Kuis</option>
                    <option value="PTS">PTS</option>
                    <option value="PAS/SAS">PAS/SAS</option>
                    <option value="Remedial">Remedial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={examSubId}
                    onChange={(e) => setExamSubId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas Target</label>
                  <select
                    value={examClassId}
                    onChange={(e) => setExamClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900">
                Fitur otomatis: Pengacakan urutan soal dan pengacakan opsi jawaban (A, B, C, D, E) aktif secara default.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Terbitkan Paket CBT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
