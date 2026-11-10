import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  User, 
  Building, 
  BookOpen, 
  Edit3, 
  Sparkles,
  Clock
} from 'lucide-react';
import { SessionSummaryReport, Stage } from '../types/timer';
import { 
  buildSessionReport, 
  formatReportAsMarkdown, 
  downloadFile 
} from '../utils/exportReport';
import { formatTime, formatTimeWithHours } from '../utils/formatters';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
  currentStageIndex: number;
  stageSecondsRemaining: number;
  totalSecondsElapsed: number;
  checkedCues: Record<string, boolean>;
  sessionStartTime: Date;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  stages,
  currentStageIndex,
  stageSecondsRemaining,
  totalSecondsElapsed,
  checkedCues,
  sessionStartTime,
}) => {
  const [teacherName, setTeacherName] = useState('Mahasiswa PPG / Guru Praktikan');
  const [institution, setInstitution] = useState('LPTK / Sekolah Tempat Praktik');
  const [subject, setSubject] = useState('Praktik Pembelajaran UKIN');
  const [teacherNotes, setTeacherNotes] = useState(
    'Alhamdulillah pembelajaran berjalan lancar. Seluruh sintaks dan alokasi waktu dapat dikelola dengan tertib dan interaksi siswa aktif.'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const report: SessionSummaryReport = buildSessionReport({
    stages,
    currentStageIndex,
    stageSecondsRemaining,
    totalSecondsElapsed,
    checkedCues,
    teacherName,
    institution,
    subject,
    teacherNotes,
    sessionStartedAt: sessionStartTime,
    sessionCompletedAt: new Date(),
  });

  const markdownContent = formatReportAsMarkdown(report);

  const handleDownloadMarkdown = () => {
    const filename = `Laporan_UKIN_${report.teacherName.replace(/\s+/g, '_')}_${Date.now()}.md`;
    downloadFile(filename, markdownContent, 'text/markdown;charset=utf-8');
  };

  const handleDownloadJson = () => {
    const filename = `Data_Log_UKIN_${Date.now()}.json`;
    downloadFile(filename, JSON.stringify(report, null, 2), 'application/json;charset=utf-8');
  };

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const totalPlannedMins = Math.round(report.totalPlannedSeconds / 60);
  const totalActualMins = Math.round(report.totalActualSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ekspor Log Sesi & Hasil Rubrik UKIN
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ringkasan alokasi waktu dan keterlaksanaan indikator pembelajaran siap unduh atau cetak PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Metadata Inputs (Customizable for Report Header) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Identitas Pelaksanaan (Akan tercetak di Dokumen Laporan)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Nama Mahasiswa / Guru
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Instansi / Sekolah
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Mata Pelajaran / Tema
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Durasi Pembelajaran</div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {formatTimeWithHours(report.totalActualSeconds)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target: {formatTimeWithHours(report.totalPlannedSeconds)} ({totalPlannedMins}m)
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Keterlaksanaan Rubrik</div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {report.overallCompletionRate}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {stages.reduce((acc, s) => acc + s.cues.filter((c) => checkedCues[c]).length, 0)} dari {stages.reduce((acc, s) => acc + s.cues.length, 0)} indikator tercapai
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Status Sesi</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Terlaksana</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {report.completedAt}
              </div>
            </div>
          </div>

          {/* Section: Stage-by-Stage Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rincian Waktu & Keterlaksanaan per Tahap</span>
            </h4>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 font-semibold">Tahap Kegiatan</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Target</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Realisasi</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Selisih</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Rubrik Terlaksana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {report.stageLogs.map((log, idx) => {
                    const diff = log.actualSecondsSpent - log.targetSeconds;
                    let diffDisplay = 'Tepat Waktu';
                    let diffClass = 'text-slate-500';

                    if (diff > 10) {
                      diffDisplay = `+${formatTime(diff)}`;
                      diffClass = 'text-amber-600 dark:text-amber-400 font-semibold';
                    } else if (diff < -10) {
                      diffDisplay = `-${formatTime(Math.abs(diff))}`;
                      diffClass = 'text-blue-600 dark:text-blue-400 font-semibold';
                    }

                    return (
                      <tr key={log.stageId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {idx + 1}. {log.stageName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {formatTime(log.targetSeconds)}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          {formatTime(log.actualSecondsSpent)}
                        </td>
                        <td className={`py-3 px-3 text-center font-mono text-[11px] ${diffClass}`}>
                          {diffDisplay}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {log.cuesCompleted.length} / {log.cuesTotal}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Checklist Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daftar Indikator & Sintaks yang Dijalankan</span>
            </h4>

            <div className="space-y-3">
              {report.stageLogs.map((log, idx) => (
                <div 
                  key={log.stageId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{idx + 1}. {log.stageName}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {log.cuesCompleted.length}/{log.cuesTotal} Indikator Terlaksana
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {log.cuesCompleted.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                    {log.cuesMissed.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500 line-through">
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                        <span>{c} (Belum terlaksana)</span>
                      </div>
                    ))}
                    {log.cuesTotal === 0 && (
                      <div className="text-slate-400 text-xs italic">
                        Tidak ada rubrik catatan khusus.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Reflection Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Catatan Refleksi Diri Guru / Observer:
            </label>
            <textarea
              rows={3}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="Tuliskan refleksi singkat kendala, keberhasilan, atau catatan dari guru pamong..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer with All Export Options */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 gap-2">
          {/* Quick Copy & Raw JSON */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks Ringkasan</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJson}
              title="Unduh data mentah log JSON"
              className="px-2.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              JSON
            </button>
          </div>

          {/* Primary Export Actions: Markdown File & Print PDF */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas (.md / .txt)</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Container specifically targeted for window.print() */}
      <div id="printable-session-report" className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8 print:text-black">
        <div className="text-center pb-4 border-b-2 border-black">
          <h2 className="text-lg font-bold uppercase tracking-wider">
            LEMBAR CATATAN PELAKSANAAN PRAKTIK PEMBELAJARAN
          </h2>
          <h3 className="text-sm font-semibold uppercase">
            UJI KINERJA (UKIN) PPG / MICROTEACHING
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Dicatat melalui Sistem UKIN Timer Pro pada {report.completedAt}
          </p>
        </div>

        {/* Metadata Table */}
        <div className="my-4 text-xs">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-40 font-semibold py-1">Nama Mahasiswa / Guru</td>
                <td className="py-1">: <strong>{report.teacherName}</strong></td>
                <td className="w-36 font-semibold py-1">Target Total Waktu</td>
                <td className="py-1">: {formatTimeWithHours(report.totalPlannedSeconds)} ({totalPlannedMins}m)</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Instansi / LPTK / Sekolah</td>
                <td className="py-1">: {report.institution}</td>
                <td className="font-semibold py-1">Realisasi Durasi Video</td>
                <td className="py-1">: <strong>{formatTimeWithHours(report.totalActualSeconds)}</strong></td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Mata Pelajaran / Tema</td>
                <td className="py-1">: {report.subject}</td>
                <td className="font-semibold py-1">Keterlaksanaan Rubrik</td>
                <td className="py-1">: <strong>{report.overallCompletionRate}%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Time Allocation Table */}
        <div className="my-4">
          <h4 className="text-xs font-bold uppercase mb-2">1. Rincian Alokasi Waktu per Tahapan</h4>
          <table className="w-full text-xs border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="border border-gray-400 p-2 text-left">No</th>
                <th className="border border-gray-400 p-2 text-left">Tahap Pembelajaran</th>
                <th className="border border-gray-400 p-2 text-center">Target Waktu</th>
                <th className="border border-gray-400 p-2 text-center">Waktu Realisasi</th>
                <th className="border border-gray-400 p-2 text-center">Status Waktu</th>
                <th className="border border-gray-400 p-2 text-center">Poin Terlaksana</th>
              </tr>
            </thead>
            <tbody>
              {report.stageLogs.map((log, i) => {
                const diff = log.actualSecondsSpent - log.targetSeconds;
                let diffText = 'Tepat Waktu';
                if (diff > 10) diffText = `+${formatTime(diff)}`;
                else if (diff < -10) diffText = `-${formatTime(Math.abs(diff))}`;

                return (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                    <td className="border border-gray-400 p-2 font-semibold">{log.stageName}</td>
                    <td className="border border-gray-400 p-2 text-center">{formatTime(log.targetSeconds)}</td>
                    <td className="border border-gray-400 p-2 text-center font-bold">{formatTime(log.actualSecondsSpent)}</td>
                    <td className="border border-gray-400 p-2 text-center">{diffText}</td>
                    <td className="border border-gray-400 p-2 text-center">{log.cuesCompleted.length} / {log.cuesTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Checklist Rubric Execution */}
        <div className="my-4 text-xs">
          <h4 className="text-xs font-bold uppercase mb-2">2. Checklist Keterlaksanaan Sintaks & Rubrik</h4>
          <div className="space-y-3">
            {report.stageLogs.map((log, i) => (
              <div key={i} className="border border-gray-300 p-2.5 rounded">
                <div className="font-bold mb-1">
                  {i + 1}. {log.stageName} ({formatTime(log.actualSecondsSpent)} / {formatTime(log.targetSeconds)})
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {log.cuesCompleted.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span>[✓]</span>
                      <span>{c}</span>
                    </div>
                  ))}
                  {log.cuesMissed.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-gray-500">
                      <span>[ ]</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Notes */}
        {report.teacherNotes.trim() && (
          <div className="my-3 text-xs">
            <h4 className="text-xs font-bold uppercase mb-1">3. Catatan Refleksi Mandiri</h4>
            <p className="p-2 border border-gray-300 rounded text-gray-800 italic">
              "{report.teacherNotes.trim()}"
            </p>
          </div>
        )}

        {/* Signatures */}
        <div className="mt-8 pt-4 text-xs">
          <div className="flex justify-between text-center">
            <div className="w-56">
              <p>Mengetahui,</p>
              <p>Guru Pamong / Dosen Pembimbing</p>
              <div className="h-16" />
              <p className="font-bold border-b border-black pb-1">( _______________________ )</p>
              <p className="text-[11px] text-gray-600 mt-1">NIP. ___________________</p>
            </div>

            <div className="w-56">
              <p>Mahasiswa / Guru Praktikan,</p>
              <div className="h-16" />
              <p className="font-bold border-b border-black pb-1">( {report.teacherName} )</p>
              <p className="text-[11px] text-gray-600 mt-1">NIM / No. UKG: ____________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
