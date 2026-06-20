import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface RecordModalState {
  open: boolean;
  courseId?: string;
  lessonIndex?: number;
  editId?: string;
}

export interface ScheduleModalState {
  open: boolean;
  date?: string;
  editId?: string;
}

export interface DayDetailState {
  open: boolean;
  date?: string;
}

export interface ScheduleActionState {
  open: boolean;
  scheduleId?: string;
  isCompleted?: boolean;
}

export interface ConfirmState {
  open: boolean;
  type?: 'record' | 'schedule';
  id?: string;
}

interface ModalContextValue {
  recordModal: RecordModalState;
  openRecordModal: (courseId?: string, lessonIndex?: number) => void;
  openEditRecordModal: (editId: string) => void;
  closeRecordModal: () => void;

  scheduleModal: ScheduleModalState;
  openScheduleModal: (date?: string) => void;
  openEditScheduleModal: (editId: string) => void;
  closeScheduleModal: () => void;

  dayDetail: DayDetailState;
  openDayDetail: (date: string) => void;
  closeDayDetail: () => void;

  scheduleAction: ScheduleActionState;
  openScheduleAction: (scheduleId: string, isCompleted: boolean) => void;
  closeScheduleAction: () => void;

  confirm: ConfirmState;
  openConfirm: (type: 'record' | 'schedule', id: string) => void;
  closeConfirm: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const initialRecord: RecordModalState = { open: false };
const initialSchedule: ScheduleModalState = { open: false };
const initialDay: DayDetailState = { open: false };
const initialAction: ScheduleActionState = { open: false };
const initialConfirm: ConfirmState = { open: false };

export function ModalProvider({ children }: { children: ReactNode }) {
  const [recordModal, setRecordModal] = useState<RecordModalState>(initialRecord);
  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>(initialSchedule);
  const [dayDetail, setDayDetail] = useState<DayDetailState>(initialDay);
  const [scheduleAction, setScheduleAction] = useState<ScheduleActionState>(initialAction);
  const [confirm, setConfirm] = useState<ConfirmState>(initialConfirm);

  const value: ModalContextValue = {
    recordModal,
    openRecordModal: (courseId, lessonIndex) =>
      setRecordModal({ open: true, courseId, lessonIndex }),
    openEditRecordModal: (editId) => setRecordModal({ open: true, editId }),
    closeRecordModal: () => setRecordModal(initialRecord),

    scheduleModal,
    openScheduleModal: (date) => setScheduleModal({ open: true, date }),
    openEditScheduleModal: (editId) => setScheduleModal({ open: true, editId }),
    closeScheduleModal: () => setScheduleModal(initialSchedule),

    dayDetail,
    openDayDetail: (date) => setDayDetail({ open: true, date }),
    closeDayDetail: () => setDayDetail(initialDay),

    scheduleAction,
    openScheduleAction: (scheduleId, isCompleted) =>
      setScheduleAction({ open: true, scheduleId, isCompleted }),
    closeScheduleAction: () => setScheduleAction(initialAction),

    confirm,
    openConfirm: (type, id) => setConfirm({ open: true, type, id }),
    closeConfirm: () => setConfirm(initialConfirm),
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
