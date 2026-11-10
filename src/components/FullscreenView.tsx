import React, { useState, useEffect } from 'react';
import { 
  Minimize2, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  CheckSquare, 
  Square,
  ArrowRight
} from 'lucide-react';
import { Stage, TimerStatus } from '../types/timer';
import { COLOR_CONFIGS } from '../constants/presets';
import { formatTime, formatTimeWithHours } from '../utils/formatters';

interface FullscreenViewProps {
  currentStage: Stage | undefined;
  currentStageIndex: number;
  totalStages: number;
  stageSecondsRemaining: number;
  totalSecondsElapsed: number;
  totalDurationSeconds: number;
  status: TimerStatus;
  nextStage?: Stage;
  soundEnabled: boolean;
  checkedCues: Record<string, boolean>;
  onToggleCue: (cueText: string) => void;
  onTogglePlay: () => void;
  onNextStage: () => void;
  onPrevStage: () => void;
  onAdjustCurrentStage: (secondsDelta: number) => void;
  onToggleSound: () => void;
  onExitFullscreen: () => void;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({
  currentStage,
  currentStageIndex,
  totalStages,
  stageSecondsRemaining,
  totalSecondsElapsed,
  totalDurationSeconds,
  status,
  nextStage,
  soundEnabled,
  checkedCues,
  onToggleCue,
  onTogglePlay,
  onNextStage,
  onPrevStage,
  onAdjustCurrentStage,
  onToggleSound,
  onExitFullscreen,
}) => {
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls when mouse idle in fullscreen
  useEffect(() => {
    let timeout: any;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (status === 'running') {
          setShowControls(false);
        }
      }, 4000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [status]);

  if (!currentStage) return null;

  const stageDuration = currentStage.durationSeconds;
  const stageProgress = Math.min(
    100,
    Math.max(0, ((stageDuration - stageSecondsRemaining) / Math.max(1, stageDuration)) * 100)
  );

  const totalProgress = Math.min(
    100,
    Math.max(0, (totalSecondsElapsed / Math.max(1, totalDurationSeconds)) * 100)
  );

  const isWarning = stageSecondsRemaining <= 120 && stageSecondsRemaining > 0 && status === 'running';
  const isCritical = stageSecondsRemaining <= 30 && stageSecondsRemaining > 0 && status === 'running';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className={`flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-20 hover:opacity-100'}`}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
            TAHAP {currentStageIndex + 1} / {totalStages}
          </span>
          <span className="text-sm font-mono text-emerald-400 font-semibold">
            {Math.round(stageDuration / 60)} Menit
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={onExitFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Keluar Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* Center Giant Stage Name & Clock */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 text-center max-w-4xl mx-auto w-full">
        {/* Stage Name */}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
          {currentStage.name}
        </h1>

        {nextStage && (
          <div className="flex items-center justify-center gap-2 text-sm md:text-base text-slate-400 mb-6">
            <span>Selanjutnya:</span>
            <span className="text-slate-200 font-medium">{nextStage.name}</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {Math.round(nextStage.durationSeconds / 60)}m
            </span>
          </div>
        )}

        {/* The Massive Digital Clock */}
        <div 
          className={`font-mono text-7xl md:text-9xl lg:text-[13rem] font-bold tabular-nums tracking-tighter leading-none my-2 transition-colors ${
            isCritical
              ? 'text-rose-500 animate-pulse'
              : isWarning
              ? 'text-amber-400'
              : 'text-white'
          }`}
        >
          {formatTime(stageSecondsRemaining)}
        </div>

        {/* Stage Progress Bar */}
        <div className="w-full max-w-2xl bg-slate-800/80 h-3.5 rounded-full overflow-hidden mt-6 border border-slate-700/50">
          <div 
            className={`h-full transition-all duration-300 ${
              isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${stageProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs md:text-sm text-slate-400 w-full max-w-2xl mt-2 font-mono">
          <span>Berjalan: {formatTime(stageDuration - stageSecondsRemaining)}</span>
          <span>Sisa: {formatTime(stageSecondsRemaining)}</span>
          <span>Target: {formatTime(stageDuration)}</span>
        </div>

        {/* Quick cues reminder preview */}
        {currentStage.cues.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {currentStage.cues.map((cue, idx) => {
              const isChecked = Boolean(checkedCues[cue]);
              return (
                <button
                  key={idx}
                  onClick={() => onToggleCue(cue)}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-slate-900/60 text-slate-500 line-through border border-slate-800'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate max-w-xs">{cue}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className={`transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 max-w-xl mx-auto flex flex-col items-center gap-3 backdrop-blur-md shadow-2xl">
          {/* Global Progress Line */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span>
              Total Berjalan: <strong className="text-white font-mono">{formatTimeWithHours(totalSecondsElapsed)}</strong> / {formatTimeWithHours(totalDurationSeconds)}
            </span>
            <span className="font-mono text-emerald-400 font-semibold">{Math.round(totalProgress)}%</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${totalProgress}%` }} />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onAdjustCurrentStage(-60)}
              disabled={stageSecondsRemaining <= 60}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> 1m
            </button>

            <button
              onClick={onPrevStage}
              disabled={currentStageIndex === 0}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 cursor-pointer ${
                status === 'running'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {status === 'running' ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{status === 'paused' ? 'Lanjutkan' : 'Mulai Timer'}</span>
                </>
              )}
            </button>

            <button
              onClick={onNextStage}
              disabled={currentStageIndex >= totalStages - 1}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={() => onAdjustCurrentStage(60)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 1m
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
