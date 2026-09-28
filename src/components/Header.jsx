import React from 'react';
import { 
  FileSignature, 
  FilePlus, 
  Scissors, 
  Image as ImageIcon, 
  Hash, 
  Sun, 
  Moon, 
  Sparkles, 
  ShieldCheck,
  Download
} from 'lucide-react';

export default function Header({ activeTool, setActiveTool, darkMode, setDarkMode, resetApp }) {
  const tools = [
    { id: 'sign', name: 'PDF 서명', icon: FileSignature, color: 'text-blue-500' },
    { id: 'merge', name: 'PDF 합치기', icon: FilePlus, color: 'text-indigo-500' },
    { id: 'split', name: 'PDF 분할', icon: Scissors, color: 'text-purple-500' },
    { id: 'imageToPdf', name: '이미지 ➡️ PDF', icon: ImageIcon, color: 'text-emerald-500' },
    { id: 'pageNumber', name: '페이지 번호', icon: Hash, color: 'text-amber-500' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => {
              resetApp();
              setActiveTool('sign');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Custom Brand Logo Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition duration-200 transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-transparent to-cyan-400/20" />
                <svg className="w-6 h-6 text-cyan-300 transform -rotate-3 group-hover:rotate-0 transition duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="2.8" className="text-emerald-400" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                  마인 <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">간편 PDF</span>
                </span>
                <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 uppercase tracking-wide">
                  PRO
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                초스피드 웹 PDF 종합 솔루션
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Tool Switcher Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {tools.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  resetApp();
                  setActiveTool(t.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% 로컬 보안</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
}

