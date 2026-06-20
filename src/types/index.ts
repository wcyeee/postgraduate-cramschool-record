export interface Course {
  id: string;
  name: string;
  total: number;
  color: number;
  hours: number;
}

export type RecordStatus = 'done' | 'partial';
export type ScheduleStatus = 'scheduled' | 'completed';

export interface LessonRecord {
  id: string;
  courseId: string;
  lessonIndex: number;
  date: string;
  time?: string;
  note?: string;
  status: RecordStatus;
  partialAt: number | null;
}

export interface Schedule {
  id: string;
  courseId: string;
  date: string;
  time?: string;
  minutes?: number;
  fromLesson?: number;
  toLesson?: number;
  note?: string;
  status: ScheduleStatus;
}

export type ScheduleFilter = 'all' | 'upcoming' | 'completed' | string;

export type ToastType = 'success' | 'error';
