import ModalShell from './ModalShell';
import { useModal } from '../../context/ModalContext';
import { useData } from '../../context/DataContext';

export default function ConfirmModal() {
  const { confirm, closeConfirm } = useModal();
  const { deleteRecord, deleteSchedule } = useData();

  const handleDelete = async () => {
    if (!confirm.id || !confirm.type) return;
    closeConfirm();
    if (confirm.type === 'record') await deleteRecord(confirm.id);
    else await deleteSchedule(confirm.id);
  };

  return (
    <ModalShell
      open={confirm.open}
      onClose={closeConfirm}
      title="確認刪除"
      maxWidth={360}
      footer={
        <>
          <button className="btn btn-ghost" onClick={closeConfirm}>
            取消
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            確認刪除
          </button>
        </>
      }
    >
      <div style={{ fontSize: 14, color: 'var(--text2)' }}>確定要刪除嗎？此操作無法復原。</div>
    </ModalShell>
  );
}
