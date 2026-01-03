
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Session, SubjectStats } from '../types';

interface StatsBoardProps {
  sessions: Session[];
}

const COLORS = ['#ff5f00', '#00509d', '#ffdf00', '#009b4d', '#f4a261', '#2a9d8f'];

export const StatsBoard: React.FC<StatsBoardProps> = ({ sessions }) => {
  const stats = React.useMemo(() => {
    const map = new Map<string, number>();
    // Filter sessions from the last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    sessions
      .filter(s => s.timestamp >= oneWeekAgo)
      .forEach(s => {
        map.set(s.subject, (map.get(s.subject) || 0) + s.durationMinutes);
      });

    // We cast to any or a plain object to satisfy Recharts' flexible data requirements 
    // which often expects an index signature or specific Record type.
    return Array.from(map.entries()).map(([subject, totalMinutes]) => ({
      subject,
      totalMinutes
    })) as Record<string, any>[];
  }, [sessions]);

  if (stats.length === 0) {
    return (
      <div className="text-center p-8 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-gray-500 italic">No study data for this week yet. Let's go!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-center font-bold text-gray-700 mb-2">Weekly Progress</h3>
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
            {stats.map((entry, index) => (
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