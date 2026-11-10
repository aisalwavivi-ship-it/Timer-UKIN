import React from 'react';
import { X, HelpCircle, CheckCircle2, AlertTriangle, Video, Clock } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Panduan Take Video UKIN PPG & Microteaching</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tips praktis alokasi waktu dan tips rekaman video yang dinilai optimal
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Section 1: Alokasi Waktu Ideal */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Alokasi Waktu Ideal (Rekomendasi 60 Menit)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <div className="font-bold text-emerald-800 dark:text-emerald-300">Kegiatan Awal (15m)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Jangan terburu-buru! Penguji menilai kemampuan membuka kelas, salam doa, apersepsi kontekstual, motivasi, dan kejelasan tujuan.
                </div>
              </div>
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/40">
                <div className="font-bold text-blue-800 dark:text-blue-300">Kegiatan Inti (30m)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Fokus pada sintaks model pembelajaran (PBL/PjBL), LKPD, diskusi kelompok, keaktifan siswa, dan presentasi hasil karya.
                </div>
              </div>
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40">
                <div className="font-bold text-purple-800 dark:text-purple-300">Kegiatan Akhir (15m)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Sering terabaikan padahal bobot nilainya tinggi: kesimpulan bersama siswa, asesmen formatif, refleksi jujur, dan tindak lanjut.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Penempatan Timer saat Mengajar */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Cara Menempatkan Timer saat Perekaman</span>
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-600 dark:text-slate-400">
              <li>
                <strong>Posisi Layar:</strong> Taruh laptop/tablet tepat di bawah atau di samping lensa kamera rekaman dengan <em>Mode Layar Penuh (Fokus Kamera)</em>. Dengan cara ini, Anda bisa melihat sisa waktu tanpa terlihat melotot mencari jam.
              </li>
              <li>
                <strong>Jika Menayangkan Slide:</strong> Gunakan tombol <em>Timer Melayang (Picture-in-Picture)</em> agar angka timer tetap terlihat di sudut laptop saat Anda membuka PowerPoint atau Canva!
              </li>
              <li>
                <strong>Audio Pengingat:</strong> Aktifkan <em>Pengingat Suara Vokal</em> dengan volume sedang. Anda akan mendengar aba-aba suara saat tahap berganti secara otomatis.
              </li>
              <li>
                <strong>Kunci Layar Aktif (Wake Lock):</strong> Selalu biarkan fitur Wake Lock aktif agar layar Anda tidak terkunci otomatis setelah beberapa menit tidak disentuh.
              </li>
            </ul>
          </div>

          {/* Section 3: Checklist Rubrik Utama UKIN */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rubrik Wajib yang Dicari Asesor UKIN</span>
            </h4>
            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Penyampaian tujuan pembelajaran & kriteria penilaian di awal pembelajaran</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Interaksi aktif guru-siswa yang memicu pemikiran kritis (HOTS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Pemanfaatan media pembelajaran interaktif berbasis teknologi (TPACK)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Refleksi pembelajaran bersama peserta didik di akhir sesi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
