import type { LessonRecord } from '../types';

const COLORS = ['#6c8ef7', '#a78bfa', '#34d399', '#f59e0b', '#f87171', '#38bdf8'];

export function getCourseColor(idx: number): string {
  return COLORS[idx] || COLORS[0];
}

export function getLastLesson(records: LessonRecord[], courseId: string): LessonRecord | null {
  const recs = records
    .filter((r) => r.courseId === courseId)
    .sort((a, b) => b.lessonIndex - a.lessonIndex);
  return recs[0] || null;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDuration(seconds?: number | null): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h ? h + '時' : ''}${m}分${s}秒`;
}

export function formatHourMinute(seconds?: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h ? h + '時' : ''}${m}分`;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
