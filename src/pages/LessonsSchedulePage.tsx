import LessonsList from '../components/lessons/LessonsList';
import ScheduleList from '../components/schedule/ScheduleList';
import { useModal } from '../context/ModalContext';
import type { ScheduleFilter } from '../types';

interface LessonsSchedulePageProps {
  courseFilter: string;
  onCourseFilterChange: (courseId: string) => void;
  scheduleFilter: ScheduleFilter;
  onScheduleFilterChange: (f: ScheduleFilter) => void;
}

export default function LessonsSchedulePage({
  courseFilter,
  onCourseFilterChange,
  scheduleFilter,
  onScheduleFilterChange,
}: LessonsSchedulePageProps) {
  const { openRecordModal, openScheduleModal } = useModal();

  return (
    <div id="page-lessons" className="page active">
      <div className="lessons-schedule-wrap">
        {/* Lessons Page */}
        <div>
          <div className="page-header">
            <div>
              <div className="page-title">課程記錄</div>
              <div className="page-subtitle">記錄每堂課的上課情況</div>
            </div>
            <button className="btn btn-primary" onClick={() => openRecordModal()}>
              + 記錄上課
            </button>
          </div>
          <LessonsList filterCourse={courseFilter} onFilterChange={onCourseFilterChange} />
        </div>

        {/* Schedule Page */}
        <div id="schedule-section">
          <div className="page-header">
            <div>
              <div className="page-title">排課管理</div>
              <div className="page-subtitle">安排與追蹤課程時程</div>
            </div>
            <button className="btn btn-primary" onClick={() => openScheduleModal()}>
              + 新增排課
            </button>
          </div>
          <ScheduleList filter={scheduleFilter} onFilterChange={onScheduleFilterChange} listId="schedule-list" />
        </div>
      </div>
    </div>
  );
}
