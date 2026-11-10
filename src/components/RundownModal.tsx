import React from 'react';
import { X, Printer, Clock, CheckCircle } from 'lucide-react';
import { Stage } from '../types/timer';
import { formatTime, formatMinutesLabel } from '../utils/formatters';
import { COLOR_CONFIGS } from '../constants/presets';

interface RundownModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
}

export const RundownModal: React.FC<RundownModalProps> = ({
  isOpen,
  onClose,
  stages,
}) => {
  if (!isOpen) return null;

  const totalSeconds = stages.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  let accumulatedSeconds = 0;
  const scheduleRows = stages.map((stage, idx) => {
    const startSec = accumulatedSeconds;
    const endSec = accumulatedSeconds + stage.durationSeconds;
    accumulatedSeconds = endSec;
    const percentage = Math.round((stage.durationSeconds / Math.max(1, totalSeconds)) * 100);
    return {
      index: idx + 1,
      stage,
      startFormatted: formatTime(startSec),
      endFormatted: formatTime(endSec),
      percentage,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Rundown Alokasi Waktu UKIN</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Jadwal pembagian waktu praktik mengajar & perekaman video ({totalMinutes} Menit Total)
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
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">No</th>
                  <th className="py-2.5 px-3 font-semibold">Tahap Kegiatan</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Durasi</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Rentang Waktu</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Porsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {scheduleRows.map((row) => {
                  const conf = COLOR_CONFIGS[row.stage.color] || COLOR_CONFIGS.emerald;
                  return (
                    <tr key={row.stage.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono font-medium text-slate-400">{row.index}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {row.stage.name}
                        </div>
                        {row.stage.cues.length > 0 && (
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                            {row.stage.cues.slice(0, 2).map((c, i) => (
                              <div key={i} className="flex items-center gap-1 truncate">
                                <span>·</span>
                                <span className="truncate">{c}</span>
                              </div>
                            ))}
                            {row.stage.cues.length > 2 && (
                              <div className="text-[10px] text-slate-400 italic">
                                +{row.stage.cues.length - 2} poin lainnya
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-semibold text-xs ${conf.badgeBg} ${conf.badgeText}`}>
                          {formatMinutesLabel(row.stage.durationSeconds)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                        {row.startFormatted} - {row.endFormatted}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {row.percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/60 font-semibold border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <td colSpan={2} className="py-2.5 px-3 text-right">Total Durasi Pembelajaran:</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                    {totalMinutes} Menit
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">00:00 - {formatTime(totalSeconds)}</td>
                  <td className="py-2.5 px-3 text-center font-mono">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Catatan Pengambilan Video UKIN:</strong> Pastikan video rekaman utuh (un-edited) mencakup seluruh tahap di atas secara bersambung. Alokasi 15 menit pendahuluan, 30 menit kegiatan inti, dan 15 menit penutup memberikan proporsi seimbang yang diakui dalam rubrik kelayakan UKIN.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Cetak PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
