import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './config';
import type { LessonRecord, Schedule } from '../types';

export async function fetchAll(): Promise<{ records: LessonRecord[]; schedules: Schedule[] }> {
  const [recSnap, schSnap] = await Promise.all([
    getDocs(collection(db, 'records')),
    getDocs(collection(db, 'schedules')),
  ]);
  return {
    records: recSnap.docs.map((d) => ({ id: d.id, ...d.data() } as LessonRecord)),
    schedules: schSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Schedule)),
  };
}

export async function addRecord(data: Omit<LessonRecord, 'id'>): Promise<LessonRecord> {
  try {
    const ref = await addDoc(collection(db, 'records'), data);
    return { id: ref.id, ...data };
  } catch {
    return { id: 'local_' + Date.now(), ...data };
  }
}

export async function addSchedule(data: Omit<Schedule, 'id'>): Promise<Schedule> {
  try {
    const ref = await addDoc(collection(db, 'schedules'), data);
    return { id: ref.id, ...data };
  } catch {
    return { id: 'local_' + Date.now(), ...data };
  }
}

export async function updateRecord(id: string, data: Partial<LessonRecord>) {
  await updateDoc(doc(db, 'records', id), data);
}

export async function updateSchedule(id: string, data: Partial<Schedule>) {
  await updateDoc(doc(db, 'schedules', id), data);
}

export async function removeRecord(id: string) {
  try {
    await deleteDoc(doc(db, 'records', id));
  } catch {
    /* ignore - local-only item */
  }
}

export async function removeSchedule(id: string) {
  try {
    await deleteDoc(doc(db, 'schedules', id));
  } catch {
    /* ignore - local-only item */
  }
}
