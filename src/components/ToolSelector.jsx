import React from 'react';
import { 
  FileSignature, 
  FilePlus, 
  Scissors, 
  Image as ImageIcon, 
  Hash, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ToolSelector({ activeTool, setActiveTool }) {
  const tools = [
    {
      id: 'sign',
      title: 'PDF 서명',
      desc: '계약서, 양식 문서에 직접 사인을 그리거나 이미지 서명을 첨부하세요.',
      icon: FileSignature,
      badge: '추천',
      badgeColor: 'bg-blue-500 text-white',
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-500',
      iconColor: 'bg-blue-600 text-white',
      tag: '인기 1위'
    },
    {
      id: 'merge',
      title: 'PDF 합치기',
      desc: '여러 개의 PDF 문서를 원하는 순서대로 하나의 PDF 파일로 완벽히 결합합니다.',
      icon: FilePlus,
      badge: '필수',
      badgeColor: 'bg-indigo-500 text-white',
      gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500',
      iconColor: 'bg-indigo-600 text-white',
      tag: '압도적 사용'
    },
    {
      id: 'split',
      title: 'PDF 분할',
      desc: '원하는 페이지 범위를 지정하여 추출하거나 각 페이지를 개별 PDF로 분리합니다.',
      icon: Scissors,
      badge: '자주 쓰임',
      badgeColor: 'bg-purple-500 text-white',
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-500',
      iconColor: 'bg-purple-600 text-white',
      tag: '페이지 추출'
    },
    {
      id: 'imageToPdf',
      title: '이미지 ➡️ PDF',
      desc: 'JPG, PNG, WEBP 등의 여러 이미지 파일을 하나의 고품질 PDF로 변환합니다.',
      icon: ImageIcon,
      badge: '빠른 변환',
      badgeColor: 'bg-emerald-500 text-white',
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500',
      iconColor: 'bg-emerald-600 text-white',
      tag: '스캔본 결합'
    },
    {
      id: 'pageNumber',
      title: '페이지 번호',
      desc: 'PDF 각 페이지 상단/하단 원하는 위치에 자동으로 페이지 번호를 삽입합니다.',
      icon: Hash,
      badge: '자동 넘버',
      badgeColor: 'bg-amber-500 text-white',
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-500',
      iconColor: 'bg-amber-600 text-white',
      tag: '자동 넘버링'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
      {/* Title & Badge */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>마인 간편PDF / 전자서명 — 100% 무료 & 보안 솔루션</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          필요한 PDF 도구를 선택하세요
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium">
          전자서명부터 파일 합치기, 페이지 분할, 이미지 변환까지 한곳에서 간편하게 처리하세요.
        </p>

        {/* Feature Check badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {[
            '간편 전자서명',
            'PDF 합성 & 분할',
            '100% 로컬 보안',
            '초스피드 엔진'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = activeTool === tool.id;

          return (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 shadow-xl ring-2 ring-indigo-500 border-indigo-500 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md border-slate-200 dark:border-slate-700/80 hover:-translate-y-1'
              }`}
            >
              {/* Background Accent Gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${tool.gradient} pointer-events-none`} />

              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${tool.iconColor} flex items-center justify-center shadow-md shadow-indigo-500/10`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1">
                  <span>{tool.title}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {tool.desc}
                </p>
              </div>

              {/* Bottom tag & selector indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                  #{tool.tag}
                </span>
                <span className={`font-bold flex items-center gap-0.5 transition ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  <span>{isSelected ? '선택됨' : '사용하기'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
