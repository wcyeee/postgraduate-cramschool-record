import { useEffect, useState } from 'react';
import ModalShell from './ModalShell';
import { COURSES } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { todayStr } from '../../utils/helpers';

export default function ScheduleModal() {
  const { scheduleModal, closeScheduleModal } = useModal();
  const { schedules, saveSchedule, updateSchedule } = useData();
  const { showToast } = useToast();

  const editingSchedule = scheduleModal.editId ? schedules.find((s) => s.id === scheduleModal.editId) : undefined;

  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('08:40');
  const [minutes, setMinutes] = useState(200);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!scheduleModal.open) return;
    if (editingSchedule) {
      setCourseId(editingSchedule.courseId);
      setDate(editingSchedule.date || '');
      setTime(editingSchedule.time || '08:40');
      setMinutes(editingSchedule.minutes || 200);
      setNote(editingSchedule.note || '');
    } else {
      setCourseId(COURSES[0].id);
      setDate(scheduleModal.date || todayStr());
      setTime('08:40');
      setMinutes(200);
      setNote('');
    }
  }, [scheduleModal, editingSchedule]);

  const handleSave = async () => {
    if (!courseId || !date) {
      showToast('請填寫必要欄位', 'error');
      return;
    }
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, { courseId, date, time, minutes, note });
    } else {
      await saveSchedule({ courseId, date, time, minutes, note });
    }
    closeScheduleModal();
  };

  return (
    <ModalShell
      open={scheduleModal.open}
      onClose={closeScheduleModal}
      title={editingSchedule ? '編輯排課' : '新增排課'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={closeScheduleModal}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            儲存排課
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">課程種類</label>
        <select className="form-control" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {COURSES.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">排課日期</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">上課時間</label>
          <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">上課分鐘數</label>
        <input
          type="number"
          className="form-control"
          value={minutes}
          min={15}
          step={15}
          onChange={(e) => setMinutes(parseInt(e.target.value) || 200)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">備注（可選）</label>
        <input
          type="text"
          className="form-control"
          placeholder="例：重點複習、考前衝刺"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}
