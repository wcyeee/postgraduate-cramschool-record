import { useState } from 'react';
import TopNav from './components/layout/TopNav';
import HomePage from './pages/HomePage';
import LessonsSchedulePage from './pages/LessonsSchedulePage';
import SchedulePage from './pages/SchedulePage';
import RecordModal from './components/modals/RecordModal';
import ScheduleModal from './components/modals/ScheduleModal';
import DayDetailModal from './components/modals/DayDetailModal';
import LoginModal from './components/modals/LoginModal';
import ScheduleActionModal from './components/modals/ScheduleActionModal';
import ConfirmModal from './components/modals/ConfirmModal';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import type { Page } from './types/nav';
import type { ScheduleFilter } from './types';

export default function App() {
  const { user, authChecked } = useAuth();
  const { loading } = useData();

  const [activePage, setActivePage] = useState<Page>('home');
  const [courseFilter, setCourseFilter] = useState('all');
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('all');

  return (
    <div className="app">
      <TopNav activePage={activePage} onNavigate={setActivePage} />

      <main className="main">
        {authChecked && user && loading && (
          <div className="loading">
            <div className="spinner" />
            載入資料中...
          </div>
        )}

        {activePage === 'home' && (
          <HomePage onNavigate={setActivePage} onSelectCourseFilter={(courseId) => setCourseFilter(courseId)} />
        )}

        {activePage === 'lessons' && (
          <LessonsSchedulePage
            courseFilter={courseFilter}
            onCourseFilterChange={setCourseFilter}
            scheduleFilter={scheduleFilter}
            onScheduleFilterChange={setScheduleFilter}
          />
        )}

        {activePage === 'schedule' && (
          <SchedulePage scheduleFilter={scheduleFilter} onScheduleFilterChange={setScheduleFilter} />
        )}
      </main>

      <RecordModal />
      <ScheduleModal />
      <DayDetailModal />
      <ScheduleActionModal />
      <ConfirmModal />
      <LoginModal />
    </div>
  );
}
