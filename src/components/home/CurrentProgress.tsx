import { COURSES, LESSONS } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { getCourseColor, getLastLesson, formatDuration } from '../../utils/helpers';

export default function CurrentProgress() {
  const { records } = useData();
  const { openEditRecordModal } = useModal();

  const items = COURSES.map((c) => {
    const last = getLastLesson(records, c.id);
    if (!last) return null;
    const lessonName = LESSONS[c.id]?.[last.lessonIndex] || '';
    const color = getCourseColor(c.color);
    const progressStr =
      last.status === 'partial' && last.partialAt != null ? formatDuration(last.partialAt) : '已完成整堂';
    return (
      <div
        key={c.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          background: 'var(--surface2)',
          borderRadius: 8,
          borderLeft: `3px solid ${color}`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 2 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lessonName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            {progressStr}
            {last.note && last.note !== '自動補登' ? ` · ${last.note}` : ''}
          </div>
        </div>
        <span
          className="material-symbols-rounded"
          style={{ fontSize: 16, color: 'var(--text3)', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => openEditRecordModal(last.id)}
        >
          edit
        </span>
      </div>
    );
  }).filter(Boolean);

  return (
    <div className="card">
      <div className="card-title">目前上課進度</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.length ? items : <div style={{ fontSize: 13, color: 'var(--text3)', padding: 8 }}>尚無上課紀錄</div>}
      </div>
    </div>
  );
}
