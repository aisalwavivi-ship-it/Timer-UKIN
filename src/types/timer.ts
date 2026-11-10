export type StageColor = 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo';

export interface Stage {
  id: string;
  name: string;
  durationSeconds: number; // in seconds
  color: StageColor;
  cues: string[]; // key checkpoints to remember during teaching
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: 'ukin' | 'rpp' | 'microteaching' | 'custom';
  stages: Stage[];
}

export interface AudioSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  volume: number; // 0.0 - 1.0
  speechRate: number; // 0.8 - 1.2
  warnAt2Min: boolean;
  warnAt1Min: boolean;
  warnAt30Sec: boolean;
  soundType: 'chime' | 'gong' | 'digital' | 'softbell';
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ActiveSessionState {
  currentStageIndex: number;
  stageSecondsRemaining: number;
  totalSecondsElapsed: number;
  status: TimerStatus;
  checkedCues: Record<string, boolean>; // cueId or text -> boolean
}

export interface StageExecutionLog {
  stageId: string;
  stageName: string;
  targetSeconds: number;
  actualSecondsSpent: number;
  completed: boolean;
  cuesTotal: number;
  cuesCompleted: string[];
  cuesMissed: string[];
}

export interface SessionSummaryReport {
  id: string;
  sessionTitle: string;
  teacherName: string;
  institution: string;
  subject: string;
  startedAt: string;
  completedAt: string;
  totalPlannedSeconds: number;
  totalActualSeconds: number;
  stageLogs: StageExecutionLog[];
  teacherNotes: string;
  overallCompletionRate: number;
}
