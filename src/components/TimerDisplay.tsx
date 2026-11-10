import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Eye, 
  Zap,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Stage, TimerStatus } from '../types/timer';
import { COLOR_CONFIGS } from '../constants/presets';
import { formatTime, formatTimeWithHours } from '../utils/formatters';

interface TimerDisplayProps {
  currentStage: Stage | undefined;
  currentStageIndex: number;
  totalStages: number;
  stageSecondsRemaining: number;
  totalSecondsElapsed: number;
  totalDurationSeconds: number;
  status: TimerStatus;
  nextStage?: Stage;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  isWakeLockActive: boolean;
  onTogglePlay: () => void;
  onNextStage: () => void;
  onPrevStage: () => void;
  onResetAll: () => void;
  onResetCurrentStage: () => void;
  onAdjustCurrentStage: (secondsDelta: number) => void;
  onToggleSound: () => void;
  onEnterFullscreen: () => void;
  onOpenSummary?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  currentStage,
  currentStageIndex,
  totalStages,
  stageSecondsRemaining,
  totalSecondsElapsed,
  totalDurationSeconds,
  status,
  nextStage,
  soundEnabled,
  voiceEnabled,
  isWakeLockActive,
  onTogglePlay,
  onNextStage,
  onPrevStage,
  onResetAll,
  onResetCurrentStage,
  onAdjustCurrentStage,
  onToggleSound,
  onEnterFullscreen,
  onOpenSummary,
}) => {
  if (!currentStage) return null;

  const colorConfig = COLOR_CONFIGS[currentStage.color] || COLOR_CONFIGS.emerald;
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Top Session Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2">
        <div 
          className="bg-emerald-500 h-2 transition-all duration-300"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Stage Header Info & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Tahap {currentStageIndex + 1} dari {totalStages}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${colorConfig.badgeBg} ${colorConfig.badgeText}`}>
              {Math.round(stageDuration / 60)} Menit
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Otomatis Bersambung</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isWakeLockActive && (
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Layar Aktif
              </span>
            )}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan Suara Pengingat' : 'Aktifkan Suara Pengingat'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Current Stage Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {currentStage.name}
          </h2>
          {nextStage && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <span>Selanjutnya:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{nextStage.name}</span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {Math.round(nextStage.durationSeconds / 60)}m
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
        </div>

        {/* Main Big Digital Clock */}
        <div className="relative flex flex-col items-center justify-center my-6 py-6 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-center">
            <div 
              className={`font-mono text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums transition-colors ${
                isCritical 
                  ? 'text-rose-600 dark:text-rose-500 animate-pulse' 
                  : isWarning 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatTime(stageSecondsRemaining)}
            </div>
            
            {/* Stage Progress Linear Bar */}
            <div className="w-64 md:w-96 mx-auto mt-4 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isCritical 
                    ? 'bg-rose-500' 
                    : isWarning 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${stageProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 w-64 md:w-96 mx-auto mt-2">
              <span>Berjalan {formatTime(stageDuration - stageSecondsRemaining)}</span>
              <span>Total {formatTime(stageDuration)}</span>
            </div>
          </div>

          {/* Quick Time Buffer Adjusters */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => onAdjustCurrentStage(-60)}
              disabled={stageSecondsRemaining <= 60}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> 1m
            </button>
            <button
              onClick={() => onAdjustCurrentStage(60)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 1m
            </button>
            <button
              onClick={() => onAdjustCurrentStage(180)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 3m
            </button>
            <button
              onClick={onResetCurrentStage}
              className="px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Tahap
            </button>
          </div>
        </div>

        {/* Global Summary Footprint */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800 mb-6 gap-2">
          <div className="flex items-center gap-4">
            <span>
              Total Berjalan: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatTimeWithHours(totalSecondsElapsed)}</strong>
            </span>
            <span>·</span>
            <span>
              Target Durasi UKIN: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatTimeWithHours(totalDurationSeconds)}</strong>
            </span>
          </div>
          <div>
            Progres Total: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{Math.round(totalProgress)}%</strong>
          </div>
        </div>

        {/* Primary Controls Deck */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <button
            onClick={onPrevStage}
            disabled={currentStageIndex === 0}
            title="Kembali ke Tahap Sebelumnya"
            className="p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2.5 cursor-pointer text-base ${
              status === 'running'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {status === 'running' ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Jeda (Spasi)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{status === 'paused' ? 'Lanjutkan (Spasi)' : 'Mulai Timer UKIN'}</span>
              </>
            )}
          </button>

          <button
            onClick={onNextStage}
            disabled={currentStageIndex >= totalStages - 1}
            title="Lanjut ke Tahap Berikutnya"
            className="p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={onResetAll}
            title="Reset Seluruh Tahapan dari Awal"
            className="p-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onEnterFullscreen}
            title="Buka Tampilan Layar Penuh Fokus Kamera"
            className="hidden sm:flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Fokus Kamera</span>
          </button>

          {onOpenSummary && (
            <button
              onClick={onOpenSummary}
              title="Ekspor Log Sesi & Hasil Rubrik UKIN"
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ekspor Log</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
