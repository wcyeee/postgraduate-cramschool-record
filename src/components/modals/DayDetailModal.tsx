import ModalShell from './ModalShell';
import { COURSES, LESSONS } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { formatDate } from '../../utils/helpers';

export default function DayDetailModal() {
  const { dayDetail, closeDayDetail, openEditScheduleModal, openConfirm, openScheduleModal } = useModal();
  const { records, schedules } = useData();

  const dateStr = dayDetail.date || '';
  const activeSchedules = schedules.filter((s) => s.status !== 'completed');
  const events = dateStr ? [...records, ...activeSchedules].filter((e) => e.date?.startsWith(dateStr)) : [];

  return (
    <ModalShell
      open={dayDetail.open}
      onClose={closeDayDetail}
      title={formatDate(dateStr)}
      maxWidth={380}
      footer={
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            closeDayDetail();
            openScheduleModal(dateStr);
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
            add
          </span>{' '}
          新增排課
        </button>
      }
    >
      {!events.length ? (
        <div style={{ fontSize: 13, color: 'var(--text3)', padding: '8px 0' }}>當日無行程</div>
      ) : (
        events.map((e, i) => {
          const c = COURSES.find((c2) => c2.id === e.courseId);
          const isRecord = records.includes(e as never);
          const lesson = isRecord ? LESSONS[e.courseId]?.[(e as { lessonIndex: number }).lessonIndex] : '';
          return (
            <div
              key={i}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {isRecord ? (
                    <>
                      <span className="material-symbols-rounded" style={{ fontSize: 13 }}>
                        check_circle
                      </span>{' '}
                      {lesson}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-rounded" style={{ fontSize: 13 }}>
                        event
                      </span>{' '}
                      排課
                    </>
                  )}{' '}
                  {e.time || ''}
                </div>
              </div>
              {!isRecord && (
                <span style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    title="編輯"
                    onClick={() => {
                      closeDayDetail();
                      openEditScheduleModal(e.id);
                    }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                      edit
                    </span>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    title="刪除"
                    onClick={() => {
                      closeDayDetail();
                      openConfirm('schedule', e.id);
                    }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                      delete
                    </span>
                  </button>
                </span>
              )}
            </div>
          );
        })
      )}
    </ModalShell>
  );
}
