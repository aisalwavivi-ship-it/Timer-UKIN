import React from 'react';
import { 
  Maximize2, 
  Settings, 
  FileText, 
  Bookmark, 
  Sun, 
  Moon, 
  HelpCircle,
  Tv
} from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenRundown: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onOpenSummary: () => void;
  onToggleFullscreen: () => void;
  onTogglePip: () => void;
  isPipAvailable: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onOpenRundown,
  onOpenSettings,
  onOpenGuide,
  onOpenSummary,
  onToggleFullscreen,
  onTogglePip,
  isPipAvailable,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-40 transition-colors">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
            UK
          </span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">UKIN Timer Pro</span>
        </a>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button 
          onClick={onOpenPresets} 
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Bookmark className="w-4 h-4 text-slate-400" />
          <span>Preset UKIN & RPP</span>
        </button>
        <button 
          onClick={onOpenRundown} 
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Rundown Waktu</span>
        </button>
        <button 
          onClick={onOpenSummary} 
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-emerald-700 dark:text-emerald-400 font-semibold"
        >
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Ekspor Log & Rubrik</span>
        </button>
        <button 
          onClick={onOpenGuide} 
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Panduan Take Video</span>
        </button>
        <button 
          onClick={onOpenSettings} 
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Pengaturan Suara</span>
        </button>
      </nav>

      {/* Zone 3: Primary action & controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {isPipAvailable && (
          <button
            onClick={onTogglePip}
            title="Buka Timer Melayang (Picture-in-Picture) di atas slide Canva/PowerPoint"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <Tv className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onToggleFullscreen}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Layar Penuh (Kamera)</span>
        </button>
      </div>
    </header>
  );
};
