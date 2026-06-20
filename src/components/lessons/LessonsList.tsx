import { COURSES, LESSONS, LESSON_DURATIONS } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { getCourseColor, formatDate, formatDuration, formatHourMinute } from '../../utils/helpers';
import type { LessonRecord } from '../../types';

interface LessonsListProps {
  filterCourse: string;
  onFilterChange: (courseId: string) => void;
}

export default function LessonsList({ filterCourse, onFilterChange }: LessonsListProps) {
  const { records } = useData();
  const { openRecordModal, openEditRecordModal, openConfirm } = useModal();

  const rows: Array<{ course: (typeof COURSES)[number]; idx: number; name: string; rec?: LessonRecord }> = [];
  COURSES.forEach((c) => {
    if (filterCourse !== 'all' && c.id !== filterCourse) return;
    const lessons = LESSONS[c.id] || [];
    const recs = records.filter((r) => r.courseId === c.id);
    lessons.forEach((name, idx) => {
      const rec = recs.find((r) => r.lessonIndex === idx);
      rows.push({ course: c, idx, name, rec });
    });
  });

  return (
    <div>
      <div className="lessons-header" id="lessons-filter-wrap">
        <select
          className="form-control"
          style={{ width: 200 }}
          value={filterCourse}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">所有課程</option>
          {COURSES.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="lessons-list">
        {!rows.length ? (
          <div className="empty-state">
            <span className="material-symbols-rounded empty-icon" style={{ fontSize: 36 }}>
              menu_book
            </span>
            <div className="empty-text">選擇課程查看堂數</div>
          </div>
        ) : (
          rows.map(({ course: c, idx, name, rec }) => {
            const color = getCourseColor(c.color);
            const statusText = rec ? (
              rec.status === 'partial' && rec.partialAt != null ? (
                <>
                  <span className="material-symbols-rounded" style={{ fontSize: 13 }}>
                    pause_circle
                  </span>{' '}
                  上到 {formatDuration(rec.partialAt)} · {formatDate(rec.date)}
                </>
              ) : (
                <>
                  <span className="material-symbols-rounded" style={{ fontSize: 13 }}>
                    check_circle
                  </span>{' '}
                  {formatDate(rec.date)}
                </>
              )
            ) : (
              '未上'
            );
            const dur = LESSON_DURATIONS[c.id]?.[idx];
            const durStr = dur ? formatHourMinute(dur) : '';

            return (
              <div className="lesson-item" key={`${c.id}-${idx}`}>
                <div className="lesson-num" style={{ background: `${color}20`, color }}>
                  {idx + 1}
                </div>
                <div className="lesson-info">
                  <div className="lesson-name">{name}</div>
                  <div className="lesson-meta">
                    {c.name}
                    {durStr ? ` · ${durStr}` : ''} · {statusText}
                  </div>
                </div>
                <div className="lesson-actions">
                  {!rec ? (
                    <button className="btn btn-ghost btn-sm" onClick={() => openRecordModal(c.id, idx)}>
                      記錄
                    </button>
                  ) : (
                    <span style={{ display: 'flex', gap: 7 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditRecordModal(rec.id)}>
                        編輯
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => openConfirm('record', rec.id)}>
                        刪除
                      </button>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
