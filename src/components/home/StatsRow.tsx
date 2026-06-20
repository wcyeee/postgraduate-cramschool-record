import { COURSES } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { getCourseColor, getLastLesson } from '../../utils/helpers';

interface StatsRowProps {
  onGoToProgress: (courseId: string) => void;
}

export default function StatsRow({ onGoToProgress }: StatsRowProps) {
  const { records } = useData();
  return (
    <div id="stats-row" className="stats-row">
      {COURSES.map((c) => {
        const last = getLastLesson(records, c.id);
        const done = last ? last.lessonIndex + 1 : 0;
        const pct = Math.round((done / c.total) * 100);
        const color = getCourseColor(c.color);
        return (
          <div className="stat-card" key={c.id} onClick={() => onGoToProgress(c.id)}>
            <div className="stat-label">課程進度</div>
            <div className="stat-name" title={c.name}>
              {c.name}
            </div>
            <div className="stat-bar-bg">
              <div className="stat-bar" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="stat-pct">
              {done}/{c.total} ({pct}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}
