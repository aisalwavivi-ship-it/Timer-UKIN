import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Check, 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Preset, Stage } from '../types/timer';
import { DEFAULT_PRESETS } from '../constants/presets';

interface PresetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStages: Stage[];
  onApplyPreset: (stages: Stage[]) => void;
  customPresets: Preset[];
  onSaveCustomPreset: (name: string, description: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  onImportPresets: (imported: Preset[]) => void;
}

export const PresetManagerModal: React.FC<PresetManagerModalProps> = ({
  isOpen,
  onClose,
  currentStages,
  onApplyPreset,
  customPresets,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onImportPresets,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ukin' | 'rpp' | 'custom'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');

  if (!isOpen) return null;

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  const filteredPresets = allPresets.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'custom') return p.category === 'custom';
    return p.category === activeTab;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSaveCustomPreset(saveName.trim(), saveDesc.trim() || 'Susunan timer kustom pengguna');
    setSaveName('');
    setSaveDesc('');
    setIsSaving(false);
    setActiveTab('custom');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allPresets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `preset_ukin_timer_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const [importError, setImportError] = useState<string | null>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportPresets(json);
        } else {
          setImportError('Format berkas preset tidak sesuai format JSON yang valid.');
        }
      } catch (err) {
        setImportError('Gagal membaca berkas JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Preset Template UKIN & RPP</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih template acuan baku atau simpan susunan Anda sendiri
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header / Filter Tabs & Actions */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Semua ({allPresets.length})
            </button>
            <button
              onClick={() => setActiveTab('ukin')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'ukin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Standar UKIN
            </button>
            <button
              onClick={() => setActiveTab('rpp')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'rpp'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sintaks PBL & PjBL
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kustom Saya ({customPresets.length})
            </button>
          </div>

          <button
            onClick={() => setIsSaving(true)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Susunan Ini</span>
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {importError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
              <span>{importError}</span>
              <button
                onClick={() => setImportError(null)}
                className="text-rose-500 hover:text-rose-700 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Save Preset Form */}
          {isSaving && (
            <form onSubmit={handleSave} className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-3">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Simpan Susunan Timer Aktif sebagai Preset Baru
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Nama Preset (misal: RPP Siklus 2 Praktik Mengajar)"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                  required
                />
                <input
                  type="text"
                  value={saveDesc}
                  onChange={(e) => setSaveDesc(e.target.value)}
                  placeholder="Keterangan singkat (misal: Alokasi 10m awal, 35m inti, 15m akhir)"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Preset
                </button>
              </div>
            </form>
          )}

          {filteredPresets.map((preset) => {
            const totalMins = Math.round(
              preset.stages.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
            );

            return (
              <div
                key={preset.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-800/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                      {totalMins} Menit
                    </span>
                    {preset.category === 'custom' && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Kustom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>

                  {/* Stage sequence preview */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {preset.stages.map((st, i) => (
                      <span
                        key={st.id || i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                      >
                        <span className="font-semibold">{i + 1}.</span>
                        <span>{st.name}</span>
                        <span className="text-slate-400 font-mono">({Math.round(st.durationSeconds / 60)}m)</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  {preset.category === 'custom' && (
                    <button
                      onClick={() => onDeleteCustomPreset(preset.id)}
                      title="Hapus Preset Kustom"
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onApplyPreset(preset.stages);
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terapkan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Import / Export */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              title="Ekspor daftar preset ke JSON"
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>

            <label className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Impor JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
