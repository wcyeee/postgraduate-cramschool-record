import { COURSES } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { getCourseColor, todayStr } from '../../utils/helpers';
import type { ScheduleFilter } from '../../types';

const FILTERS: { key: ScheduleFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'upcoming', label: '即將上課' },
  { key: 'completed', label: '已完成' },
];

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

interface ScheduleListProps {
  filter: ScheduleFilter;
  onFilterChange: (f: ScheduleFilter) => void;
  listId?: string;
}

export default function ScheduleList({ filter, onFilterChange, listId }: ScheduleListProps) {
  const { schedules } = useData();
  const { openScheduleAction } = useModal();
  const today = todayStr();

  let items = [...schedules].sort((a, b) => {
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    if (aCompleted && bCompleted) return (b.date || '').localeCompare(a.date || '');
    return (a.date || '').localeCompare(b.date || '');
  });
  if (filter === 'upcoming') items = items.filter((s) => s.date >= today && s.status !== 'completed');
  else if (filter === 'completed') items = items.filter((s) => s.status === 'completed');
  else if (filter !== 'all') items = items.filter((s) => s.courseId === filter);

  return (
    <div>
      <div className="schedule-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${filter === f.key ? ' active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span style={{ width: 1, background: 'var(--border)', height: 28, display: 'inline-block', margin: '0 4px' }} />
        {COURSES.map((c) => (
          <button
            key={c.id}
            className={`filter-btn${filter === c.id ? ' active' : ''}`}
            onClick={() => onFilterChange(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="schedule-list" id={listId}>
        {!items.length ? (
          <div className="empty-state">
            <span className="material-symbols-rounded empty-icon" style={{ fontSize: 36 }}>
              event_note
            </span>
            <div className="empty-text">暫無排課記錄</div>
          </div>
        ) : (
          items.map((s) => {
            const c = COURSES.find((c2) => c2.id === s.courseId);
            const color = c ? getCourseColor(c.color) : '#6c8ef7';
            const isCompleted = s.status === 'completed';
            const dt = s.date ? new Date(s.date) : null;
            const dateDisp = dt ? `${dt.getMonth() + 1}/${dt.getDate()}` : '';
            const dayDisp = dt ? `週${DAY_NAMES[dt.getDay()]}` : '';
            let detailStr = '';
            if (s.fromLesson !== undefined && s.toLesson !== undefined) {
              detailStr = `第${s.fromLesson + 1}～${s.toLesson + 1}堂`;
            } else if (s.minutes) {
              detailStr = `${s.minutes}分鐘`;
            }
            return (
              <div className="schedule-item" key={s.id} style={isCompleted ? { opacity: 0.4 } : undefined}>
                <div className="schedule-time-block">
                  <div className="schedule-date" style={{ color }}>
                    {dateDisp}
                  </div>
                  <div className="schedule-time">{dayDisp}</div>
                  <div className="schedule-time">{s.time || ''}</div>
                </div>
                <div className="schedule-divider" />
                <div className="schedule-info">
                  <div className="schedule-course">{c?.name || ''}</div>
                  <div className="schedule-detail">
                    {detailStr} {s.note ? `· ${s.note}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`schedule-status ${isCompleted ? 'status-completed' : 'status-scheduled'}`}>
                    {isCompleted ? '完成' : '排定'}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => openScheduleAction(s.id, isCompleted)}>
                    更多
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
