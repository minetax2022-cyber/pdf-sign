import React from 'react';
import { ShieldCheck, Cpu, Smartphone, HelpCircle, Lock, Layers, Zap, Award } from 'lucide-react';

export default function FooterInfo() {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-16 transition-colors">
      
      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              쉽고 빠른 전자 서명
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              프린터로 문서를 출력하거나 스캐너로 스캔할 필요 없이 웹 브라우저에서 마우스, 터치펜, 스마트폰으로 사인을 그리고 서명할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              100% 파일 보안 보장
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              사용자의 서명 데이터와 업로드된 PDF 파일은 서버 저장 없이 웹 브라우저 로컬(Client-Side) 환경에서 암호화 처리되므로 안전합니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              모든 기기 완전 지원
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Windows, Mac, Android, iOS 등 별도의 프로그램 설치 없이 모바일과 PC 모든 환경에서 원활하게 동작합니다.
            </p>
          </div>

        </div>

        {/* Popular PDF Tools Grid */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-10 mb-8">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <span>PDF24 인기 무료 웹 도구</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'PDF 병합', icon: '🧩' },
              { name: 'PDF 분할', icon: '✂️' },
              { name: 'PDF 압축', icon: '🗜️' },
              { name: 'PDF 변환', icon: '🔄' },
              { name: 'PDF 편집', icon: '✏️' },
              { name: 'PDF 서명', icon: '✍️', active: true }
            ].map((tool, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-center transition ${
                  tool.active
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                }`}
              >
                <span className="text-xl block mb-1">{tool.icon}</span>
                <span className="text-xs font-semibold">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>
            © 2026 PDF24 Tools Clone. 모든 서비스는 무료로 제공됩니다.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">개인정보처리방침</a>
            <a href="#terms" className="hover:underline">이용약관</a>
            <a href="#legal" className="hover:underline">법적 고지</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
