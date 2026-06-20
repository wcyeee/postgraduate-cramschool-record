import { COURSES } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { getCourseColor, formatDate, todayStr } from '../../utils/helpers';

export default function UpcomingList() {
  const { schedules } = useData();
  const { openEditScheduleModal, openConfirm } = useModal();
  const today = todayStr();

  const upcoming = schedules
    .filter((s) => s.date >= today && s.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    return (
      <div className="card">
        <div className="card-title">即將上課</div>
        <div className="upcoming-list">
          <div className="empty-state">
            <span className="material-symbols-rounded empty-icon" style={{ fontSize: 36 }}>
              calendar_today
            </span>
            <div className="empty-text">暫無排課</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">即將上課</div>
      <div className="upcoming-list">
        {upcoming.map((s) => {
          const c = COURSES.find((c2) => c2.id === s.courseId);
          const color = c ? getCourseColor(c.color) : '#6c8ef7';
          return (
            <div className="event-item" key={s.id} style={{ borderLeftColor: color, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => openEditScheduleModal(s.id)}>
                <div className="event-time">
                  {formatDate(s.date)} {s.time || ''}
                </div>
                <div className="event-name">{c?.name || ''}</div>
                <div className="event-meta">
                  {s.minutes ? `${s.minutes}分鐘` : ''} {s.fromLesson !== undefined ? `第${s.fromLesson + 1}堂` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 16, color: 'var(--text3)', cursor: 'pointer' }}
                  onClick={() => openEditScheduleModal(s.id)}
                >
                  edit
                </span>
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 16, color: 'var(--accent5)', cursor: 'pointer' }}
                  onClick={() => openConfirm('schedule', s.id)}
                >
                  delete
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
