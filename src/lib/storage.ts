/**
 * Storage and Database synchronization service for EduSphere SMA PGRI 4 GANDRUNGMANGU
 * Interacts with persistent Express backend server (/api/database)
 */

import {
  Profile,
  StudentDetail,
  TeacherDetail,
  ClassInfo,
  Subject,
  ScheduleItem,
  LearningMaterial,
  DiscussionComment,
  Assignment,
  AssignmentSubmission,
  OnlineExam,
  StudentGrade,
  AttendanceRecord,
  ReportCard,
  Announcement,
  CounselingRecord,
  ViolationRecord,
  AchievementRecord,
  LibraryBook,
  BookLoan,
  StudentElectiveChoice,
  SchoolSetting,
  AuditLogItem,
} from '../types/database';

import {
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_PROFILES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULES,
  INITIAL_MATERIALS,
  INITIAL_COMMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_REPORT_CARD,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COUNSELING,
  INITIAL_VIOLATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_BOOKS,
  INITIAL_LOANS,
  INITIAL_ELECTIVES,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

export interface AppDatabaseState {
  settings: SchoolSetting;
  profiles: Profile[];
  students: StudentDetail[];
  teachers: TeacherDetail[];
  classes: ClassInfo[];
  subjects: Subject[];
  schedules: ScheduleItem[];
  materials: LearningMaterial[];
  comments: DiscussionComment[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  exams: OnlineExam[];
  grades: StudentGrade[];
  attendance: AttendanceRecord[];
  reportCards: ReportCard[];
  announcements: Announcement[];
  counseling: CounselingRecord[];
  violations: ViolationRecord[];
  achievements: AchievementRecord[];
  books: LibraryBook[];
  loans: BookLoan[];
  electives: StudentElectiveChoice[];
  auditLogs: AuditLogItem[];
}

export const DEFAULT_DATABASE_STATE: AppDatabaseState = {
  settings: INITIAL_SCHOOL_SETTINGS,
  profiles: INITIAL_PROFILES,
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  classes: INITIAL_CLASSES,
  subjects: INITIAL_SUBJECTS,
  schedules: INITIAL_SCHEDULES,
  materials: INITIAL_MATERIALS,
  comments: INITIAL_COMMENTS,
  assignments: INITIAL_ASSIGNMENTS,
  submissions: INITIAL_SUBMISSIONS,
  exams: INITIAL_EXAMS,
  grades: INITIAL_GRADES,
  attendance: INITIAL_ATTENDANCE,
  reportCards: [INITIAL_REPORT_CARD],
  announcements: INITIAL_ANNOUNCEMENTS,
  counseling: INITIAL_COUNSELING,
  violations: INITIAL_VIOLATIONS,
  achievements: INITIAL_ACHIEVEMENTS,
  books: INITIAL_BOOKS,
  loans: INITIAL_LOANS,
  electives: INITIAL_ELECTIVES,
  auditLogs: INITIAL_AUDIT_LOGS,
};

let memoryDb: AppDatabaseState = JSON.parse(JSON.stringify(DEFAULT_DATABASE_STATE));

export async function fetchDatabase(): Promise<AppDatabaseState> {
  try {
    const res = await fetch('/api/database');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && typeof serverData === 'object' && serverData.settings) {
        memoryDb = serverData;
        return memoryDb;
      }
    }
  } catch (err) {
    console.warn('Backend database fetch offline, using initialized state', err);
  }

  // If server had no data yet, initialize it
  await saveDatabase(memoryDb);
  return memoryDb;
}

export async function saveDatabase(db: AppDatabaseState): Promise<boolean> {
  memoryDb = db;
  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend database save error', err);
    return false;
  }
}

export function logAudit(action: string, resource: string, details: string, user: Profile) {
  const newLog: AuditLogItem = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userName: user.fullName,
    userRole: user.role,
    action,
    resource,
    details,
  };
  memoryDb.auditLogs.unshift(newLog);
  if (memoryDb.auditLogs.length > 100) {
    memoryDb.auditLogs.pop();
  }
  saveDatabase(memoryDb);
}
