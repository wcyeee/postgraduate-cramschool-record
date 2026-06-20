import { useEffect, useState } from 'react';
import ModalShell from './ModalShell';
import { COURSES, LESSONS } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { todayStr } from '../../utils/helpers';
import type { RecordStatus } from '../../types';

export default function RecordModal() {
  const { recordModal, closeRecordModal } = useModal();
  const { records, saveRecord, updateRecord } = useData();
  const { showToast } = useToast();

  const editingRecord = recordModal.editId ? records.find((r) => r.id === recordModal.editId) : undefined;

  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [status, setStatus] = useState<RecordStatus>('done');
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');
  const [partialHr, setPartialHr] = useState(0);
  const [partialMin, setPartialMin] = useState(0);
  const [partialSec, setPartialSec] = useState(0);

  useEffect(() => {
    if (!recordModal.open) return;
    if (editingRecord) {
      setCourseId(editingRecord.courseId);
      setLessonIndex(editingRecord.lessonIndex);
      setStatus(editingRecord.status);
      setDate(editingRecord.date || '');
      setNote(editingRecord.note && editingRecord.note !== '自動補登' ? editingRecord.note : '');
      if (editingRecord.status === 'partial' && editingRecord.partialAt != null) {
        setPartialHr(Math.floor(editingRecord.partialAt / 3600));
        setPartialMin(Math.floor((editingRecord.partialAt % 3600) / 60));
        setPartialSec(editingRecord.partialAt % 60);
      } else {
        setPartialHr(0);
        setPartialMin(0);
        setPartialSec(0);
      }
    } else {
      const initCourse = recordModal.courseId || COURSES[0].id;
      setCourseId(initCourse);
      setLessonIndex(recordModal.lessonIndex ?? 0);
      setStatus('done');
      setDate(todayStr());
      setNote('');
      setPartialHr(0);
      setPartialMin(0);
      setPartialSec(0);
    }
  }, [recordModal, editingRecord]);

  const lessons = LESSONS[courseId] || [];

  const handleSave = async () => {
    if (!courseId || isNaN(lessonIndex) || !date) {
      showToast('請填寫所有必要欄位', 'error');
      return;
    }
    const partialAt = status === 'partial' ? partialHr * 3600 + partialMin * 60 + partialSec : null;

    if (editingRecord) {
      await updateRecord(editingRecord.id, { courseId, lessonIndex, date, note, status, partialAt });
    } else {
      await saveRecord({ courseId, lessonIndex, date, note, status, partialAt });
    }
    closeRecordModal();
  };

  return (
    <ModalShell
      open={recordModal.open}
      onClose={closeRecordModal}
      title="記錄上課進度"
      footer={
        <>
          <button className="btn btn-ghost" onClick={closeRecordModal}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            儲存記錄
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">課程種類</label>
        <select
          className="form-control"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setLessonIndex(0);
          }}
        >
          {COURSES.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">上到哪一堂</label>
        <select className="form-control" value={lessonIndex} onChange={(e) => setLessonIndex(parseInt(e.target.value))}>
          {lessons.map((l, i) => (
            <option value={i} key={i}>
              {i + 1}. {l}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">完成狀態</label>
        <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value as RecordStatus)}>
          <option value="done">已完成整堂</option>
          <option value="partial">上到一半</option>
        </select>
      </div>
      {status === 'partial' && (
        <div className="form-group">
          <label className="form-label">上到幾時</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="number"
              className="form-control"
              value={partialHr}
              min={0}
              style={{ width: 64, padding: '8px 6px', textAlign: 'center' }}
              onChange={(e) => setPartialHr(parseInt(e.target.value) || 0)}
            />
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>時</span>
            <input
              type="number"
              className="form-control"
              value={partialMin}
              min={0}
              max={59}
              style={{ width: 64, padding: '8px 6px', textAlign: 'center' }}
              onChange={(e) => setPartialMin(parseInt(e.target.value) || 0)}
            />
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>分</span>
            <input
              type="number"
              className="form-control"
              value={partialSec}
              min={0}
              max={59}
              style={{ width: 64, padding: '8px 6px', textAlign: 'center' }}
              onChange={(e) => setPartialSec(parseInt(e.target.value) || 0)}
            />
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>秒</span>
          </div>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">上課日期</label>
        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">備注（可選）</label>
        <input
          type="text"
          className="form-control"
          placeholder="例：上到第30分鐘暫停"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}
