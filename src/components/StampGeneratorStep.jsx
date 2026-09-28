import React, { useState, useEffect, useRef } from 'react';
import { 
  Stamp, 
  Download, 
  Check, 
  Building2, 
  User, 
  Sparkles, 
  Palette,
  FileSignature,
  Grid,
  Circle,
  Square
} from 'lucide-react';

export default function StampGeneratorStep({ onSelectStampForSign }) {
  const [stampType, setStampType] = useState('corporate'); // 'personal' | 'corporate'
  const [corpShapeFilter, setCorpShapeFilter] = useState('all'); // 'all' | 'square' | 'circle'
  
  const [nameInput, setNameInput] = useState('배종호');
  const [corpNameInput, setCorpNameInput] = useState('마인오피스');
  const [corpCenterText, setCorpCenterText] = useState('대표이사'); // '대표이사' | '직인' | '인'
  const [stampColor, setStampColor] = useState('#cc1e1e'); // Red seal color

  // 6 Calligraphy Font Styles requested by user for Square Stamps:
  // 1. 전서체 2. 인서체 3. 해서체 4. 고인체 5. 예서체 6. 훈민정음체
  const fontStylesList = [
    { fontKey: 'jeonseo', fontName: '전서체', desc: '전통 인장 전서체 (권위있는 느낌)', fontCss: 'Gungsuh, 궁서체, serif', weight: 'bold' },
    { fontKey: 'inseo', fontName: '인서체', desc: '정방형 인서체 (단정함)', fontCss: 'Batang, 바탕체, serif', weight: '900' },
    { fontKey: 'haeseo', fontName: '해서체', desc: '정갈한 해서체 (명조 기반)', fontCss: 'NanumMyeongjo, BatangChe, serif', weight: 'bold' },
    { fontKey: 'goin', fontName: '고인체', desc: '두터운 고인체 (묵직함)', fontCss: 'Gungsuh, 궁서체, serif', weight: '900' },
    { fontKey: 'yeseo', fontName: '예서체', desc: '횡선 강조 예서체 (세련됨)', fontCss: 'Malgun Gothic, 맑은 고딕, sans-serif', weight: 'bold' },
    { fontKey: 'hunmin', fontName: '훈민정음체', desc: '훈민정음 원문체 (기하학적 본체)', fontCss: 'Pretendard, Gothic, sans-serif', weight: 'bold' }
  ];

  // Personal stamp templates
  const personalTemplates = [
    { id: 'p_oval_1', name: '타원형 전서체', shape: 'oval', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif' },
    { id: 'p_oval_2', name: '타원형 고인체', shape: 'oval', appendIn: true, fontName: '고인체', fontCss: 'Batang, 바탕체, serif' },
    { id: 'p_square_1', name: '사각 전서체 인장', shape: 'square', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif' },
    { id: 'p_square_2', name: '사각 해서체 인장', shape: 'square', appendIn: true, fontName: '해서체', fontCss: 'NanumMyeongjo, Batang, serif' },
    { id: 'p_circle_1', name: '원형 인서체 인장', shape: 'circle', appendIn: true, fontName: '인서체', fontCss: 'BatangChe, serif' },
    { id: 'p_circle_2', name: '원형 훈민정음체', shape: 'circle', appendIn: true, fontName: '훈민정음체', fontCss: 'Pretendard, sans-serif' }
  ];

  // Corporate templates: includes all 6 font styles for Square Seals + Circle Representative Seals
  const corporateSquareTemplates = fontStylesList.map((f, idx) => ({
    id: `corp_square_${f.fontKey}`,
    name: `법인 사각 직인 [${f.fontName}]`,
    shape: 'square',
    appendIn: true,
    fontName: f.fontName,
    fontCss: f.fontCss,
    weight: f.weight,
    desc: f.desc
  }));

  const corporateCircleTemplates = [
    { id: 'corp_circle_star', name: '법인 대표인 (별 ★)', shape: 'corp_circle', symbol: '★', center: corpCenterText, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif' },
    { id: 'corp_circle_dot', name: '법인 대표인 (점 ●)', shape: 'corp_circle', symbol: '●', center: corpCenterText, fontName: '해서체', fontCss: 'Batang, 바탕체, serif' },
    { id: 'corp_circle_diamond', name: '법인 대표인 (다이아 ◆)', shape: 'corp_circle', symbol: '◆', center: corpCenterText, fontName: '인서체', fontCss: 'BatangChe, serif' }
  ];

  let corporateTemplates = [];
  if (corpShapeFilter === 'square') {
    corporateTemplates = corporateSquareTemplates;
  } else if (corpShapeFilter === 'circle') {
    corporateTemplates = corporateCircleTemplates;
  } else {
    corporateTemplates = [...corporateSquareTemplates, ...corporateCircleTemplates];
  }

  const templates = stampType === 'personal' ? personalTemplates : corporateTemplates;

  // Helper to render stamp onto a canvas
  const renderStampToCanvas = (canvas, tpl, nameText, color) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 240;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;

    const centerX = width / 2;
    const centerY = height / 2;

    const fontName = tpl.fontCss || 'Gungsuh, 궁서체, serif';
    const fontWeight = tpl.weight || 'bold';

    if (tpl.shape === 'oval') {
      // Personal Oval Stamp
      const radiusX = 65;
      const radiusY = 95;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX - 4, radiusY - 4, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      let text = nameText.trim();
      if (tpl.appendIn && !text.endsWith('인')) {
        text += '인';
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        const fontSize = 42;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        const charSpacing = 50;
        const startY = centerY - ((text.length - 1) * charSpacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], centerX, startY + i * charSpacing);
        }
      } else {
        const fontSize = 36;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        ctx.fillText(text[0] || '', centerX + 18, centerY - 24);
        ctx.fillText(text[1] || '', centerX + 18, centerY + 24);
        ctx.fillText(text[2] || '', centerX - 18, centerY - 24);
        ctx.fillText(text[3] || '', centerX - 18, centerY + 24);
      }

    } else if (tpl.shape === 'square') {
      // Square Stamp (정사각형 도장)
      const size = 170;
      const x = centerX - size / 2;
      const y = centerY - size / 2;

      // Double Frame Border
      ctx.lineWidth = 6;
      ctx.strokeRect(x, y, size, size);

      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y + 4, size - 8, size - 8);

      let text = nameText.trim();
      if (tpl.appendIn && !text.endsWith('인')) {
        text += '인';
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 4) {
        // 2x2 layout
        const fontSize = 44;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        // Traditional Korean seal order: right column top to bottom (0,1), left column top to bottom (2,3)
        ctx.fillText(text[0] || '', centerX - 32, centerY - 32);
        ctx.fillText(text[1] || '', centerX + 32, centerY - 32);
        ctx.fillText(text[2] || '', centerX - 32, centerY + 32);
        ctx.fillText(text[3] || '', centerX + 32, centerY + 32);
      } else {
        // Multi-character layout (e.g. 마인오피스인 -> 2 cols x 3 rows)
        const fontSize = 32;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        const half = Math.ceil(text.length / 2);
        const col1 = text.slice(0, half);
        const col2 = text.slice(half);

        col1.split('').forEach((ch, idx) => {
          ctx.fillText(ch, centerX - 30, centerY - 40 + idx * 36);
        });
        col2.split('').forEach((ch, idx) => {
          ctx.fillText(ch, centerX + 30, centerY - 40 + idx * 36);
        });
      }

    } else if (tpl.shape === 'circle') {
      // Circle Personal Stamp
      const radius = 80;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      let text = nameText.trim();
      if (tpl.appendIn && !text.endsWith('인')) {
        text += '인';
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        const fontSize = 40;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        const spacing = 45;
        const startY = centerY - ((text.length - 1) * spacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], centerX, startY + i * spacing);
        }
      } else {
        const fontSize = 36;
        ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
        ctx.fillText(text[0] || '', centerX - 25, centerY - 25);
        ctx.fillText(text[1] || '', centerX + 25, centerY - 25);
        ctx.fillText(text[2] || '', centerX - 25, centerY + 25);
        ctx.fillText(text[3] || '', centerX + 25, centerY + 25);
      }

    } else if (tpl.shape === 'corp_circle') {
      // Corporate Circular Stamp (Outer ring + Center Title)
      const outerRadius = 88;
      const innerRadius = 42;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius - 3.5, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Symbol at top
      ctx.font = `bold 14px ${fontName}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tpl.symbol || '★', centerX, centerY - outerRadius + 14);

      // Curved Corporate Name
      const corpText = corpNameInput.trim() || '마인오피스';
      const numChars = corpText.length;
      const angleStep = Math.PI / Math.max(numChars + 1, 6);
      const startAngle = -Math.PI / 2 - ((numChars - 1) * angleStep) / 2;

      ctx.font = `bold 16px ${fontName}`;
      for (let i = 0; i < numChars; i++) {
        const angle = startAngle + i * angleStep;
        const charRadius = outerRadius - 18;
        const x = centerX + charRadius * Math.cos(angle);
        const y = centerY + charRadius * Math.sin(angle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(corpText[i], 0, 0);
        ctx.restore();
      }

      // Center Title (대표이사 / 직인)
      const centerTitle = corpCenterText.trim() || '대표이사';
      ctx.font = `bold 22px ${fontName}`;
      if (centerTitle.length <= 2) {
        ctx.fillText(centerTitle, centerX, centerY);
      } else {
        ctx.font = `bold 18px ${fontName}`;
        ctx.fillText(centerTitle[0] || '', centerX - 12, centerY - 12);
        ctx.fillText(centerTitle[1] || '', centerX + 12, centerY - 12);
        ctx.fillText(centerTitle[2] || '', centerX - 12, centerY + 12);
        ctx.fillText(centerTitle[3] || '', centerX + 12, centerY + 12);
      }
    }
  };

  const downloadStampPng = (tpl) => {
    const canvas = document.createElement('canvas');
    const nameText = stampType === 'personal' ? nameInput : corpNameInput;
    renderStampToCanvas(canvas, tpl, nameText, stampColor);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `stamp_${tpl.fontName || tpl.id}.png`;
    link.click();
  };

  const applyStampToPdf = (tpl) => {
    const canvas = document.createElement('canvas');
    const nameText = stampType === 'personal' ? nameInput : corpNameInput;
    renderStampToCanvas(canvas, tpl, nameText, stampColor);

    const dataUrl = canvas.toDataURL('image/png');
    if (onSelectStampForSign) {
      onSelectStampForSign(dataUrl);
    } else {
      alert('도장이 생성되었습니다. [PDF 서명] 화면에서 원하는 곳에 찍으세요!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
          <Stamp className="w-4 h-4 text-rose-500" />
          <span>마인 간편PDF / 전자서명 — 6대 전통 서체 지원 도장 생성기</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          무료 전자 도장 만들기
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
          전서체, 인서체, 해서체, 고인체, 예서체, 훈민정음체 서체별 사각 법인 직인 & 원형 도장을 즉시 생성합니다.
        </p>
      </div>

      {/* Main Control & Preview Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Type Switcher: 개인 도장 vs 법인/회사 도장 */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              onClick={() => setStampType('corporate')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition ${
                stampType === 'corporate'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>법인 / 회사 도장 (6대 서체 사각직인)</span>
            </button>

            <button
              onClick={() => setStampType('personal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition ${
                stampType === 'personal'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>개인 도장 만들기</span>
            </button>
          </div>
        </div>

        {/* Inputs Bar */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          
          {stampType === 'corporate' ? (
            <>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  회사/법인명 입력:
                </label>
                <input
                  type="text"
                  value={corpNameInput}
                  onChange={(e) => setCorpNameInput(e.target.value)}
                  maxLength={12}
                  placeholder="예: 마인오피스 또는 (주)마인"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  중앙 직인 타이틀:
                </label>
                <select
                  value={corpCenterText}
                  onChange={(e) => setCorpCenterText(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
                >
                  <option value="대표이사">대표이사</option>
                  <option value="직인">직인</option>
                  <option value="대표인">대표인</option>
                  <option value="인">인</option>
                </select>
              </div>
            </>
          ) : (
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                도장 성명 입력 (2자~4자):
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={6}
                placeholder="예: 배종호 또는 홍길동"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          )}

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>인영 인쇄 색상:</span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[
                { color: '#cc1e1e', label: '전통 인목 빨강' },
                { color: '#b91c1c', label: '짙은 버건디' },
                { color: '#1e3a8a', label: '인디고 남색' },
                { color: '#111827', label: '선명한 검정' }
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() => setStampColor(c.color)}
                  style={{ backgroundColor: c.color }}
                  className={`w-8 h-8 rounded-full border-2 transition transform ${
                    stampColor === c.color ? 'border-amber-400 scale-110 ring-2 ring-rose-500/30 shadow-md' : 'border-white dark:border-slate-700'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Corporate Shape Filter Bar */}
        {stampType === 'corporate' && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                도장 모양 구분:
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: 'square', label: '정사각형 법인 직인 (6대 서체)', icon: Square },
                  { id: 'circle', label: '원형 대표이사 인장', icon: Circle },
                  { id: 'all', label: '전체 보기', icon: Grid }
                ].map((f) => {
                  const Icon = f.icon;
                  const isSelected = corpShapeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setCorpShapeFilter(f.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
              ✨ 전서체 / 인서체 / 해서체 / 고인체 / 예서체 / 훈민정음체 지원
            </div>
          </div>
        )}

        {/* Templates Display Grid */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <StampCard 
                key={tpl.id}
                tpl={tpl}
                nameText={stampType === 'personal' ? nameInput : corpNameInput}
                color={stampColor}
                renderFn={renderStampToCanvas}
                onDownload={() => downloadStampPng(tpl)}
                onUseSign={() => applyStampToPdf(tpl)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Single Stamp Preview Card
function StampCard({ tpl, nameText, color, renderFn, onDownload, onUseSign }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderFn(canvasRef.current, tpl, nameText, color);
    }
  }, [tpl, nameText, color]);

  return (
    <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-xl hover:border-rose-400 transition duration-200 flex flex-col items-center justify-between space-y-4 group relative overflow-hidden">
      
      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <span>{tpl.name}</span>
        </span>
        <span className="text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/80">
          투명 PNG
        </span>
      </div>

      {/* Stamp Image Preview Box */}
      <div className="w-48 h-48 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition transform duration-200">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>

      {/* Font Style Label prominently underneath the preview (요청사항: 서체 이름 명시) */}
      <div className="w-full text-center bg-rose-50/70 dark:bg-rose-950/40 py-1.5 px-3 rounded-xl border border-rose-200/60 dark:border-rose-900/60">
        <div className="text-sm font-black text-rose-700 dark:text-rose-300">
          {tpl.fontName || '전서체'}
        </div>
        {tpl.desc && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {tpl.desc}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl transition"
        >
          <Download className="w-3.5 h-3.5 text-rose-500" />
          <span>PNG 저장</span>
        </button>

        <button
          onClick={onUseSign}
          className="flex items-center justify-center gap-1 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl shadow-md shadow-rose-600/20 transition transform hover:-translate-y-0.5"
        >
          <FileSignature className="w-3.5 h-3.5" />
          <span>서명에 사용</span>
        </button>
      </div>

    </div>
  );
}
