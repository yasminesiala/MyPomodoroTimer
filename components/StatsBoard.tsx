import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Session } from '../types';

export type StatsRange = 'week' | 'month';

interface StatsBoardProps {
  sessions: Session[];
  range?: StatsRange;
  offset?: number; // 0 = current period, 1 = previous period, etc.
}

const COLORS = ['#ff5f00', '#00509d', '#ffdf00', '#009b4d', '#f4a261', '#2a9d8f'];

function startOfWeek(ts: number) {
  // Week starts on Monday
  const d = new Date(ts);
  const day = d.getDay(); // 0=Sun ... 6=Sat
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfMonth(ts: number) {
  const d = new Date(ts);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function addWeeks(ts: number, weeks: number) {
  const d = new Date(ts);
  d.setDate(d.getDate() + weeks * 7);
  return d.getTime();
}

function addMonths(ts: number, months: number) {
  const d = new Date(ts);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ sessions, range = 'week', offset = 0 }) => {
  const { stats, title, emptyLabel } = React.useMemo(() => {
    const now = Date.now();

    let start: number;
    let end: number;

    if (range === 'week') {
      // current week start, then shift back by offset
      const baseStart = startOfWeek(now);
      start = addWeeks(baseStart, -offset);
      end = addWeeks(start, 1);
    } else {
      // current month start, then shift back by offset
      const baseStart = startOfMonth(now);
      start = addMonths(baseStart, -offset);
      end = addMonths(start, 1);
    }

    const map = new Map<string, number>();

    sessions
      .filter((s) => s.timestamp >= start && s.timestamp < end)
      .forEach((s) => {
        map.set(s.subject, (map.get(s.subject) || 0) + s.durationMinutes);
      });

    const statsArr = Array.from(map.entries()).map(([subject, totalMinutes]) => ({
      subject,
      totalMinutes,
    })) as Record<string, any>[];

    // Labels
    let titleText = '';
    if (range === 'week') {
      const startLabel = new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const endLabel = new Date(end - 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      titleText = `Weekly Progress (${startLabel} – ${endLabel})`;
    } else {
      titleText = `Monthly Progress (${new Date(start).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })})`;
    }

    const emptyText = range === 'week'
      ? 'No study data for this week yet. Let’s go!'
      : 'No study data for this month yet. Let’s go!';

    return { stats: statsArr, title: titleText, emptyLabel: emptyText };
  }, [sessions, range, offset]);

  if (stats.length === 0) {
    return (
      <div className="text-center p-8 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-gray-500 italic">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-center font-bold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={stats}
            dataKey="totalMinutes"
            nameKey="subject"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            label
          >
            {stats.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '2px solid black' }}
            formatter={(value: number) => [`${value} mins`, 'Study Time']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
