
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, Session } from './types';
import { MiffyBunny } from './components/MiffyBunny';
import { StatsBoard } from './components/StatsBoard';

const WORK_TIME = 50 * 60;
const REST_TIME = 10 * 60;

interface Entry {
  subject: string;
  minutes: number;
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const saved = localStorage.getItem('miffy_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([{ subject: '', minutes: 50 }]);
  
  const [recentSubjects, setRecentSubjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('miffy_recent_subjects');
      return saved ? JSON.parse(saved) : ['Math', 'English', 'Science', 'Art'];
    } catch { return ['Math', 'English', 'Science', 'Art']; }
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('miffy_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('miffy_recent_subjects', JSON.stringify(recentSubjects));
  }, [recentSubjects]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    if (mode === TimerMode.WORK) {
      setShowSubjectModal(true);
      setEntries([{ subject: '', minutes: 50 }]);
    } else {
      setMode(TimerMode.WORK);
      setTimeLeft(WORK_TIME);
    }
  }, [mode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === TimerMode.WORK ? WORK_TIME : REST_TIME);
  };

  const skipMode = () => {
    setIsActive(false);
    if (mode === TimerMode.WORK) {
        handleTimerComplete();
    } else {
        setMode(TimerMode.WORK);
        setTimeLeft(WORK_TIME);
    }
  }

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = entries.filter(ent => ent.subject.trim() !== '');
    
    if (validEntries.length === 0) return;

    const newSessions: Session[] = validEntries.map(ent => ({
      id: Math.random().toString(36).substr(2, 9),
      subject: ent.subject.trim(),
      durationMinutes: ent.minutes,
      timestamp: Date.now(),
    }));

    setSessions(prev => [...prev, ...newSessions]);
    
    const newRecents = [...recentSubjects];
    validEntries.forEach(ent => {
      if (!newRecents.includes(ent.subject.trim())) {
        newRecents.unshift(ent.subject.trim());
      }
    });
    setRecentSubjects(newRecents.slice(0, 6));

    setShowSubjectModal(false);
    setMode(TimerMode.REST);
    setTimeLeft(REST_TIME);
  };

  const addEntry = () => {
    setEntries([...entries, { subject: '', minutes: 0 }]);
  };

  const updateEntry = (index: number, field: keyof Entry, value: string | number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const labelStyle = {
    textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000',
    color: 'white'
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-[#fffdfa] border-4 border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
        
        {/* Main Header */}
        <div className={`p-4 text-center border-b-4 border-black transition-colors ${mode === TimerMode.WORK ? 'bg-miffy-orange' : 'bg-miffy-green'}`}>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white" style={labelStyle}>
            {mode === TimerMode.WORK ? 'Work Session' : 'Rest Session'}
          </h1>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center">
          <MiffyBunny isWorking={mode === TimerMode.WORK} />

          <div className="text-6xl font-bold text-black tabular-nums bg-gray-100 px-6 py-3 rounded-3xl border-4 border-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            {formatTime(timeLeft)}
          </div>

          <div className="grid grid-cols-3 gap-4 w-full px-2">
            <button
              onClick={toggleTimer}
              className={`miffy-btn flex flex-col items-center justify-center gap-1 py-4 rounded-2xl shadow-md transition-all ${
                isActive ? 'bg-miffy-yellow' : 'bg-[#bae6fd]'
              }`}
            >
              <i className={`fas ${isActive ? 'fa-pause' : 'fa-play'} text-2xl text-black`}></i>
              <span className="text-sm font-black uppercase tracking-wider" style={labelStyle}>
                {isActive ? 'Pause' : 'Start'}
              </span>
            </button>
            
            <button
              onClick={resetTimer}
              className="miffy-btn flex flex-col items-center justify-center gap-1 py-4 bg-[#fee2e2] rounded-2xl shadow-md transition-all"
            >
              <i className="fas fa-redo text-2xl text-black"></i>
              <span className="text-sm font-black uppercase tracking-wider" style={labelStyle}>
                Reset
              </span>
            </button>
            
            <button
              onClick={skipMode}
              className="miffy-btn flex flex-col items-center justify-center gap-1 py-4 bg-[#dcfce7] rounded-2xl shadow-md transition-all"
            >
              <i className="fas fa-forward text-2xl text-black"></i>
              <span className="text-sm font-black uppercase tracking-wider" style={labelStyle}>
                Skip
              </span>
            </button>
          </div>

          <div className="w-full pt-4 border-t-4 border-black/10">
            <StatsBoard sessions={sessions} />
          </div>
        </div>
      </div>

      {/* Modal for subject logging */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#fffdfa] border-4 border-black rounded-[32px] w-full max-w-md p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
            
            <button 
              onClick={() => {
                setShowSubjectModal(false);
                setMode(TimerMode.REST);
                setTimeLeft(REST_TIME);
              }}
              className="absolute top-4 right-6 text-2xl font-black text-black hover:scale-125 transition-transform"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-black">Session Over! 🐰</h2>
            <p className="text-gray-700 mb-4 text-center font-bold">Log your subjects:</p>
            
            <form onSubmit={handleSubjectSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {entries.map((entry, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border-2 border-black/10">
                  <input
                    type="text"
                    value={entry.subject}
                    onChange={(e) => updateEntry(idx, 'subject', e.target.value)}
                    placeholder="Subject..."
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-black focus:bg-miffy-yellow/10 outline-none font-bold text-sm text-black"
                  />
                  <input
                    type="number"
                    value={entry.minutes}
                    onChange={(e) => updateEntry(idx, 'minutes', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-2 rounded-lg border-2 border-black text-center font-bold text-sm text-black"
                  />
                  <span className="text-xs font-bold text-black">min</span>
                </div>
              ))}

              <button
                type="button"
                onClick={addEntry}
                className="w-full py-2 border-2 border-dashed border-black rounded-xl font-black text-sm hover:bg-gray-100 text-black"
              >
                + Add Another
              </button>

              <div className="flex flex-wrap gap-2 justify-center py-2">
                {recentSubjects.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      const lastEntry = entries[entries.length - 1];
                      if (!lastEntry.subject) {
                        updateEntry(entries.length - 1, 'subject', sub);
                      } else {
                        setEntries([...entries, { subject: sub, minutes: 50 }]);
                      }
                    }}
                    className="px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black hover:bg-gray-50 active:translate-y-0.5 active:shadow-none"
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-miffy-orange rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                <span className="text-xl font-black uppercase tracking-widest" style={labelStyle}>
                  LOG & REST
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
