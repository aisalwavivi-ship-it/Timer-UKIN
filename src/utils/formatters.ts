import { Stage } from '../types/timer';

export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeWithHours(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutesLabel(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} Menit`;
}

export function calculateTotalDuration(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + stage.durationSeconds, 0);
}

export function calculateElapsedSeconds(
  stages: Stage[],
  currentIndex: number,
  currentRemaining: number
): number {
  if (currentIndex < 0 || currentIndex >= stages.length) return 0;
  
  // Previous stages completed duration
  let elapsed = 0;
  for (let i = 0; i < currentIndex; i++) {
    elapsed += stages[i].durationSeconds;
  }
  
  // Current stage elapsed
  const currentStageDuration = stages[currentIndex]?.durationSeconds || 0;
  const currentStageElapsed = Math.max(0, currentStageDuration - currentRemaining);
  
  return elapsed + currentStageElapsed;
}
