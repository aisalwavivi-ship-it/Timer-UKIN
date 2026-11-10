import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Check, 
  X,
  Copy
} from 'lucide-react';
import { Stage, StageColor } from '../types/timer';
import { COLOR_CONFIGS } from '../constants/presets';
import { formatMinutesLabel } from '../utils/formatters';

interface StageListProps {
  stages: Stage[];
  currentStageIndex: number;
  onUpdateStages: (newStages: Stage[]) => void;
  onSelectStage: (index: number) => void;
  isRunning: boolean;
}

const AVAILABLE_COLORS: StageColor[] = ['emerald', 'blue', 'purple', 'amber', 'rose', 'cyan', 'indigo'];

export const StageList: React.FC<StageListProps> = ({
  stages,
  currentStageIndex,
  onUpdateStages,
  onSelectStage,
  isRunning,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMinutes, setEditMinutes] = useState(10);
  const [editColor, setEditColor] = useState<StageColor>('emerald');

  const startEdit = (stage: Stage) => {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditMinutes(Math.round(stage.durationSeconds / 60));
    setEditColor(stage.color);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = stages.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          name: editName.trim(),
          durationSeconds: Math.max(1, editMinutes) * 60,
          color: editColor,
        };
      }
      return s;
    });
    onUpdateStages(updated);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleAddStage = () => {
    const newId = `stage_${Date.now()}`;
    const nextNumber = stages.length + 1;
    const defaultColor = AVAILABLE_COLORS[(stages.length) % AVAILABLE_COLORS.length];
    const newStage: Stage = {
      id: newId,
      name: `Tahap ${nextNumber}: Kegiatan Lanjutan`,
      durationSeconds: 15 * 60, // default 15 menit
      color: defaultColor,
      cues: ['Catatan kegiatan pembelajaran...'],
    };
    onUpdateStages([...stages, newStage]);
    startEdit(newStage);
  };

  const handleDeleteStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (stages.length <= 1) {
      alert('Minimal harus memiliki 1 tahap timer.');
      return;
    }
    const updated = stages.filter((s) => s.id !== id);
    onUpdateStages(updated);
  };

  const handleDuplicateStage = (stage: Stage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStage: Stage = {
      ...stage,
      id: `stage_${Date.now()}`,
      name: `${stage.name} (Salinan)`,
    };
    onUpdateStages([...stages, newStage]);
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const copy = [...stages];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onUpdateStages(copy);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === stages.length - 1) return;
    const copy = [...stages];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onUpdateStages(copy);
  };

  const handleQuickDuration = (stageId: string, deltaMinutes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = stages.map((s) => {
      if (s.id === stageId) {
        const currentMins = Math.round(s.durationSeconds / 60);
        const newMins = Math.max(1, currentMins + deltaMinutes);
        return {
          ...s,
          durationSeconds: newMins * 60,
        };
      }
      return s;
    });
    onUpdateStages(updated);
  };

  const totalMinutes = Math.round(
    stages.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Susunan Tahapan Timer UKIN</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({stages.length} Tahap · Total {totalMinutes} Menit)
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Timer berjalan otomatis berurutan dari tahap 1 ke tahap berikutnya.
          </p>
        </div>

        <button
          onClick={handleAddStage}
          className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tahap</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {stages.map((stage, idx) => {
          const isActive = idx === currentStageIndex;
          const isPast = idx < currentStageIndex;
          const colorConf = COLOR_CONFIGS[stage.color] || COLOR_CONFIGS.emerald;
          const isEditing = editingId === stage.id;

          if (isEditing) {
            return (
              <div
                key={stage.id}
                className="p-4 rounded-xl border border-emerald-400 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3"
              >
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Edit Tahap {idx + 1}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      Nama Kegiatan / Sintaks
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Contoh: Kegiatan Awal (15 Menit)"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                        Durasi (Menit)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(parseInt(e.target.value, 10) || 1)}
                        className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                        Warna Penanda
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {AVAILABLE_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                              c === 'emerald' ? 'bg-emerald-500' :
                              c === 'blue' ? 'bg-blue-500' :
                              c === 'purple' ? 'bg-purple-500' :
                              c === 'amber' ? 'bg-amber-500' :
                              c === 'rose' ? 'bg-rose-500' :
                              c === 'cyan' ? 'bg-cyan-500' : 'bg-indigo-500'
                            } ${editColor === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => saveEdit(stage.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/50 shadow-sm'
                  : isPast
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-70 hover:opacity-90'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {isPast ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 dark:border-emerald-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {idx + 1}.
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {stage.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded font-mono font-medium ${colorConf.badgeBg} ${colorConf.badgeText}`}>
                      {formatMinutesLabel(stage.durationSeconds)}
                    </span>
                    <span>·</span>
                    <span>{stage.cues.length} Poin Panduan</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Quick Minute Bumpers */}
                <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={(e) => handleQuickDuration(stage.id, -1, e)}
                    disabled={stage.durationSeconds <= 60}
                    title="Kurangi 1 Menit"
                    className="px-1.5 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs disabled:opacity-30 cursor-pointer"
                  >
                    -1m
                  </button>
                  <span className="px-1 text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {Math.round(stage.durationSeconds / 60)}m
                  </span>
                  <button
                    onClick={(e) => handleQuickDuration(stage.id, 1, e)}
                    title="Tambah 1 Menit"
                    className="px-1.5 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs cursor-pointer"
                  >
                    +1m
                  </button>
                </div>

                {/* Reorder Buttons */}
                <button
                  onClick={(e) => handleMoveUp(idx, e)}
                  disabled={idx === 0}
                  title="Pindah ke Atas"
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleMoveDown(idx, e)}
                  disabled={idx === stages.length - 1}
                  title="Pindah ke Bawah"
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => startEdit(stage)}
                  title="Ubah Nama & Durasi"
                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Duplicate Button */}
                <button
                  onClick={(e) => handleDuplicateStage(stage, e)}
                  title="Duplikat Tahap"
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteStage(stage.id, e)}
                  title="Hapus Tahap"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
