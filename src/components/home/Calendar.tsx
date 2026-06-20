import { useState, type JSX } from 'react';
import { COURSES } from '../../data/courses';
import { useData } from '../../context/DataContext';
import { getCourseColor } from '../../utils/helpers';
import type { LessonRecord, Schedule } from '../../types';

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

interface CalendarProps {
  onDayClick: (dateStr: string) => void;
}

export default function Calendar({ onDayClick }: CalendarProps) {
  const { records, schedules } = useData();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const calPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const calNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  // 建立日期 -> 事件 map（已完成的排課不顯示在月曆上）
  const evMap: Record<string, Array<LessonRecord | Schedule>> = {};
  const activeSchedules = schedules.filter((s) => s.status !== 'completed');
  [...records, ...activeSchedules].forEach((item) => {
    if (!item.date) return;
    const d = item.date.split('T')[0];
    if (!evMap[d]) evMap[d] = [];
    evMap[d].push(item);
  });

  const cells: JSX.Element[] = [];
  const prevDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(
      <div className="cal-day other-month" key={`prev-${i}`}>
        <span className="cal-day-num">{prevDays - i}</span>
      </div>
    );
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    const events = evMap[dateStr] || [];
    const isRecordItem = (ev: LessonRecord | Schedule): ev is LessonRecord => records.includes(ev as LessonRecord);

    cells.push(
      <div
        className={`cal-day${isToday ? ' today' : ''}`}
        key={dateStr}
        onClick={() => onDayClick(dateStr)}
      >
        <span className="cal-day-num">{d}</span>
        {events.slice(0, 2).map((ev, i) => {
          const c = COURSES.find((c2) => c2.id === ev.courseId);
          const color = c ? getCourseColor(c.color) : '#6c8ef7';
          const isRecord = isRecordItem(ev);
          const label = c?.name?.slice(0, 4) || '';
          const time = ev.time ? ev.time.slice(0, 5) : '';
          return (
            <div
              key={i}
              style={{
                background: `${color}22`,
                color,
                fontSize: '10.5px',
                borderRadius: 3,
                padding: '2px 4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {isRecord && (
                <span className="material-symbols-rounded" style={{ fontSize: 10, verticalAlign: 'middle' }}>
                  check
                </span>
              )}{' '}
              {label} {time}
            </div>
          );
        })}
      </div>
    );
  }
  const remaining = 42 - firstDay - daysInMonth;
  for (let d = 1; d <= remaining; d++) {
    cells.push(
      <div className="cal-day other-month" key={`next-${d}`}>
        <span className="cal-day-num">{d}</span>
      </div>
    );
  }

  return (
    <div className="calendar-grid">
      <div className="cal-header">
        <div className="cal-month">{`${currentYear} 年 ${MONTHS[currentMonth]}`}</div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={calPrev}>
            ‹
          </button>
          <button className="cal-nav-btn" onClick={calNext}>
            ›
          </button>
        </div>
      </div>
      <div className="cal-days-header">
        {DAY_LABELS.map((l) => (
          <div className="cal-day-label" key={l}>
            {l}
          </div>
        ))}
      </div>
      <div className="cal-days">{cells}</div>
    </div>
  );
}
