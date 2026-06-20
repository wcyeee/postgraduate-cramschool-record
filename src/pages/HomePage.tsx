import StatsRow from '../components/home/StatsRow';
import Calendar from '../components/home/Calendar';
import CurrentProgress from '../components/home/CurrentProgress';
import UpcomingList from '../components/home/UpcomingList';
import ProgressGrid from '../components/home/ProgressGrid';
import { useModal } from '../context/ModalContext';
import type { Page } from '../types/nav';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onSelectCourseFilter: (courseId: string) => void;
}

export default function HomePage({ onNavigate, onSelectCourseFilter }: HomePageProps) {
  const { openRecordModal, openScheduleModal, openDayDetail } = useModal();

  const goToProgress = (courseId: string) => {
    onNavigate('lessons');
    onSelectCourseFilter(courseId);
  };

  return (
    <div id="page-home" className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">總覽</div>
          <div className="page-subtitle">本月課程進度與行程</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => openRecordModal()}>
            + 記錄上課
          </button>
          <button className="btn btn-primary" onClick={() => openScheduleModal()}>
            + 新增排課
          </button>
        </div>
      </div>

      <StatsRow onGoToProgress={goToProgress} />

      <div className="calendar-wrap">
        <Calendar onDayClick={(d) => openDayDetail(d)} />
        <div className="side-panel">
          <CurrentProgress />
          <UpcomingList />
        </div>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>課程進度</div>
      </div>
      <ProgressGrid />
    </div>
  );
}
