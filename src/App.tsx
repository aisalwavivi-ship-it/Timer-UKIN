import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TimerDisplay } from './components/TimerDisplay';
import { StageList } from './components/StageList';
import { StageChecklist } from './components/StageChecklist';
import { RundownModal } from './components/RundownModal';
import { PresetManagerModal } from './components/PresetManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { GuideModal } from './components/GuideModal';
import { FullscreenView } from './components/FullscreenView';
import { SessionSummaryModal } from './components/SessionSummaryModal';

import { Stage, Preset, AudioSettings, TimerStatus } from './types/timer';
import { DEFAULT_PRESETS, COLOR_CONFIGS } from './constants/presets';
import { 
  playChimeSound, 
  playWarningBeep, 
  playCompletionSound, 
  speakIndonesian 
} from './utils/audio';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from './utils/wakeLock';
import { isPipSupported, isPipActive, togglePictureInPicture, updatePipCanvas } from './utils/pip';
import { formatTime, calculateTotalDuration, calculateElapsedSeconds } from './utils/formatters';
import { CheckCircle2, Sparkles, BookOpen, Clock, AlertCircle, FileText } from 'lucide-react';

const STORAGE_KEY_PRESETS = 'ukin_timer_custom_presets';
const STORAGE_KEY_SETTINGS = 'ukin_timer_settings';
const STORAGE_KEY_STAGES = 'ukin_timer_current_stages';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Stages State (Initial: 15m Pendahuluan, 30m Inti, 15m Penutup as user requested)
  const [stages, setStages] = useState<Stage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_STAGES);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_PRESETS[0].stages;
  });

  // Custom Presets State
  const [customPresets, setCustomPresets] = useState<Preset[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_PRESETS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  // Audio Settings State
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      soundEnabled: true,
      voiceEnabled: true,
      volume: 0.8,
      speechRate: 1.0,
      warnAt2Min: true,
      warnAt1Min: true,
      warnAt30Sec: true,
      soundType: 'chime',
    };
  });

  // Session State
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stageSecondsRemaining, setStageSecondsRemaining] = useState<number>(() => {
    return stages[0]?.durationSeconds || 15 * 60;
  });
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [checkedCues, setCheckedCues] = useState<Record<string, boolean>>({});
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPipAvailable, setIsPipAvailable] = useState<boolean>(false);

  // Modal open states
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isRundownOpen, setIsRundownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(() => new Date());

  // Warning tracking to prevent duplicate beeps within the same second
  const warned2MinRef = useRef<boolean>(false);
  const warned1MinRef = useRef<boolean>(false);
  const warned30SecRef = useRef<boolean>(false);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check PiP support on mount
  useEffect(() => {
    setIsPipAvailable(isPipSupported());
  }, []);

  // Save stages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(stages));
  }, [stages]);

  // Save custom presets
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(customPresets));
  }, [customPresets]);

  // Save audio settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Current and Next stage objects
  const currentStage = stages[currentStageIndex];
  const nextStage = stages[currentStageIndex + 1];
  const totalDurationSeconds = calculateTotalDuration(stages);
  const totalSecondsElapsed = calculateElapsedSeconds(stages, currentStageIndex, stageSecondsRemaining);

  // Keep WakeLock synced with timer running state
  useEffect(() => {
    if (status === 'running') {
      requestWakeLock().then((active) => setIsWakeLockActive(active));
    } else if (status === 'idle' || status === 'completed') {
      releaseWakeLock();
      setIsWakeLockActive(false);
    }
  }, [status]);

  // Next Stage handler
  const advanceToNextStage = useCallback((autoChained: boolean = false) => {
    warned2MinRef.current = false;
    warned1MinRef.current = false;
    warned30SecRef.current = false;

    if (currentStageIndex < stages.length - 1) {
      const nextIdx = currentStageIndex + 1;
      const targetStage = stages[nextIdx];
      setCurrentStageIndex(nextIdx);
      setStageSecondsRemaining(targetStage.durationSeconds);

      // Play audio transition
      if (audioSettings.soundEnabled) {
        playChimeSound(audioSettings.soundType, audioSettings.volume);
      }

      // Indonesian Voice Announcement
      if (audioSettings.voiceEnabled) {
        const nextDurationMinutes = Math.round(targetStage.durationSeconds / 60);
        const announcement = autoChained
          ? `Tahap berikutnya: ${targetStage.name} dimulai. Durasi ${nextDurationMinutes} menit.`
          : `Beralih ke: ${targetStage.name}.`;
        speakIndonesian(announcement, audioSettings.speechRate, audioSettings.volume);
      }
    } else {
      // Completed all stages!
      setStatus('completed');
      if (audioSettings.soundEnabled) {
        playCompletionSound(audioSettings.volume);
      }
      if (audioSettings.voiceEnabled) {
        speakIndonesian(
          'Alhamdulillah, seluruh tahapan pembelajaran telah selesai. Sukses rekaman video UKIN!',
          audioSettings.speechRate,
          audioSettings.volume
        );
      }
    }
  }, [currentStageIndex, stages, audioSettings]);

  // Previous Stage handler
  const goToPrevStage = useCallback(() => {
    if (currentStageIndex > 0) {
      warned2MinRef.current = false;
      warned1MinRef.current = false;
      warned30SecRef.current = false;
      const prevIdx = currentStageIndex - 1;
      setCurrentStageIndex(prevIdx);
      setStageSecondsRemaining(stages[prevIdx].durationSeconds);
      if (audioSettings.soundEnabled) {
        playChimeSound(audioSettings.soundType, audioSettings.volume);
      }
    }
  }, [currentStageIndex, stages, audioSettings]);

  // Main Timer Interval Engine
  useEffect(() => {
    let interval: any = null;

    if (status === 'running') {
      interval = setInterval(() => {
        setStageSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Stage completed -> Auto-chain to next stage!
            advanceToNextStage(true);
            return 0;
          }

          const nextRemaining = prev - 1;

          // Warning Beep Checks
          if (audioSettings.soundEnabled) {
            if (audioSettings.warnAt2Min && nextRemaining === 120 && !warned2MinRef.current) {
              warned2MinRef.current = true;
              playWarningBeep(audioSettings.volume);
              if (audioSettings.voiceEnabled) {
                speakIndonesian('Waktu tersisa dua menit', audioSettings.speechRate, audioSettings.volume);
              }
            } else if (audioSettings.warnAt1Min && nextRemaining === 60 && !warned1MinRef.current) {
              warned1MinRef.current = true;
              playWarningBeep(audioSettings.volume);
              if (audioSettings.voiceEnabled) {
                speakIndonesian('Waktu tersisa satu menit', audioSettings.speechRate, audioSettings.volume);
              }
            } else if (audioSettings.warnAt30Sec && nextRemaining === 30 && !warned30SecRef.current) {
              warned30SecRef.current = true;
              playWarningBeep(audioSettings.volume);
            }
          }

          // Update PiP canvas if active
          if (isPipActive() && currentStage) {
            const conf = COLOR_CONFIGS[currentStage.color] || COLOR_CONFIGS.emerald;
            updatePipCanvas(
              currentStage.name,
              formatTime(nextRemaining),
              currentStageIndex,
              stages.length,
              formatTime(calculateElapsedSeconds(stages, currentStageIndex, nextRemaining)),
              conf.accent
            );
          }

          return nextRemaining;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, advanceToNextStage, audioSettings, currentStage, currentStageIndex, stages]);

  // Play / Pause toggle
  const handleTogglePlay = useCallback(() => {
    if (status === 'running') {
      setStatus('paused');
    } else {
      if (status === 'completed' || status === 'idle') {
        setSessionStartTime(new Date());
      }
      if (status === 'completed') {
        // restart from stage 0
        setCurrentStageIndex(0);
        setStageSecondsRemaining(stages[0]?.durationSeconds || 15 * 60);
      }
      setStatus('running');
      if (audioSettings.voiceEnabled && status === 'idle' && currentStage) {
        speakIndonesian(
          `Memulai ${currentStage.name}, durasi ${Math.round(currentStage.durationSeconds / 60)} menit.`,
          audioSettings.speechRate,
          audioSettings.volume
        );
      }
    }
  }, [status, stages, audioSettings, currentStage]);

  // Reset entire session
  const handleResetAll = useCallback(() => {
    setStatus('idle');
    setCurrentStageIndex(0);
    setStageSecondsRemaining(stages[0]?.durationSeconds || 15 * 60);
    warned2MinRef.current = false;
    warned1MinRef.current = false;
    warned30SecRef.current = false;
    setCheckedCues({});
  }, [stages]);

  // Reset current stage only
  const handleResetCurrentStage = useCallback(() => {
    if (currentStage) {
      setStageSecondsRemaining(currentStage.durationSeconds);
      warned2MinRef.current = false;
      warned1MinRef.current = false;
      warned30SecRef.current = false;
    }
  }, [currentStage]);

  // Quick adjust current stage on the fly
  const handleAdjustCurrentStage = useCallback((deltaSeconds: number) => {
    setStageSecondsRemaining((prev) => Math.max(10, prev + deltaSeconds));
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        advanceToNextStage(false);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        goToPrevStage();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.code === 'KeyR' && e.shiftKey) {
        e.preventDefault();
        handleResetAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, advanceToNextStage, goToPrevStage, handleResetAll]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // PiP toggle
  const handleTogglePip = async () => {
    if (!currentStage) return;
    const conf = COLOR_CONFIGS[currentStage.color] || COLOR_CONFIGS.emerald;
    await togglePictureInPicture(
      currentStage.name,
      formatTime(stageSecondsRemaining),
      currentStageIndex,
      stages.length,
      formatTime(totalSecondsElapsed),
      conf.accent
    );
  };

  // Cue toggler
  const handleToggleCue = (cueText: string) => {
    setCheckedCues((prev) => ({
      ...prev,
      [cueText]: !prev[cueText],
    }));
  };

  // Add custom cue to stage
  const handleAddCue = (stageId: string, cueText: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, cues: [...s.cues, cueText] } : s))
    );
  };

  // Remove cue from stage
  const handleRemoveCue = (stageId: string, cueIndex: number) => {
    setStages((prev) =>
      prev.map((s) =>
        s.id === stageId ? { ...s, cues: s.cues.filter((_, i) => i !== cueIndex) } : s
      )
    );
  };

  // Apply Preset
  const handleApplyPreset = (newStages: Stage[]) => {
    setStages(newStages);
    setCurrentStageIndex(0);
    setStageSecondsRemaining(newStages[0]?.durationSeconds || 15 * 60);
    setStatus('idle');
    setCheckedCues({});
    warned2MinRef.current = false;
    warned1MinRef.current = false;
    warned30SecRef.current = false;
  };

  // Save Custom Preset
  const handleSaveCustomPreset = (name: string, description: string) => {
    const newPreset: Preset = {
      id: `custom_${Date.now()}`,
      name,
      description,
      category: 'custom',
      stages: [...stages],
    };
    setCustomPresets((prev) => [...prev, newPreset]);
  };

  // Delete Custom Preset
  const handleDeleteCustomPreset = (id: string) => {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id));
  };

  // Import Presets
  const handleImportPresets = (imported: Preset[]) => {
    setCustomPresets((prev) => [...prev, ...imported]);
  };

  // Stage selection from list
  const handleSelectStage = (idx: number) => {
    setCurrentStageIndex(idx);
    setStageSecondsRemaining(stages[idx].durationSeconds);
    warned2MinRef.current = false;
    warned1MinRef.current = false;
    warned30SecRef.current = false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar */}
      <Header
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenRundown={() => setIsRundownOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onTogglePip={handleTogglePip}
        isPipAvailable={isPipAvailable}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Completed Victory Callout */}
        {status === 'completed' && (
          <div className="p-6 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Semua Tahapan Praktik Telah Selesai!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Total waktu berlangsung: {formatTime(totalSecondsElapsed)}. Video rekaman Anda telah tuntas memenuhi alokasi UKIN.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsSummaryOpen(true)}
                className="px-4 py-2.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Ekspor Log Sesi (PDF / Ringkasan)</span>
              </button>
              <button
                onClick={handleResetAll}
                className="px-3.5 py-2.5 text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                Ulangi dari Awal
              </button>
            </div>
          </div>
        )}

        {/* Top Split: Primary Timer Display (Anchor) */}
        <TimerDisplay
          currentStage={currentStage}
          currentStageIndex={currentStageIndex}
          totalStages={stages.length}
          stageSecondsRemaining={stageSecondsRemaining}
          totalSecondsElapsed={totalSecondsElapsed}
          totalDurationSeconds={totalDurationSeconds}
          status={status}
          nextStage={nextStage}
          soundEnabled={audioSettings.soundEnabled}
          voiceEnabled={audioSettings.voiceEnabled}
          isWakeLockActive={isWakeLockActive}
          onTogglePlay={handleTogglePlay}
          onNextStage={() => advanceToNextStage(false)}
          onPrevStage={goToPrevStage}
          onResetAll={handleResetAll}
          onResetCurrentStage={handleResetCurrentStage}
          onAdjustCurrentStage={handleAdjustCurrentStage}
          onToggleSound={() => setAudioSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          onEnterFullscreen={handleToggleFullscreen}
          onOpenSummary={() => setIsSummaryOpen(true)}
        />

        {/* 2-Column Section: Stage Sequence Builder & Checklist Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Stage Sequence & Minute Adjuster (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <StageList
              stages={stages}
              currentStageIndex={currentStageIndex}
              onUpdateStages={(newStages) => {
                setStages(newStages);
                // if active stage was affected, sync remaining seconds if idle
                if (status === 'idle' && newStages[currentStageIndex]) {
                  setStageSecondsRemaining(newStages[currentStageIndex].durationSeconds);
                }
              }}
              onSelectStage={handleSelectStage}
              isRunning={status === 'running'}
            />
          </div>

          {/* Right Column: Live Rubric Checklist for Active Stage (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <StageChecklist
              currentStage={currentStage}
              checkedCues={checkedCues}
              onToggleCue={handleToggleCue}
              onAddCue={handleAddCue}
              onRemoveCue={handleRemoveCue}
            />

            {/* Quick Tips card */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Tips Otomatisasi Nyambung:</span>
              </div>
              <p className="leading-relaxed">
                Saat waktu tahap aktif habis (00:00), timer akan otomatis berbunyi bel, bersuara vokal, dan langsung menyambung ke tahap berikutnya tanpa Anda harus menyentuh layar laptop.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>UKIN Timer Pro · Membantu Guru & Mahasiswa PPG Mengelola Waktu Praktik Pembelajaran</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSummaryOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ekspor Log Sesi</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Panduan Rubrik UKIN
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPresetsOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Template 60m / 50m / PBL
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SessionSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        stages={stages}
        currentStageIndex={currentStageIndex}
        stageSecondsRemaining={stageSecondsRemaining}
        totalSecondsElapsed={totalSecondsElapsed}
        checkedCues={checkedCues}
        sessionStartTime={sessionStartTime}
      />

      <RundownModal
        isOpen={isRundownOpen}
        onClose={() => setIsRundownOpen(false)}
        stages={stages}
      />

      <PresetManagerModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        currentStages={stages}
        onApplyPreset={handleApplyPreset}
        customPresets={customPresets}
        onSaveCustomPreset={handleSaveCustomPreset}
        onDeleteCustomPreset={handleDeleteCustomPreset}
        onImportPresets={handleImportPresets}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={audioSettings}
        onUpdateSettings={setAudioSettings}
        isWakeLockActive={isWakeLockActive}
        onToggleWakeLock={() => {
          if (isWakeLockActive) {
            releaseWakeLock();
            setIsWakeLockActive(false);
          } else {
            requestWakeLock().then((active) => setIsWakeLockActive(active));
          }
        }}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <FullscreenView
          currentStage={currentStage}
          currentStageIndex={currentStageIndex}
          totalStages={stages.length}
          stageSecondsRemaining={stageSecondsRemaining}
          totalSecondsElapsed={totalSecondsElapsed}
          totalDurationSeconds={totalDurationSeconds}
          status={status}
          nextStage={nextStage}
          soundEnabled={audioSettings.soundEnabled}
          checkedCues={checkedCues}
          onToggleCue={handleToggleCue}
          onTogglePlay={handleTogglePlay}
          onNextStage={() => advanceToNextStage(false)}
          onPrevStage={goToPrevStage}
          onAdjustCurrentStage={handleAdjustCurrentStage}
          onToggleSound={() => setAudioSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          onExitFullscreen={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
            setIsFullscreen(false);
          }}
        />
      )}
    </div>
  );
}
