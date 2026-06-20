import ScheduleList from '../components/schedule/ScheduleList';
import { useModal } from '../context/ModalContext';
import type { ScheduleFilter } from '../types';

interface SchedulePageProps {
  scheduleFilter: ScheduleFilter;
  onScheduleFilterChange: (f: ScheduleFilter) => void;
}

export default function SchedulePage({ scheduleFilter, onScheduleFilterChange }: SchedulePageProps) {
  const { openScheduleModal } = useModal();

  return (
    <div id="page-schedule" className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">排課管理</div>
          <div className="page-subtitle">安排與追蹤課程時程</div>
        </div>
        <button className="btn btn-primary" onClick={() => openScheduleModal()}>
          + 新增排課
        </button>
      </div>
      <ScheduleList filter={scheduleFilter} onFilterChange={onScheduleFilterChange} listId="schedule-list-mobile" />
    </div>
  );
}
