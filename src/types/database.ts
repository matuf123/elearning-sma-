/**
 * Database types and models for EduSphere SMA PGRI 4 GANDRUNGMANGU
 */

export type UserRole =
  | 'super_admin'
  | 'kepala_sekolah'
  | 'wakasek_kurikulum'
  | 'guru'
  | 'wali_kelas'
  | 'guru_bk'
  | 'siswa'
  | 'orang_tua'
  | 'operator';

export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  nipNisn?: string;
  gender: 'Laki-laki' | 'Perempuan';
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDetail {
  id: string;
  profileId: string;
  profile: Profile;
  nis: string;
  nisn: string;
  currentClassId: string;
  className: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  parentName: string;
  parentPhone: string;
  status: 'Aktif' | 'Lulus' | 'Pindah' | 'Cuti';
}

export interface TeacherDetail {
  id: string;
  profileId: string;
  profile: Profile;
  nip: string;
  nuptk: string;
  lastEducation: string;
  fieldOfStudy: string;
  status: 'PNS' | 'GTT' | 'GTY' | 'PPPK';
}

export interface ClassInfo {
  id: string;
  academicYear: string;
  departmentCode: 'MIPA' | 'IPS' | 'FASE_E' | 'FASE_F';
  gradeLevel: 'X' | 'XI' | 'XII';
  name: string; // e.g. "XI MIPA 1"
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  roomNumber: string;
  capacity: number;
  totalStudents: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category?: string;
  creditHours: number;
  kkm: number;
  teacherId?: string;
  teacherName?: string;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  startTime: string;
  endTime: string;
  room: string;
}

export interface LearningMaterial {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  content: string;
  materialType: 'Dokumen' | 'Video' | 'Modul Ajar' | 'Tautan Luar';
  fileUrl?: string;
  videoUrl?: string;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
  commentsCount?: number;
}

export interface DiscussionComment {
  id: string;
  materialId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  title: string;
  instructions: string;
  dueDate: string;
  attachmentUrl?: string;
  maxScore: number;
  isRemedial: boolean;
  totalSubmissions: number;
  gradedSubmissions: number;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  className: string;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  status: 'Sudah Dikumpulkan' | 'Dinilai' | 'Terlambat';
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface ExamQuestionChoice {
  id: string;
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isCorrect?: boolean;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  questionText: string;
  questionType: 'pilihan_ganda' | 'essay' | 'benar_salah';
  points: number;
  orderNumber: number;
  choices?: ExamQuestionChoice[];
  correctAnswer?: string; // For essay guideline or true/false
}

export interface OnlineExam {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  title: string;
  examType: 'Kuis' | 'Ulangan Harian' | 'PTS' | 'PAS/SAS' | 'Remedial';
  durationMinutes: number;
  startTime: string;
  endTime: string;
  isRandomizeQuestions: boolean;
  isRandomizeOptions: boolean;
  isPublished: boolean;
  totalQuestions: number;
  questions?: ExamQuestion[];
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  totalScore?: number;
  status: 'Sedang Berlangsung' | 'Selesai' | 'Dinilai Sebagian';
  answers: {
    questionId: string;
    selectedChoiceKey?: string;
    essayAnswer?: string;
    score?: number;
    isCorrect?: boolean;
  }[];
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  nis: string;
  className: string;
  subjectId: string;
  subjectName: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  assignmentScore: number;
  quizScore: number;
  midtermScore: number; // PTS
  finalScore: number;   // PAS/SAS
  projectScore: number;
  practicalScore: number;
  finalGrade: number;   // Calculated weighted
  letterGrade: 'A' | 'B' | 'C' | 'D';
  description: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  notes?: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  nis: string;
  nisn: string;
  className: string;
  homeroomTeacherName: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  homeroomNotes: string;
  attitudeGrade: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  extracurricularNotes: string;
  attendanceSummary: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  grades: {
    subjectName: string;
    kkm: number;
    score: number;
    letterGrade: string;
    competencyAchievement: string;
  }[];
  promotionStatus: 'Naik ke Kelas Berikutnya' | 'Tinggal di Kelas' | 'Lulus' | 'Belum Ditentukan';
  isPublished: boolean;
  publishedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'semua' | 'guru' | 'siswa' | 'orang_tua';
  authorName: string;
  authorRole: string;
  date: string;
  isPinned: boolean;
}

export interface CounselingRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  counselorName: string;
  date: string;
  topic: string;
  problemSummary: string;
  followUpAction: string;
  status: 'Dalam Proses' | 'Selesai' | 'Dirujuk';
  isConfidential: boolean;
}

export interface ViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  violationType: string;
  penaltyPoints: number;
  date: string;
  description: string;
  actionTaken: string;
}

export interface AchievementRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  title: string;
  level: 'Sekolah' | 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  date: string;
  rewardPoints: number;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  category: string;
  stockCount: number;
  availableCount: number;
  coverUrl?: string;
  ebookUrl?: string;
}

export interface BookLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerRole: string;
  borrowerNipNis: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
}

export interface StudentElectiveChoice {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  academicYear: string;
  chosenSubjectIds: string[];
  chosenSubjectNames: string[];
  targetMajor: string;
  counselorNotes?: string;
  status: 'Draft' | 'Diverifikasi BK' | 'Disetujui Kurikulum';
  updatedAt: string;
}

export interface SchoolSetting {
  schoolName: string;
  npsn: string;
  accreditation: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  principalName: string;
  principalNip: string;
  logoUrl: string;
  activeAcademicYear: string;
  activeSemester: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
}
