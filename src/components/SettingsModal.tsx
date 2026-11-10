import React from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  Mic, 
  Bell, 
  Sun, 
  Play, 
  Keyboard, 
  Smartphone,
  Check
} from 'lucide-react';
import { AudioSettings } from '../types/timer';
import { playChimeSound, speakIndonesian } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioSettings;
  onUpdateSettings: (newSettings: AudioSettings) => void;
  isWakeLockActive: boolean;
  onToggleWakeLock: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isWakeLockActive,
  onToggleWakeLock,
}) => {
  if (!isOpen) return null;

  const handleTestSound = () => {
    playChimeSound(settings.soundType, settings.volume);
  };

  const handleTestVoice = () => {
    speakIndonesian('Perhatian, waktu kegiatan inti tersisa 2 menit.', settings.speechRate, settings.volume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Pengaturan Suara & Sesi UKIN</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sesuaikan nada transisi, pengingat suara vokal, dan kontrol sesi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Audio Chime Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Bunyi Bel / Nada Transisi</span>
              </label>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {settings.soundEnabled && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  {(['chime', 'gong', 'softbell', 'digital'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, soundType: type })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer capitalize flex items-center justify-between ${
                        settings.soundType === type
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>
                        {type === 'chime' ? 'Kristal Lembut' :
                         type === 'gong' ? 'Gong Menggema' :
                         type === 'softbell' ? 'Bel Sekolah' : 'Digital Ringkas'}
                      </span>
                      {settings.soundType === type && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Volume Suara</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={settings.volume}
                      onChange={(e) => onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })}
                      className="w-24 accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500 w-8 text-right">
                      {Math.round(settings.volume * 100)}%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestSound}
                  className="w-full py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Uji Coba Nada Ini</span>
                </button>
              </div>
            )}
          </div>

          {/* Indonesian Voice Alerts */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span>Pengingat Suara Vokal (Bahasa Indonesia)</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aba-aba otomatis saat pergantian tahap dan waktu tersisa
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, voiceEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {settings.voiceEnabled && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Kecepatan Bicara</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.8"
                      max="1.2"
                      step="0.05"
                      value={settings.speechRate}
                      onChange={(e) => onUpdateSettings({ ...settings, speechRate: parseFloat(e.target.value) })}
                      className="w-24 accent-emerald-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-500 w-8 text-right">
                      {settings.speechRate.toFixed(1)}x
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="w-full py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Uji Coba Suara Vokal</span>
                </button>
              </div>
            )}
          </div>

          {/* Warning Beeps */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Peringatan Menjelang Akhir Tahap</span>
            </label>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pl-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.warnAt2Min}
                  onChange={(e) => onUpdateSettings({ ...settings, warnAt2Min: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>Peringatan 2 Menit sebelum tahap berakhir</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.warnAt1Min}
                  onChange={(e) => onUpdateSettings({ ...settings, warnAt1Min: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>Peringatan 1 Menit sebelum tahap berakhir</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.warnAt30Sec}
                  onChange={(e) => onUpdateSettings({ ...settings, warnAt30Sec: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>Peringatan 30 Detik (Hitung Mundur Kritis)</span>
              </label>
            </div>
          </div>

          {/* Screen Wake Lock */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Kunci Layar Tetap Aktif (Wake Lock)</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mencegah layar HP/laptop mati sendiri selama proses perekaman UKIN
                </p>
              </div>
              <input
                type="checkbox"
                checked={isWakeLockActive}
                onChange={onToggleWakeLock}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Pintasan Keyboard Cepat:</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">Spasi</kbd> : Mulai / Jeda</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">→</kbd> : Tahap Berikutnya</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">←</kbd> : Tahap Sebelumnya</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">F</kbd> : Layar Penuh</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
