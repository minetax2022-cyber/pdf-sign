import React from 'react';
import { Menu, Download, Sun, Moon, Sparkles, ShieldCheck } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, resetApp }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-3">
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            aria-label="메뉴"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={resetApp}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-md group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-orange-500 text-lg tracking-tighter">24</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-800 dark:text-white tracking-tight flex items-center gap-1">
                PDF24 <span className="text-orange-500 font-bold text-sm bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">Tools</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Character Logo Area */}
        <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/50 text-xs font-semibold shadow-sm">
          <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-inner">
            🐼
          </div>
          <span>무료 웹 PDF 도구 모음</span>
        </div>

        {/* Right: Actions (Download, Dark Mode, Menu) */}
        <div className="flex items-center gap-2">
          <a
            href="#desktop-download"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4 text-orange-500" />
            <span>데스크톱 버전</span>
          </a>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
}
