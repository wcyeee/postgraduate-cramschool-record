import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LessonRecord, Schedule, RecordStatus } from '../types';
import * as api from '../firebase/firestore';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface SaveRecordInput {
  courseId: string;
  lessonIndex: number;
  date: string;
  time?: string;
  note?: string;
  status: RecordStatus;
  partialAt: number | null;
}

interface SaveScheduleInput {
  courseId: string;
  date: string;
  time?: string;
  minutes?: number;
  note?: string;
}

interface DataContextValue {
  records: LessonRecord[];
  schedules: Schedule[];
  loading: boolean;
  saveRecord: (data: SaveRecordInput) => Promise<void>;
  updateRecord: (id: string, data: Partial<LessonRecord>) => Promise<void>;
  saveSchedule: (data: SaveScheduleInput) => Promise<void>;
  updateSchedule: (id: string, data: Partial<Schedule>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  markScheduleComplete: (id: string) => Promise<Schedule | undefined>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState<LessonRecord[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .fetchAll()
      .then(({ records, schedules }) => {
        setRecords(records);
        setSchedules(schedules);
      })
      .catch(() => {
        console.warn('Firebase not configured, using local state');
      })
      .finally(() => setLoading(false));
  }, [user]);

  // 直接新增一筆記錄（不含「自動補登」邏輯，給內部使用）
  const addRecordRaw = useCallback(async (data: Omit<LessonRecord, 'id'>) => {
    const rec = await api.addRecord(data);
    setRecords((prev) => [...prev, rec]);
    return rec;
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    await api.removeRecord(id);
  }, []);

  const deleteSchedule = useCallback(async (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    await api.removeSchedule(id);
  }, []);

  // 對應原本 save-record 按鈕邏輯：新增時會自動補登前面未完成的堂數
  const saveRecord = useCallback(
    async (data: SaveRecordInput) => {
      const { courseId, lessonIndex, date, time = '', note = '' } = data;

      const existing = records.find((r) => r.courseId === courseId && r.lessonIndex === lessonIndex);
      if (existing) await deleteRecord(existing.id);

      for (let i = 0; i < lessonIndex; i++) {
        const alreadyDone = records.find((r) => r.courseId === courseId && r.lessonIndex === i);
        if (!alreadyDone || alreadyDone.status === 'partial') {
          if (alreadyDone) await deleteRecord(alreadyDone.id);
          await addRecordRaw({
            courseId,
            lessonIndex: i,
            date,
            time,
            note: '自動補登',
            status: 'done',
            partialAt: null,
          });
        }
      }

      await addRecordRaw({
        courseId,
        lessonIndex,
        date,
        time,
        note,
        status: data.status,
        partialAt: data.partialAt,
      });
      showToast('已記錄上課進度', 'success');
    },
    [records, addRecordRaw, deleteRecord, showToast]
  );

  const updateRecord = useCallback(
    async (id: string, data: Partial<LessonRecord>) => {
      try {
        await api.updateRecord(id, data);
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
        showToast('已更新記錄', 'success');
      } catch {
        showToast('更新失敗', 'error');
      }
    },
    [showToast]
  );

  const saveSchedule = useCallback(
    async (data: SaveScheduleInput) => {
      const sch = await api.addSchedule({ ...data, status: 'scheduled' });
      setSchedules((prev) => [...prev, sch]);
      showToast('排課成功', 'success');
    },
    [showToast]
  );

  const updateSchedule = useCallback(
    async (id: string, data: Partial<Schedule>) => {
      try {
        await api.updateSchedule(id, data);
        setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
        showToast('排課已更新', 'success');
      } catch {
        showToast('更新失敗', 'error');
      }
    },
    [showToast]
  );

  const markScheduleComplete = useCallback(
    async (id: string) => {
      const s = schedules.find((x) => x.id === id);
      if (!s) return;
      try {
        await api.updateSchedule(id, { status: 'completed' });
      } catch {
        /* ignore */
      }
      setSchedules((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'completed' } : x)));
      showToast('標記完成', 'success');
      return { ...s, status: 'completed' as const };
    },
    [schedules, showToast]
  );

  const deleteRecordWithToast = useCallback(
    async (id: string) => {
      await deleteRecord(id);
      showToast('已刪除', 'success');
    },
    [deleteRecord, showToast]
  );

  const deleteScheduleWithToast = useCallback(
    async (id: string) => {
      await deleteSchedule(id);
      showToast('已刪除', 'success');
    },
    [deleteSchedule, showToast]
  );

  return (
    <DataContext.Provider
      value={{
        records,
        schedules,
        loading,
        saveRecord,
        updateRecord,
        saveSchedule,
        updateSchedule,
        deleteRecord: deleteRecordWithToast,
        deleteSchedule: deleteScheduleWithToast,
        markScheduleComplete,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
