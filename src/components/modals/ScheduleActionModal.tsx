import ModalShell from './ModalShell';
import { useModal } from '../../context/ModalContext';
import { useData } from '../../context/DataContext';

export default function ScheduleActionModal() {
  const { scheduleAction, closeScheduleAction, openEditScheduleModal, openConfirm, openRecordModal } = useModal();
  const { markScheduleComplete } = useData();

  const { scheduleId, isCompleted } = scheduleAction;

  const handleComplete = async () => {
    closeScheduleAction();
    if (!scheduleId) return;
    const updated = await markScheduleComplete(scheduleId);
    if (updated) openRecordModal(updated.courseId);
  };

  return (
    <ModalShell open={scheduleAction.open} onClose={closeScheduleAction} title="排課操作" maxWidth={320}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!isCompleted && (
          <button
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', gap: 10 }}
            onClick={() => {
              closeScheduleAction();
              if (scheduleId) openEditScheduleModal(scheduleId);
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
              edit
            </span>{' '}
            編輯排課
          </button>
        )}
        {!isCompleted && (
          <button
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', gap: 10 }}
            onClick={handleComplete}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
              check_circle
            </span>{' '}
            標記完成
          </button>
        )}
        <button
          className="btn btn-danger"
          style={{ justifyContent: 'flex-start', gap: 10 }}
          onClick={() => {
            closeScheduleAction();
            if (scheduleId) openConfirm('schedule', scheduleId);
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
            delete
          </span>{' '}
          刪除
        </button>
      </div>
    </ModalShell>
  );
}
