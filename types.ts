
export enum TimerMode {
  WORK = 'WORK',
  REST = 'REST'
}

export interface Session {
  id: string;
  subject: string;
  durationMinutes: number;
  timestamp: number;
}

export interface SubjectStats {
  subject: string;
  totalMinutes: number;
}
