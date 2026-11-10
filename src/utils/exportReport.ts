import { SessionSummaryReport, StageExecutionLog, Stage } from '../types/timer';
import { formatTime, formatTimeWithHours } from './formatters';

export interface GenerateReportParams {
  stages: Stage[];
  currentStageIndex: number;
  stageSecondsRemaining: number;
  totalSecondsElapsed: number;
  checkedCues: Record<string, boolean>;
  teacherName?: string;
  institution?: string;
  subject?: string;
  teacherNotes?: string;
  sessionStartedAt?: Date;
  sessionCompletedAt?: Date;
}

export function buildSessionReport({
  stages,
  currentStageIndex,
  stageSecondsRemaining,
  totalSecondsElapsed,
  checkedCues,
  teacherName = 'Mahasiswa PPG / Guru Praktikan',
  institution = 'LPTK / Sekolah Tempat Praktik',
  subject = 'Praktik Pembelajaran UKIN',
  teacherNotes = '',
  sessionStartedAt = new Date(),
  sessionCompletedAt = new Date(),
}: GenerateReportParams): SessionSummaryReport {
  let accumulatedElapsed = 0;

  const stageLogs: StageExecutionLog[] = stages.map((stage, idx) => {
    let actualSecondsSpent = 0;
    let completed = false;

    if (idx < currentStageIndex) {
      // Past stage completed fully (or skipped)
      actualSecondsSpent = stage.durationSeconds;
      completed = true;
    } else if (idx === currentStageIndex) {
      // Current stage in progress
      actualSecondsSpent = Math.max(0, stage.durationSeconds - stageSecondsRemaining);
      completed = stageSecondsRemaining === 0;
    } else {
      // Future stage not yet reached
      actualSecondsSpent = 0;
      completed = false;
    }

    accumulatedElapsed += actualSecondsSpent;

    const cuesCompleted = stage.cues.filter((cue) => checkedCues[cue]);
    const cuesMissed = stage.cues.filter((cue) => !checkedCues[cue]);

    return {
      stageId: stage.id,
      stageName: stage.name,
      targetSeconds: stage.durationSeconds,
      actualSecondsSpent,
      completed,
      cuesTotal: stage.cues.length,
      cuesCompleted,
      cuesMissed,
    };
  });

  const totalPlannedSeconds = stages.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalActualSeconds = totalSecondsElapsed || accumulatedElapsed;

  const totalCues = stages.reduce((acc, s) => acc + s.cues.length, 0);
  const totalCompletedCues = stages.reduce(
    (acc, s) => acc + s.cues.filter((c) => checkedCues[c]).length,
    0
  );

  const overallCompletionRate =
    totalCues > 0 ? Math.round((totalCompletedCues / totalCues) * 100) : 100;

  return {
    id: `report_${Date.now()}`,
    sessionTitle: `Laporan Pelaksanaan Praktik Pembelajaran UKIN`,
    teacherName,
    institution,
    subject,
    startedAt: sessionStartedAt.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }),
    completedAt: sessionCompletedAt.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }),
    totalPlannedSeconds,
    totalActualSeconds,
    stageLogs,
    teacherNotes,
    overallCompletionRate,
  };
}

/**
 * Format report into clean Markdown / Plain Text
 */
export function formatReportAsMarkdown(report: SessionSummaryReport): string {
  const plannedMins = Math.round(report.totalPlannedSeconds / 60);
  const actualFormatted = formatTimeWithHours(report.totalActualSeconds);
  const plannedFormatted = formatTimeWithHours(report.totalPlannedSeconds);

  let md = `# LAPORAN PELAKSANAAN PRAKTIK PEMBELAJARAN (UKIN / MICROTEACHING)\n\n`;
  md += `**Nama Mahasiswa / Guru**: ${report.teacherName}\n`;
  md += `**Instansi / Sekolah**: ${report.institution}\n`;
  md += `**Mata Pelajaran / Tema**: ${report.subject}\n`;
  md += `**Waktu Pelaksanaan**: ${report.startedAt}\n`;
  md += `**Waktu Selesai**: ${report.completedAt}\n\n`;

  md += `---\n\n`;
  md += `## 1. RINGKASAN WAKTU & KETERCAPAIAN RUBRIK\n\n`;
  md += `- **Target Total Durasi**: ${plannedFormatted} (${plannedMins} Menit)\n`;
  md += `- **Realisasi Durasi Video**: ${actualFormatted}\n`;
  md += `- **Tingkat Keterlaksanaan Rubrik**: **${report.overallCompletionRate}%**\n\n`;

  md += `---\n\n`;
  md += `## 2. RINCIAN ALOKASI WAKTU PER TAHAP\n\n`;
  md += `| No | Tahap Kegiatan | Target Durasi | Realisasi Durasi | Status Waktu | Poin Terlaksana |\n`;
  md += `|---|---|:---:|:---:|:---:|:---:|\n`;

  report.stageLogs.forEach((log, i) => {
    const diff = log.actualSecondsSpent - log.targetSeconds;
    let diffLabel = 'Tepat waktu';
    if (diff > 10) diffLabel = `+${formatTime(diff)}`;
    else if (diff < -10) diffLabel = `-${formatTime(Math.abs(diff))}`;

    const cuesRatio = `${log.cuesCompleted.length}/${log.cuesTotal}`;
    md += `| ${i + 1} | ${log.stageName} | ${formatTime(log.targetSeconds)} | ${formatTime(log.actualSecondsSpent)} | ${diffLabel} | ${cuesRatio} |\n`;
  });

  md += `\n---\n\n`;
  md += `## 3. CHECKLIST SINTAKS & RUBRIK PEMBELAJARAN\n\n`;

  report.stageLogs.forEach((log, i) => {
    md += `### ${i + 1}. ${log.stageName}\n`;
    md += `*Waktu: ${formatTime(log.actualSecondsSpent)} dari target ${formatTime(log.targetSeconds)}*\n\n`;

    if (log.cuesCompleted.length > 0) {
      log.cuesCompleted.forEach((cue) => {
        md += `- [x] ${cue}\n`;
      });
    }

    if (log.cuesMissed.length > 0) {
      log.cuesMissed.forEach((cue) => {
        md += `- [ ] ${cue} *(Belum tercentang)*\n`;
      });
    }

    if (log.cuesTotal === 0) {
      md += `*(Tidak ada catatan rubrik khusus)*\n`;
    }

    md += `\n`;
  });

  if (report.teacherNotes.trim()) {
    md += `---\n\n`;
    md += `## 4. CATATAN REFLEKSI DIRI GURU\n\n`;
    md += `${report.teacherNotes.trim()}\n\n`;
  }

  md += `---\n\n`;
  md += `### Lembar Pengesahan\n\n`;
  md += `Mengetahui,\n\n`;
  md += `| Dosen Pembimbing / Guru Pamong | Mahasiswa PPG / Guru Praktikan |\n`;
  md += `|:---:|:---:|\n`;
  md += `| <br><br><br> ( _______________________ ) | <br><br><br> ( **${report.teacherName}** ) |\n`;
  md += `| NIP. ____________________ | NIM / No. UKG: ____________________ |\n\n`;
  md += `*Dokumen dicetak secara otomatis melalui UKIN Timer Pro pada ${new Date().toLocaleDateString('id-ID')}*`;

  return md;
}

/**
 * Trigger file download in browser
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
