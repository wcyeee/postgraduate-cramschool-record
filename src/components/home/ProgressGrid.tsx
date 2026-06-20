import { COURSES, LESSONS } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { getCourseColor, getLastLesson, formatDate } from '../../utils/helpers';

export default function ProgressGrid() {
  const { records } = useData();

  return (
    <div id="progress-grid" className="progress-grid">
      {COURSES.map((c) => {
        const last = getLastLesson(records, c.id);
        const done = last ? last.lessonIndex + 1 : 0;
        const pct = Math.round((done / c.total) * 100);
        const color = getCourseColor(c.color);
        const lastDate = last ? formatDate(last.date) : '尚未開始';
        const lastLesson = last ? LESSONS[c.id]?.[last.lessonIndex] || '' : '';
        return (
          <div className="progress-card" key={c.id}>
            <div className="progress-card-header">
              <div>
                <div className="progress-course-name">{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{c.hours}小時</div>
              </div>
              <div className="progress-badge" style={{ background: `${color}20`, color }}>
                {pct}%
              </div>
            </div>
            <div className="progress-stats">
              <div className="progress-stat">
                <div className="progress-stat-val" style={{ color }}>
                  {done}
                </div>
                <div className="progress-stat-label">已完成堂數</div>
              </div>
              <div className="progress-stat">
                <div className="progress-stat-val">{c.total - done}</div>
                <div className="progress-stat-label">剩餘堂數</div>
              </div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="last-lesson">
              最後上課：{lastDate}
              <br />
              {lastLesson && <span style={{ color: 'var(--text2)' }}>{lastLesson}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
