/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Profile,
  SchoolSetting,
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
  AuditLogItem,
  StudentDetail,
  TeacherDetail,
} from './types/database';

import {
  DEFAULT_DATABASE_STATE,
  AppDatabaseState,
  fetchDatabase,
  saveDatabase,
  logAudit,
} from './lib/storage';

import { getStoredUser, setStoredUser, clearStoredUser } from './lib/auth';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { RoleDashboard } from './components/dashboard/RoleDashboard';
import { UserManagement } from './components/modules/UserManagement';
import { AcademicManagement } from './components/modules/AcademicManagement';
import { AssignmentModule } from './components/modules/AssignmentModule';
import { OnlineExamModule } from './components/modules/OnlineExamModule';
import { GradeManagement } from './components/modules/GradeManagement';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { HomeroomModule } from './components/modules/HomeroomModule';
import { ReportCardModule } from './components/modules/ReportCardModule';
import { CounselingModule } from './components/modules/CounselingModule';
import { ParentDashboardModule } from './components/modules/ParentDashboardModule';
import { LibraryModule } from './components/modules/LibraryModule';
import { SubjectsListModule } from './components/modules/SubjectsListModule';
import { CommunicationModule } from './components/modules/CommunicationModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { ProfileModule } from './components/modules/ProfileModule';

export default function App() {
  const [db, setDb] = useState<AppDatabaseState>(DEFAULT_DATABASE_STATE);
  const [currentUser, setCurrentUser] = useState<Profile>(DEFAULT_DATABASE_STATE.profiles[0]);
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>('dashboard');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Initialize from persistent server database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchDatabase();
      setDb(data);
      const user = getStoredUser(data.profiles);
      setCurrentUser(user);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleUpdateDatabase = async (nextDb: AppDatabaseState) => {
    setDb(nextDb);
    await saveDatabase(nextDb);
  };

  const handleSwitchUser = (newProfile: Profile) => {
    setCurrentUser(newProfile);
    setStoredUser(newProfile);
    // If role changed to parent, auto navigate to parent_portal
    if (newProfile.role === 'orang_tua') {
      setActiveModule('parent_portal');
    } else if (newProfile.role === 'wali_kelas') {
      setActiveModule('homeroom');
    } else if (newProfile.role === 'guru_bk') {
      setActiveModule('counseling');
    } else {
      setActiveModule('dashboard');
    }
  };

  const handleUpdateProfile = async (updated: Profile) => {
    setCurrentUser(updated);
    setStoredUser(updated);
    const updatedProfiles = db.profiles.map((p) => (p.id === updated.id ? updated : p));
    await handleUpdateDatabase({ ...db, profiles: updatedProfiles });
  };

  const handleLogout = () => {
    clearStoredUser();
    setActiveView('landing');
    setActiveModule('dashboard');
  };

  const handleAudit = (action: string, resource: string, details: string) => {
    logAudit(action, resource, details, currentUser);
  };

  const handleResetDatabase = async () => {
    await handleUpdateDatabase(DEFAULT_DATABASE_STATE);
    setCurrentUser(DEFAULT_DATABASE_STATE.profiles[0]);
    setStoredUser(DEFAULT_DATABASE_STATE.profiles[0]);
  };

  const handleExportDatabaseJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `edusphere_smapgri4gandrungmangu_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-base font-bold">Menghubungkan ke Basis Data EduSphere</h2>
        <p className="text-xs text-slate-400 mt-1">SMA PGRI 4 GANDRUNGMANGU</p>
      </div>
    );
  }

  // PUBLIC LANDING PAGE VIEW
  if (activeView === 'landing') {
    return (
      <LandingPage
        settings={db.settings}
        profiles={db.profiles}
        announcements={db.announcements}
        onLoginAsRole={(p) => {
          handleSwitchUser(p);
          setActiveView('dashboard');
        }}
        onEnterDashboard={() => setActiveView('dashboard')}
      />
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        profiles={db.profiles}
        settings={db.settings}
        onSwitchUser={handleSwitchUser}
        onViewLanding={() => setActiveView('landing')}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Workspace: Sidebar + Dynamic Module Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentUser={currentUser}
          activeModule={activeModule}
          onSelectModule={(id) => {
            setActiveModule(id);
            setSelectedStudentForReport(undefined);
          }}
          onLogout={handleLogout}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeModule === 'dashboard' && (
            <RoleDashboard
              currentUser={currentUser}
              settings={db.settings}
              students={db.students}
              teachers={db.teachers}
              classes={db.classes}
              schedules={db.schedules}
              assignments={db.assignments}
              exams={db.exams}
              announcements={db.announcements}
              grades={db.grades}
              onNavigate={(mod) => setActiveModule(mod)}
            />
          )}

          {activeModule === 'users' && (
            <UserManagement
              profiles={db.profiles}
              students={db.students}
              teachers={db.teachers}
              onSaveProfiles={(profiles) => handleUpdateDatabase({ ...db, profiles })}
              onLogAudit={handleAudit}
              currentUser={currentUser}
            />
          )}

          {activeModule === 'academic' && (
            <AcademicManagement
              classes={db.classes}
              subjects={db.subjects}
              schedules={db.schedules}
              teachers={db.teachers}
              settings={db.settings}
              onSaveClasses={(classes) => handleUpdateDatabase({ ...db, classes })}
              onSaveSubjects={(subjects) => handleUpdateDatabase({ ...db, subjects })}
              onSaveSchedules={(schedules) => handleUpdateDatabase({ ...db, schedules })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'assignments' && (
            <AssignmentModule
              assignments={db.assignments}
              submissions={db.submissions}
              subjects={db.subjects}
              classes={db.classes}
              currentUser={currentUser}
              onSaveAssignments={(assignments) => handleUpdateDatabase({ ...db, assignments })}
              onSaveSubmissions={(submissions) => handleUpdateDatabase({ ...db, submissions })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'exams' && (
            <OnlineExamModule
              exams={db.exams}
              subjects={db.subjects}
              classes={db.classes}
              currentUser={currentUser}
              onSaveExams={(exams) => handleUpdateDatabase({ ...db, exams })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'grades' && (
            <GradeManagement
              grades={db.grades}
              students={db.students}
              subjects={db.subjects}
              classes={db.classes}
              currentUser={currentUser}
              onSaveGrades={(grades) => handleUpdateDatabase({ ...db, grades })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'attendance' && (
            <AttendanceModule
              attendance={db.attendance}
              students={db.students}
              classes={db.classes}
              currentUser={currentUser}
              onSaveAttendance={(attendance) => handleUpdateDatabase({ ...db, attendance })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'homeroom' && (
            <HomeroomModule
              students={db.students}
              reportCards={db.reportCards}
              grades={db.grades}
              currentUser={currentUser}
              onSaveReportCards={(reportCards) => handleUpdateDatabase({ ...db, reportCards })}
              onSelectStudentReport={(stdId) => {
                setSelectedStudentForReport(stdId);
                setActiveModule('report_cards');
              }}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'report_cards' && (
            <ReportCardModule
              reportCards={db.reportCards}
              students={db.students}
              settings={db.settings}
              currentUser={currentUser}
              targetStudentId={selectedStudentForReport}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'counseling' && (
            <CounselingModule
              counseling={db.counseling}
              violations={db.violations}
              achievements={db.achievements}
              students={db.students}
              currentUser={currentUser}
              onSaveCounseling={(counseling) => handleUpdateDatabase({ ...db, counseling })}
              onSaveViolations={(violations) => handleUpdateDatabase({ ...db, violations })}
              onSaveAchievements={(achievements) => handleUpdateDatabase({ ...db, achievements })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'parent_portal' && (
            <ParentDashboardModule
              students={db.students}
              grades={db.grades}
              attendance={db.attendance}
              reportCards={db.reportCards}
              announcements={db.announcements}
              currentUser={currentUser}
              onViewReportCard={(stdId) => {
                setSelectedStudentForReport(stdId);
                setActiveModule('report_cards');
              }}
            />
          )}

          {activeModule === 'library' && (
            <LibraryModule
              books={db.books}
              loans={db.loans}
              currentUser={currentUser}
              onSaveBooks={(books) => handleUpdateDatabase({ ...db, books })}
              onSaveLoans={(loans) => handleUpdateDatabase({ ...db, loans })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'subjects' && (
            <SubjectsListModule
              subjects={db.subjects}
              currentUser={currentUser}
            />
          )}

          {activeModule === 'communication' && (
            <CommunicationModule
              announcements={db.announcements}
              currentUser={currentUser}
              onSaveAnnouncements={(announcements) => handleUpdateDatabase({ ...db, announcements })}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsModule
              settings={db.settings}
              grades={db.grades}
              attendance={db.attendance}
              classes={db.classes}
              currentUser={currentUser}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'settings' && (
            <SettingsModule
              settings={db.settings}
              auditLogs={db.auditLogs}
              currentUser={currentUser}
              onSaveSettings={(settings) => handleUpdateDatabase({ ...db, settings })}
              onResetDatabase={handleResetDatabase}
              onExportDatabaseJson={handleExportDatabaseJson}
              onLogAudit={handleAudit}
            />
          )}

          {activeModule === 'profile' && (
            <ProfileModule
              currentUser={currentUser}
              profiles={db.profiles}
              onUpdateProfile={handleUpdateProfile}
              onSwitchUser={handleSwitchUser}
              onLogout={handleLogout}
              onLogAudit={handleAudit}
            />
          )}
        </main>
      </div>

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Notifikasi Pengumuman Sekolah
              </h3>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {db.announcements.map((anc) => (
                <div key={anc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-blue-900 uppercase">{anc.authorRole}</span>
                    <span>{anc.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{anc.title}</h4>
                  <p className="text-slate-600 mt-1 line-clamp-2">{anc.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
