import React from 'react';
import { ShieldCheck, Cpu, Smartphone, HelpCircle, Lock, Layers, Zap, Award } from 'lucide-react';

export default function FooterInfo({ activeTool, setActiveTool }) {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 transition-colors">
      
      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              쉽고 빠른 웹 PDF 솔루션
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              프린터나 스캐너 없이 전자서명부터 PDF 합치기, 분할, 이미지 변환까지 웹 브라우저에서 즉시 실행하세요.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              100% 파일 보안 보장
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              사용자의 문서와 서명 데이터는 외부 서버 업로드 없이 사용자 웹 브라우저(Client-Side) 내부에서 안전하게 처리됩니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              모든 PC/모바일 호환
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Windows, Mac, iPhone, Android 등 디바이스와 웹 브라우저 제약 없이 언제 어디서나 바로 사용할 수 있습니다.
            </p>
          </div>

        </div>

        {/* Popular PDF Tools Grid */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10 mb-8">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>마인 간편PDF / 전자서명 주요 기능 모음</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { id: 'sign', name: 'PDF 서명', icon: '✍️' },
              { id: 'stamp', name: '도장 만들기', icon: '💮' },
              { id: 'merge', name: 'PDF 합치기', icon: '🧩' },
              { id: 'split', name: 'PDF 분할', icon: '✂️' },
              { id: 'imageToPdf', name: '이미지 ➡️ PDF', icon: '🖼️' },
              { id: 'pageNumber', name: '페이지 번호', icon: '🔢' }
            ].map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool && setActiveTool(tool.id)}
                  className={`p-3.5 rounded-xl border text-center transition cursor-pointer ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{tool.icon}</span>
                  <span className="text-xs font-bold">{tool.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © 2026 마인 간편PDF / 전자서명. 모든 서비스는 100% 무료로 제공됩니다.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">개인정보처리방침</a>
            <a href="#terms" className="hover:underline">이용약관</a>
            <a href="#legal" className="hover:underline">보안 방침</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

