import { Preset } from '../types/timer';

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'ukin_standar_60m',
    name: 'UKIN Standar (60 Menit)',
    description: 'Format acuan utama UKIN PPG: Pendahuluan 15m, Inti 30m, Penutup 15m',
    category: 'ukin',
    stages: [
      {
        id: 'stage_awal_60',
        name: 'Kegiatan Awal (Pendahuluan)',
        durationSeconds: 15 * 60, // 15 menit
        color: 'emerald',
        cues: [
          'Salam pembuka, doa bersama, dan sapa ramah siswa',
          'Pemeriksaan kehadiran (presensi) & kesiapan fisik/psikis kelas',
          'Ice breaking singkat / nyanyikan lagu wajib nasional',
          'Apersepsi: Mengaitkan materi lalu & pertanyaan pemantik kontekstual',
          'Penyampaian tujuan pembelajaran, alur kegiatan, dan kriteria penilaian',
        ],
      },
      {
        id: 'stage_inti_60',
        name: 'Kegiatan Inti',
        durationSeconds: 30 * 60, // 30 menit
        color: 'blue',
        cues: [
          'Pemberian stimulus / tayangan video / orientasi materi bermakna',
          'Pengorganisasian siswa ke dalam kelompok kerja heterogen',
          'Pembagian LKPD & penjelasan teknis pengerjaan tugas',
          'Membimbing penyelidikan kelompok & proaktif memantau keaktifan peserta didik',
          'Presentasi hasil kelompok & apresiasi tanggapan teman sebaya',
          'Konfirmasi materi & penguatan konsep ilmiah oleh guru',
        ],
      },
      {
        id: 'stage_akhir_60',
        name: 'Kegiatan Akhir (Penutup)',
        durationSeconds: 15 * 60, // 15 menit
        color: 'purple',
        cues: [
          'Menyimpulkan pembelajaran bersama peserta didik',
          'Evaluasi formatif mandiri / asesmen singkat / post-test',
          'Refleksi pembelajaran (apa yang dipahami, disukai, kendala)',
          'Pemberian tindak lanjut (remedial/pengayaan atau PR)',
          'Penyampaian sekilas materi pertemuan berikutnya',
          'Doa penutup bersama siswa & salam perpisahan',
        ],
      },
    ],
  },
  {
    id: 'ukin_singkat_50m',
    name: 'UKIN Efisien (50 Menit)',
    description: 'Format UKIN 50 menit: Pendahuluan 10m, Inti 30m, Penutup 10m',
    category: 'ukin',
    stages: [
      {
        id: 'stage_awal_50',
        name: 'Kegiatan Awal',
        durationSeconds: 10 * 60,
        color: 'emerald',
        cues: [
          'Salam pembuka, doa, dan presensi',
          'Apersepsi cepat & motivasi belajar',
          'Penyampaian tujuan pembelajaran & langkah kegiatan',
        ],
      },
      {
        id: 'stage_inti_50',
        name: 'Kegiatan Inti',
        durationSeconds: 30 * 60,
        color: 'blue',
        cues: [
          'Stimulasi masalah kontekstual',
          'Aktivitas diskusi kelompok / pengerjaan LKPD',
          'Guru memfasilitasi dan mengobservasi penilaian sikap/keterampilan',
          'Presentasi perwakilan kelompok & umpan balik',
        ],
      },
      {
        id: 'stage_akhir_50',
        name: 'Kegiatan Akhir',
        durationSeconds: 10 * 60,
        color: 'purple',
        cues: [
          'Rangkuman simpulan bersama murid',
          'Asesmen formatif singkat',
          'Refleksi pembelajaran, doa penutup, dan salam',
        ],
      },
    ],
  },
  {
    id: 'ukin_lengkap_70m',
    name: 'UKIN Komprehensif (70 Menit)',
    description: 'Format UKIN 70 menit: Pendahuluan 15m, Inti 45m, Penutup 10m',
    category: 'ukin',
    stages: [
      {
        id: 'stage_awal_70',
        name: 'Kegiatan Awal',
        durationSeconds: 15 * 60,
        color: 'emerald',
        cues: [
          'Salam, doa, presensi, motivasi, apersepsi, tujuan pembelajaran',
        ],
      },
      {
        id: 'stage_inti_70',
        name: 'Kegiatan Inti Mendalam',
        durationSeconds: 45 * 60,
        color: 'blue',
        cues: [
          'Eksplorasi konsep terpadu & penyelidikan kelompok mendalam',
          'Penyusunan laporan / artefak karya kelompok',
          'Diskusi panel & presentasi seluruh kelompok',
          'Penguatan konsep & integrasi TPACK/HOTS',
        ],
      },
      {
        id: 'stage_akhir_70',
        name: 'Kegiatan Akhir',
        durationSeconds: 10 * 60,
        color: 'purple',
        cues: [
          'Simpulan, tes formatif, refleksi, tugas rumah, doa, dan salam',
        ],
      },
    ],
  },
  {
    id: 'sintaks_pbl_60m',
    name: 'Sintaks Problem Based Learning (PBL 60 Menit)',
    description: '5 Langkah Sintaks Model Pembelajaran Berbasis Masalah (PBL)',
    category: 'rpp',
    stages: [
      {
        id: 'pbl_awal',
        name: 'Pendahuluan & Apersepsi',
        durationSeconds: 10 * 60,
        color: 'emerald',
        cues: ['Salam, doa, presensi, apersepsi & tujuan pembelajaran'],
      },
      {
        id: 'pbl_sintaks1',
        name: 'Sintaks 1: Orientasi Siswa pada Masalah',
        durationSeconds: 8 * 60,
        color: 'cyan',
        cues: ['Pemaparan fenomena/masalah nyata melalui video/cerita pemantik'],
      },
      {
        id: 'pbl_sintaks23',
        name: 'Sintaks 2 & 3: Organisasi & Penyelidikan Kelompok',
        durationSeconds: 18 * 60,
        color: 'blue',
        cues: [
          'Membagi kelompok, membagikan LKPD, dan mengarahkan pengumpulan data',
          'Guru mendampingi siswa menggali solusi dan analisis data',
        ],
      },
      {
        id: 'pbl_sintaks45',
        name: 'Sintaks 4 & 5: Sajian Hasil & Evaluasi Pemecahan Masalah',
        durationSeconds: 14 * 60,
        color: 'amber',
        cues: [
          'Presentasi solusi kelompok di depan kelas & tanggapan teman',
          'Analisis dan evaluasi terhadap proses pemecahan masalah',
        ],
      },
      {
        id: 'pbl_penutup',
        name: 'Penutup, Refleksi & Evaluasi',
        durationSeconds: 10 * 60,
        color: 'purple',
        cues: ['Kesimpulan, tes formatif, refleksi pengalaman belajar, doa & salam'],
      },
    ],
  },
  {
    id: 'sintaks_pjbl_60m',
    name: 'Sintaks Project Based Learning (PjBL 60 Menit)',
    description: 'Langkah Sintaks Model Pembelajaran Berbasis Proyek (PjBL)',
    category: 'rpp',
    stages: [
      {
        id: 'pjbl_awal',
        name: 'Pendahuluan & Pengantar Proyek',
        durationSeconds: 10 * 60,
        color: 'emerald',
        cues: ['Salam, motivasi, tujuan belajar & urgensi produk proyek'],
      },
      {
        id: 'pjbl_sintaks12',
        name: 'Penentuan Pertanyaan Mendasar & Desain Proyek',
        durationSeconds: 12 * 60,
        color: 'cyan',
        cues: ['Merumuskan tantangan proyek & menyepakati aturan/rancangan'],
      },
      {
        id: 'pjbl_sintaks34',
        name: 'Penyusunan Jadwal & Monitoring Proyek',
        durationSeconds: 18 * 60,
        color: 'blue',
        cues: ['Siswa mengerjakan proyek, guru memantau keaktifan dan progres'],
      },
      {
        id: 'pjbl_sintaks56',
        name: 'Uji Hasil, Gelar Produk & Evaluasi',
        durationSeconds: 12 * 60,
        color: 'amber',
        cues: ['Pameran / demonstrasi produk karya kelompok dan penilaian'],
      },
      {
        id: 'pjbl_penutup',
        name: 'Penutup & Refleksi Pengalaman',
        durationSeconds: 8 * 60,
        color: 'purple',
        cues: ['Refleksi proses proyek, simpulan bersama, tindak lanjut, doa'],
      },
    ],
  },
  {
    id: 'microteaching_30m',
    name: 'Microteaching / Simulasi Cepat (30 Menit)',
    description: 'Format simulasi cepat peer teaching atau latihan mandiri',
    category: 'microteaching',
    stages: [
      {
        id: 'micro_awal',
        name: 'Pendahuluan Singkat',
        durationSeconds: 5 * 60,
        color: 'emerald',
        cues: ['Salam, presensi, apersepsi ringkas, tujuan belajar'],
      },
      {
        id: 'micro_inti',
        name: 'Kegiatan Inti Inti Pokok',
        durationSeconds: 20 * 60,
        color: 'blue',
        cues: ['Pemberian stimulus, aktivitas belajar peserta, diskusi, pembahasan'],
      },
      {
        id: 'micro_akhir',
        name: 'Penutup & Evaluasi',
        durationSeconds: 5 * 60,
        color: 'purple',
        cues: ['Simpulan, umpan balik kilat, salam penutup'],
      },
    ],
  },
];

export const COLOR_CONFIGS: Record<
  string,
  {
    bg: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    ring: string;
    gradient: string;
    accent: string;
    border: string;
  }
> = {
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    ring: 'ring-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-500',
    accent: '#10b981',
    border: 'border-emerald-200 dark:border-emerald-800/40',
  },
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    ring: 'ring-blue-500/30',
    gradient: 'from-blue-600 to-indigo-500',
    accent: '#3b82f6',
    border: 'border-blue-200 dark:border-blue-800/40',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    ring: 'ring-purple-500/30',
    gradient: 'from-purple-600 to-violet-500',
    accent: '#a855f7',
    border: 'border-purple-200 dark:border-purple-800/40',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    ring: 'ring-amber-500/30',
    gradient: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    border: 'border-amber-200 dark:border-amber-800/40',
  },
  rose: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    ring: 'ring-rose-500/30',
    gradient: 'from-rose-600 to-pink-500',
    accent: '#f43f5e',
    border: 'border-rose-200 dark:border-rose-800/40',
  },
  cyan: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    text: 'text-cyan-700 dark:text-cyan-300',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    ring: 'ring-cyan-500/30',
    gradient: 'from-cyan-600 to-blue-500',
    accent: '#06b6d4',
    border: 'border-cyan-200 dark:border-cyan-800/40',
  },
  indigo: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    text: 'text-indigo-700 dark:text-indigo-300',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    ring: 'ring-indigo-500/30',
    gradient: 'from-indigo-600 to-blue-600',
    accent: '#6366f1',
    border: 'border-indigo-200 dark:border-indigo-800/40',
  },
};
