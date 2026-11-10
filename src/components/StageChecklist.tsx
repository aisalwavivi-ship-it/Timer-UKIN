import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Stage } from '../types/timer';

interface StageChecklistProps {
  currentStage: Stage | undefined;
  checkedCues: Record<string, boolean>;
  onToggleCue: (cueText: string) => void;
  onAddCue: (stageId: string, cueText: string) => void;
  onRemoveCue: (stageId: string, cueIndex: number) => void;
}

export const StageChecklist: React.FC<StageChecklistProps> = ({
  currentStage,
  checkedCues,
  onToggleCue,
  onAddCue,
  onRemoveCue,
}) => {
  const [newCue, setNewCue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!currentStage) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCue.trim()) return;
    onAddCue(currentStage.id, newCue.trim());
    setNewCue('');
    setIsAdding(false);
  };

  const totalCues = currentStage.cues.length;
  const completedCount = currentStage.cues.filter((c) => checkedCues[c]).length;
  const allCompleted = totalCues > 0 && completedCount === totalCues;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Rubrik & Poin Panduan {currentStage.name}</span>
            </h3>
            {allCompleted && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lengkap
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centang pengingat sintaks/rubrik UKIN ini saat Anda melaksanakannya di depan kamera.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {completedCount} / {totalCues}
          </span>
          <div className="text-[10px] text-slate-400">Terselesaikan</div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 mt-4">
        {currentStage.cues.map((cue, idx) => {
          const isChecked = Boolean(checkedCues[cue]);
          return (
            <div
              key={`${currentStage.id}_cue_${idx}`}
              onClick={() => onToggleCue(cue)}
              className={`p-3 rounded-xl border text-sm flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                isChecked
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-500 dark:text-slate-400 line-through'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="pt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <span className="leading-snug">{cue}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCue(currentStage.id, idx);
                }}
                title="Hapus Catatan"
                className="opacity-40 hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 shrink-0 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {totalCues === 0 && (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            Belum ada poin panduan untuk tahap ini. Klik tombol di bawah untuk menambahkan poin RPP Anda.
          </div>
        )}
      </div>

      {/* Add Custom Cue */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newCue}
            onChange={(e) => setNewCue(e.target.value)}
            placeholder="Tambah catatan/sintaks khusus (misal: LKPD 2, Ice Breaking)"
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            Batal
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Catatan Khusus Tahap Ini</span>
        </button>
      )}
    </div>
  );
};
