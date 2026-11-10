-- ==============================================================================
-- EDUSPHERE - INTEGRATED SCHOOL MANAGEMENT & E-LEARNING SYSTEM
-- Official Database Migration & Schema for SMA PGRI 4 GANDRUNGMANGU
-- Target: Supabase PostgreSQL (Compatible with Next.js App Router & Vercel)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES (RBAC)
-- ------------------------------------------------------------------------------
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'kepala_sekolah',
  'wakasek_kurikulum',
  'guru',
  'wali_kelas',
  'guru_bk',
  'siswa',
  'orang_tua',
  'operator'
);

CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
  ('super_admin', 'Super Admin / Admin Sekolah', 'Akses penuh ke seluruh konfigurasi sistem, database, dan pengguna'),
  ('kepala_sekolah', 'Kepala Sekolah', 'Pemantauan eksekutif, rekapitulasi nilai, presensi, dan persetujuan rapor'),
  ('wakasek_kurikulum', 'Wakasek Kurikulum', 'Manajemen kurikulum, pembagian jadwal mengajar, dan kalender akademik'),
  ('guru', 'Guru Mata Pelajaran', 'Pengelolaan materi ajar, bank soal, tugas, ujian CBT, dan input nilai'),
  ('wali_kelas', 'Wali Kelas', 'Pembinaan kelas, input catatan sikap, ekstrakurikuler, dan penerbitan rapor'),
  ('guru_bk', 'Guru BK / Konselor', 'Konseling siswa, pencatatan poin pelanggaran, dan pembinaan kesiswaan'),
  ('siswa', 'Siswa / Peserta Didik', 'Akses ruang belajar digital, materi, pengumpulan tugas, dan ujian CBT'),
  ('orang_tua', 'Orang Tua / Wali Murid', 'Pemantauan perkembangan akademik, presensi, dan rapor anak'),
  ('operator', 'Operator Sekolah', 'Pengelolaan data pokok pendidikan, administrasi guru, dan siswa')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE, -- References auth.users(id) in Supabase
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  full_name VARCHAR(128) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'siswa',
  nip_nisn VARCHAR(32),
  gender VARCHAR(10) CHECK (gender IN ('Laki-laki', 'Perempuan')),
  phone_number VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ACADEMIC STRUCTURE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(32) NOT NULL, -- e.g. "2024/2025"
  is_active BOOLEAN DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  semester_number INT CHECK (semester_number IN (1, 2)), -- 1: Ganjil, 2: Genap
  name VARCHAR(32) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(16) UNIQUE NOT NULL, -- 'MIPA', 'IPS', 'VOK'
  name VARCHAR(64) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  grade_level VARCHAR(8) NOT NULL CHECK (grade_level IN ('X', 'XI', 'XII')),
  name VARCHAR(32) NOT NULL, -- e.g. "XI MIPA 1"
  homeroom_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room_number VARCHAR(16),
  capacity INT DEFAULT 36,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nis VARCHAR(16) UNIQUE NOT NULL,
  nisn VARCHAR(16) UNIQUE NOT NULL,
  current_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  birth_place VARCHAR(64),
  birth_date DATE,
  religion VARCHAR(32),
  address TEXT,
  parent_name VARCHAR(128),
  parent_phone VARCHAR(20),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Lulus', 'Pindah', 'Cuti')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nip VARCHAR(32) UNIQUE,
  nuptk VARCHAR(32) UNIQUE,
  last_education VARCHAR(64),
  field_of_study VARCHAR(64),
  status VARCHAR(32) DEFAULT 'PNS' CHECK (status IN ('PNS', 'GTT', 'GTY', 'PPPK')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  occupation VARCHAR(64),
  relationship_type VARCHAR(20) DEFAULT 'Ayah' CHECK (relationship_type IN ('Ayah', 'Ibu', 'Wali')),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parent_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(20) DEFAULT 'Orang Tua Kandung',
  UNIQUE(parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  roll_number INT,
  UNIQUE(class_id, student_id, academic_year_id)
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(16) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  credit_hours INT DEFAULT 2,
  kkm NUMERIC(5, 2) DEFAULT 75.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id, class_id, academic_year_id)
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week VARCHAR(16) NOT NULL CHECK (day_of_week IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(32),
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS academic_calendars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(128) NOT NULL,
  event_type VARCHAR(32) NOT NULL CHECK (event_type IN ('Ujian', 'Libur', 'Kegiatan', 'Bagi Rapor', 'KBM')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. E-LEARNING & MATERI PEMBELAJARAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  material_type VARCHAR(32) DEFAULT 'Dokumen' CHECK (material_type IN ('Dokumen', 'Video', 'Modul Ajar', 'Tautan Luar')),
  file_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES learning_materials(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TUGAS (ASSIGNMENTS) & PENGUMPULAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  instructions TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  attachment_url TEXT,
  max_score NUMERIC(5, 2) DEFAULT 100.00,
  allow_late_submission BOOLEAN DEFAULT FALSE,
  is_remedial BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'Sudah Dikumpulkan' CHECK (status IN ('Draft', 'Sudah Dikumpulkan', 'Dinilai', 'Terlambat')),
  score NUMERIC(5, 2),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),
  UNIQUE(assignment_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 5. UJIAN ONLINE CBT (COMPUTER BASED TEST)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  exam_type VARCHAR(32) DEFAULT 'Ulangan Harian' CHECK (exam_type IN ('Kuis', 'Ulangan Harian', 'PTS', 'PAS/SAS', 'Remedial')),
  duration_minutes INT NOT NULL DEFAULT 60,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_randomize_questions BOOLEAN DEFAULT TRUE,
  is_randomize_options BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('pilihan_ganda', 'essay', 'benar_salah')),
  points NUMERIC(5, 2) DEFAULT 10.00,
  order_number INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_key VARCHAR(4) NOT NULL, -- 'A', 'B', 'C', 'D', 'E'
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(5, 2),
  status VARCHAR(20) DEFAULT 'Sedang Berlangsung' CHECK (status IN ('Sedang Berlangsung', 'Selesai', 'Dinilai Sebagian')),
  UNIQUE(exam_id, student_id)
);

CREATE TABLE IF NOT EXISTS exam_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_choice_id UUID REFERENCES exam_choices(id),
  essay_answer TEXT,
  score NUMERIC(5, 2),
  is_correct BOOLEAN,
  teacher_notes TEXT,
  UNIQUE(attempt_id, question_id)
);

-- ------------------------------------------------------------------------------
-- 6. MANAJEMEN NILAI & RAPOR DIGITAL
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grade_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(64) NOT NULL, -- 'Tugas', 'Kuis', 'PTS', 'PAS'
  weight_percentage NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  assignment_score NUMERIC(5, 2) DEFAULT 0,
  quiz_score NUMERIC(5, 2) DEFAULT 0,
  midterm_score NUMERIC(5, 2) DEFAULT 0, -- PTS
  final_score NUMERIC(5, 2) DEFAULT 0,   -- PAS/SAS
  project_score NUMERIC(5, 2) DEFAULT 0,
  practical_score NUMERIC(5, 2) DEFAULT 0,
  final_grade NUMERIC(5, 2) NOT NULL,
  letter_grade VARCHAR(4) NOT NULL, -- 'A', 'B', 'C', 'D'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_id, semester_id)
);

CREATE TABLE IF NOT EXISTS report_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  homeroom_notes TEXT,
  attitude_grade VARCHAR(16) DEFAULT 'Sangat Baik',
  extracurricular_notes TEXT,
  promotion_status VARCHAR(32) DEFAULT 'Naik ke Kelas Berikutnya' CHECK (promotion_status IN ('Naik ke Kelas Berikutnya', 'Tinggal di Kelas', 'Lulus', 'Belum Ditentukan')),
  is_published BOOLEAN DEFAULT FALSE,
  published_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, semester_id)
);

CREATE TABLE IF NOT EXISTS report_card_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_card_id UUID NOT NULL REFERENCES report_cards(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  score NUMERIC(5, 2) NOT NULL,
  letter_grade VARCHAR(4) NOT NULL,
  competency_achievement TEXT,
  UNIQUE(report_card_id, subject_id)
);

-- ------------------------------------------------------------------------------
-- 7. PRESENSI & JURNAL MENGAJAR
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpa')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, date, subject_id)
);

CREATE TABLE IF NOT EXISTS teaching_journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  teaching_hours VARCHAR(32) NOT NULL,
  topic_delivered TEXT NOT NULL,
  students_present INT DEFAULT 0,
  students_absent INT DEFAULT 0,
  documentation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. KESISWAAN, BK, & PENGHARGAAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  level VARCHAR(32) CHECK (level IN ('Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
  date DATE NOT NULL,
  reward_points INT DEFAULT 10,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  violation_type VARCHAR(64) NOT NULL,
  penalty_points INT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  action_taken TEXT,
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counseling_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  counselor_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic VARCHAR(128) NOT NULL,
  problem_summary TEXT NOT NULL,
  follow_up_action TEXT,
  status VARCHAR(20) DEFAULT 'Dalam Proses' CHECK (status IN ('Dalam Proses', 'Selesai', 'Dirujuk')),
  is_confidential BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. KOMUNIKASI & FORUM DISKUSI
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_role VARCHAR(32) DEFAULT 'semua' CHECK (target_role IN ('semua', 'guru', 'siswa', 'orang_tua')),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attachment_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES learning_materials(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussion_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. PERPUSTAKAAN DIGITAL
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn VARCHAR(32),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(128) NOT NULL,
  publisher VARCHAR(128),
  publication_year INT,
  category VARCHAR(64) NOT NULL,
  stock_count INT DEFAULT 1,
  available_count INT DEFAULT 1,
  cover_url TEXT,
  ebook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS book_loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  fine_amount NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Dipinjam' CHECK (status IN ('Dipinjam', 'Dikembalikan', 'Terlambat', 'Hilang')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. PEMILIHAN MATA PELAJARAN PILIHAN (FASE F - KURIKULUM MERDEKA SMA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_electives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  chosen_subject_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_major VARCHAR(128),
  counselor_notes TEXT,
  status VARCHAR(32) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Diverifikasi BK', 'Disetujui Kurikulum')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

-- ------------------------------------------------------------------------------
-- 12. AUDIT LOGS & PENGATURAN SISTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(64) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name VARCHAR(128) NOT NULL DEFAULT 'SMA PGRI 4 GANDRUNGMANGU',
  npsn VARCHAR(16) NOT NULL DEFAULT '20300645',
  accreditation VARCHAR(8) NOT NULL DEFAULT 'B',
  address TEXT NOT NULL DEFAULT 'Jl. Raya Gandrungmangu No. 4, Gandrungmangu, Kec. Gandrungmangu, Kabupaten Cilacap, Jawa Tengah 53254',
  postal_code VARCHAR(10) DEFAULT '53254',
  phone_number VARCHAR(32) DEFAULT '(0280) 6260123',
  email VARCHAR(64) DEFAULT 'smapgri4gandrungmangu@gmail.com',
  website VARCHAR(128) DEFAULT 'https://smapgri4gandrungmangu.sch.id',
  principal_name VARCHAR(128) DEFAULT 'H. Supriyanto, S.Pd., M.M.',
  principal_nip VARCHAR(32) DEFAULT '19680512 199403 1 008',
  logo_url TEXT,
  active_academic_year VARCHAR(32) DEFAULT '2024/2025',
  active_semester VARCHAR(16) DEFAULT 'Genap',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;

-- 1. Profiles policy: Anyone authenticated can view public profiles; users can update own profile; Super Admin has full access
CREATE POLICY "Public profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 2. Grades: Students can only view their own grades; teachers and admins can view & edit
CREATE POLICY "Students can view own grades" ON grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students
      JOIN profiles ON profiles.id = students.profile_id
      WHERE students.id = grades.student_id AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children grades" ON grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_students
      JOIN parents ON parents.id = parent_students.parent_id
      JOIN profiles ON profiles.id = parents.profile_id
      WHERE parent_students.student_id = grades.student_id AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage grades" ON grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid() AND profiles.role IN ('guru', 'wali_kelas', 'super_admin', 'kepala_sekolah')
    )
  );

-- 3. Counseling Records: Only BK counselors, Headmaster, and Super Admin can access
CREATE POLICY "Strict BK access only" ON counseling_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid() AND profiles.role IN ('guru_bk', 'kepala_sekolah', 'super_admin')
    )
  );

-- 4. Assignment Submissions: Students see only own submission; teachers view submissions for their classes
CREATE POLICY "Students manage own submissions" ON assignment_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students
      JOIN profiles ON profiles.id = students.profile_id
      WHERE students.id = assignment_submissions.student_id AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers grade submissions" ON assignment_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid() AND profiles.role IN ('guru', 'super_admin')
    )
  );

-- ==============================================================================
-- 13. SEEDER: 21 MATA PELAJARAN SMA PGRI 4 GANDRUNGMANGU
-- ==============================================================================
INSERT INTO subjects (code, name, credit_hours, kkm) VALUES
  ('PAI-01', 'Pendidikan Agama dan Budi Pekerti', 3, 75.00),
  ('PPKN-02', 'Pendidikan Pancasila', 2, 75.00),
  ('BIND-03', 'Bahasa Indonesia', 4, 76.00),
  ('BIND-TL-04', 'Bahasa Indonesia Tingkat Lanjut', 4, 75.00),
  ('MAT-05', 'Matematika', 4, 75.00),
  ('MAT-TL-06', 'Matematika Tingkat Lanjut', 5, 75.00),
  ('BING-07', 'Bahasa Inggris', 3, 75.00),
  ('BING-TL-08', 'Bahasa Inggris Tingkat Lanjut', 4, 75.00),
  ('PJOK-09', 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)', 3, 75.00),
  ('SEJ-10', 'Sejarah', 2, 75.00),
  ('INF-11', 'Informatika', 3, 78.00),
  ('BIO-12', 'Biologi', 4, 75.00),
  ('FIS-13', 'Fisika', 4, 75.00),
  ('KIM-14', 'Kimia', 4, 75.00),
  ('SOS-15', 'Sosiologi', 4, 75.00),
  ('EKO-16', 'Ekonomi', 4, 75.00),
  ('GEO-17', 'Geografi', 4, 75.00),
  ('ANT-18', 'Antropologi', 3, 75.00),
  ('BAS-19', 'Bahasa Asing', 3, 75.00),
  ('SBD-20', 'Seni dan Budaya (Musik, Rupa, Teater, Tari)', 2, 75.00),
  ('PKWU-21', 'Prakarya dan Kewirausahaan (Rekayasa, Kerajinan, Budidaya, Pengolahan)', 2, 75.00)
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, credit_hours = EXCLUDED.credit_hours, kkm = EXCLUDED.kkm;

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
