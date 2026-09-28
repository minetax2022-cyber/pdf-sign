import React, { useState, useEffect, useRef } from 'react';
import { 
  Stamp, 
  Download, 
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
  const [stampType, setStampType] = useState('personal'); // 'personal' | 'corporate'
  const [personalShapeFilter, setPersonalShapeFilter] = useState('all'); // 'all' | 'oval' | 'circle' | 'square'
  const [corpShapeFilter, setCorpShapeFilter] = useState('all'); // 'all' | 'square' | 'circle'
  
  // Inputs
  const [nameInput, setNameInput] = useState('배종호');
  const [corpNameInput, setCorpNameInput] = useState('마인오피스');
  const [corpCenterText, setCorpCenterText] = useState('대표이사'); // '대표이사' | '代表理事' | '직인' | '인'
  const [stampColor, setStampColor] = useState('#cc1e1e'); // Red seal color

  // 6 Font Styles List:
  const fontStylesList = [
    { fontKey: 'jeonseo', fontName: '전서체', desc: '전통 전서체 (연결 기하학 미로 인장선)', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.25 },
    { fontKey: 'inseo', fontName: '인서체', desc: '정방형 인서체 (꽉 찬 굵은 직인선)', fontCss: 'Batang, 바탕체, serif', stretch: 1.35 },
    { fontKey: 'haeseo', fontName: '해서체', desc: '정갈한 해서체 (명조 기반 서체)', fontCss: 'NanumMyeongjo, BatangChe, serif', stretch: 1.0 },
    { fontKey: 'goin', fontName: '고인체', desc: '두터운 고인체 (묵직한 사각형 고인인)', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.4 },
    { fontKey: 'yeseo', fontName: '예서체', desc: '횡선 강조 예서체 (세련된 서체)', fontCss: 'Malgun Gothic, 맑은 고딕, sans-serif', stretch: 1.1 },
    { fontKey: 'hunmin', fontName: '훈민정음체', desc: '훈민정음 원문체 (기하학적 목판본)', fontCss: 'Pretendard, Gothic, sans-serif', stretch: 1.05 }
  ];

  // Personal Templates: half '이름만' (3-char), half ''인' 포함' (4-char)
  const allPersonalTemplates = [
    // 🥚 타원형 (Oval)
    { id: 'p_oval_name_1', name: '타원형 [전서체 - 이름만]', shape: 'oval', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름만 표기 (배종호)' },
    { id: 'p_oval_in_1', name: '타원형 [전서체 - 인 포함]', shape: 'oval', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름+인 4자 (배종호인)' },
    { id: 'p_oval_name_2', name: '타원형 [인서체 - 이름만]', shape: 'oval', appendIn: false, fontName: '인서체', fontCss: 'Batang, 바탕체, serif', stretch: 1.3, desc: '이름만 표기 (배종호)' },
    { id: 'p_oval_in_2', name: '타원형 [인서체 - 인 포함]', shape: 'oval', appendIn: true, fontName: '인서체', fontCss: 'Batang, 바탕체, serif', stretch: 1.3, desc: '이름+인 4자 (배종호인)' },

    // 🔳 네모/정사각형 (Square)
    { id: 'p_sq_name_1', name: '정사각형 [전서체 - 이름만]', shape: 'square', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름만 수직배치 (배종호)' },
    { id: 'p_sq_in_1', name: '정사각형 [전서체 - 인 포함]', shape: 'square', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름+인 2x2격자 (배종호인)' },
    { id: 'p_sq_name_2', name: '정사각형 [인서체 - 이름만]', shape: 'square', appendIn: false, fontName: '인서체', fontCss: 'Batang, 바탕체, serif', stretch: 1.3, desc: '이름만 수직배치 (배종호)' },
    { id: 'p_sq_in_2', name: '정사각형 [인서체 - 인 포함]', shape: 'square', appendIn: true, fontName: '인서체', fontCss: 'Batang, 바탕체, serif', stretch: 1.3, desc: '이름+인 2x2격자 (배종호인)' },

    // ⭕ 둥근 원형 (Circle)
    { id: 'p_circ_name_1', name: '원형 [전서체 - 이름만]', shape: 'circle', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름만 수직배치 (배종호)' },
    { id: 'p_circ_in_1', name: '원형 [전서체 - 인 포함]', shape: 'circle', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.2, desc: '이름+인 2x2격자 (배종호인)' },
    { id: 'p_circ_name_2', name: '원형 [해서체 - 이름만]', shape: 'circle', appendIn: false, fontName: '해서체', fontCss: 'NanumMyeongjo, BatangChe, serif', stretch: 1.0, desc: '이름만 수직배치 (배종호)' },
    { id: 'p_circ_in_2', name: '원형 [고인체 - 인 포함]', shape: 'circle', appendIn: true, fontName: '고인체', fontCss: 'Gungsuh, 궁서체, serif', stretch: 1.35, desc: '이름+인 2x2격자 (배종호인)' }
  ];

  // Filter personal templates by shape
  let personalTemplates = [];
  if (personalShapeFilter === 'all') {
    personalTemplates = allPersonalTemplates;
  } else {
    personalTemplates = allPersonalTemplates.filter((t) => t.shape === personalShapeFilter);
  }

  // Corporate Templates
  const corporateSquareTemplates = fontStylesList.map((f) => ({
    id: `corp_sq_${f.fontKey}`,
    name: `법인 사각 직인 [${f.fontName}]`,
    shape: 'square',
    appendIn: true,
    fontName: f.fontName,
    fontCss: f.fontCss,
    stretch: f.stretch,
    desc: f.desc
  }));

  const corporateCircleTemplates = [
    { id: 'corp_circle_star_hangeul', name: '법인 대표인 (한글 / 별 ★)', shape: 'corp_circle', symbol: '★', center: '대표이사', fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif' },
    { id: 'corp_circle_star_hanja', name: '법인 대표인 (한자 代表理事 / 별 ★)', shape: 'corp_circle', symbol: '★', center: '代表理事', fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif' },
    { id: 'corp_circle_dot_hangeul', name: '법인 대표인 (한글 / 점 ●)', shape: 'corp_circle', symbol: '●', center: '대표이사', fontName: '인서체', fontCss: 'Batang, 바탕체, serif' },
    { id: 'corp_circle_dot_hanja', name: '법인 대표인 (한자 代表理事 / 점 ●)', shape: 'corp_circle', symbol: '●', center: '代表理事', fontName: '인서체', fontCss: 'Batang, 바탕체, serif' }
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

  // Helper to render stamp onto a canvas element
  const renderStampToCanvas = (canvas, tpl, rawText, color) => {
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

    const centerX = width / 2;
    const centerY = height / 2;

    const fontName = tpl.fontCss || 'Gungsuh, 궁서체, serif';
    const stretchRatio = tpl.stretch || 1.1;

    // Build text based on tpl.appendIn rule
    let text = rawText.trim();
    if (tpl.appendIn && !text.endsWith('인')) {
      text += '인';
    }

    if (tpl.shape === 'oval') {
      // Oval Stamp
      const radiusX = 62;
      const radiusY = 92;

      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX - 4, radiusY - 4, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        // Vertical 3-character layout (e.g. 배 종 호)
        const fontSize = 42;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const spacing = 50;
        const startY = centerY - ((text.length - 1) * spacing) / 2;

        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(1, stretchRatio);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else {
        // 4-character 2x2 grid layout (e.g. 배종호인)
        const fontSize = 36;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const pos = [
          { x: centerX + 18, y: centerY - 24, char: text[0] },
          { x: centerX + 18, y: centerY + 24, char: text[1] },
          { x: centerX - 18, y: centerY - 24, char: text[2] },
          { x: centerX - 18, y: centerY + 24, char: text[3] }
        ];
        pos.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, stretchRatio);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'square') {
      // Square Stamp (정사각형 도장)
      const size = 168;
      const x = centerX - size / 2;
      const y = centerY - size / 2;

      ctx.lineWidth = 6;
      ctx.strokeRect(x, y, size, size);

      ctx.lineWidth = 1.8;
      ctx.strokeRect(x + 4, y + 4, size - 8, size - 8);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        // Vertical 3-character layout in square seal (e.g. 배 종 호)
        const fontSize = 44;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const spacing = 48;
        const startY = centerY - ((text.length - 1) * spacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(1.05, stretchRatio);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else if (text.length <= 4) {
        // 4-character 2x2 Grid (배종호인)
        const fontSize = 44;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const positions = [
          { x: centerX - 32, y: centerY - 32, char: text[0] },
          { x: centerX + 32, y: centerY - 32, char: text[1] },
          { x: centerX - 32, y: centerY + 32, char: text[2] },
          { x: centerX + 32, y: centerY + 32, char: text[3] }
        ];

        positions.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1.05, stretchRatio);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      } else {
        // Multi-character corporate layout (마인오피스인 -> 2 cols)
        const fontSize = 32;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const half = Math.ceil(text.length / 2);
        const col1 = text.slice(0, half);
        const col2 = text.slice(half);

        col1.split('').forEach((ch, idx) => {
          ctx.save();
          ctx.translate(centerX - 30, centerY - 40 + idx * 36);
          ctx.scale(1.05, stretchRatio);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });

        col2.split('').forEach((ch, idx) => {
          ctx.save();
          ctx.translate(centerX + 30, centerY - 40 + idx * 36);
          ctx.scale(1.05, stretchRatio);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'circle') {
      // Circle Personal Stamp
      const radius = 80;
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        // Vertical 3-character layout (배 종 호)
        const fontSize = 40;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const spacing = 45;
        const startY = centerY - ((text.length - 1) * spacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(1, stretchRatio);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else {
        // 4-character 2x2 Grid (배종호인)
        const fontSize = 36;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        const positions = [
          { x: centerX - 25, y: centerY - 25, char: text[0] },
          { x: centerX + 25, y: centerY - 25, char: text[1] },
          { x: centerX - 25, y: centerY + 25, char: text[2] },
          { x: centerX + 25, y: centerY + 25, char: text[3] }
        ];
        positions.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, stretchRatio);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'corp_circle') {
      // Corporate Circular Stamp (Outer Ring + Inner Center Title)
      const outerRadius = 88;
      const innerRadius = 42;

      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius - 3.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Symbol at top
      ctx.font = `bold 14px ${fontName}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tpl.symbol || '★', centerX, centerY - outerRadius + 14);

      // Arc Corporate Name along outer ring
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

      // Center Title (대표이사 / 代表理事)
      const centerTitle = tpl.center || corpCenterText || '대표이사';
      ctx.font = `900 20px ${fontName}`;

      if (centerTitle.length <= 2) {
        ctx.fillText(centerTitle, centerX, centerY);
      } else {
        ctx.font = `900 17px ${fontName}`;
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
      alert('도장이 생성되었습니다. [PDF 서명] 화면에서 원하는 위치에 찍으세요!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
          <Stamp className="w-4 h-4 text-rose-500" />
          <span>마인 간편PDF / 전자서명 — 무료 무제한 전자 도장 생성기</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          무료 전자 도장 만들기
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
          개인 도장(이름만 / 인포함 공존) 및 법인 사각 직인(6대 전통 서체), 대표인 도장을 한눈에 확인하세요.
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Type Switcher: 개인 도장 vs 법인/회사 도장 */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              onClick={() => setStampType('personal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition ${
                stampType === 'personal'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>개인 도장 (이름만 / 인 포함 다양화)</span>
            </button>

            <button
              onClick={() => setStampType('corporate')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition ${
                stampType === 'corporate'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>법인 / 회사 도장 (6대 서체 직인)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Inputs Bar */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          
          {stampType === 'personal' ? (
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                성명 입력 (예: 배종호):
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
          ) : (
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
                  중앙 대표인 타이틀:
                </label>
                <select
                  value={corpCenterText}
                  onChange={(e) => setCorpCenterText(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
                >
                  <option value="대표이사">대표이사 (한글)</option>
                  <option value="代表理事">代表理事 (한자)</option>
                  <option value="직인">직인 (한글)</option>
                  <option value="인">인 (한글)</option>
                </select>
              </div>
            </>
          )}

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>인영 색상:</span>
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

        {/* Shape Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              도장 모양 필터:
            </span>
            <div className="flex gap-1.5">
              {stampType === 'personal' ? (
                [
                  { id: 'all', label: '전체 보기 (이름만 & 인포함)', icon: Grid },
                  { id: 'oval', label: '타원형 도장', icon: Circle },
                  { id: 'square', label: '정사각형 네모 도장', icon: Square },
                  { id: 'circle', label: '둥근 원형 도장', icon: Circle }
                ].map((f) => {
                  const Icon = f.icon;
                  const isSelected = personalShapeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setPersonalShapeFilter(f.id)}
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
                })
              ) : (
                [
                  { id: 'all', label: '전체 보기', icon: Grid },
                  { id: 'square', label: '정사각형 법인 직인 (6대 서체)', icon: Square },
                  { id: 'circle', label: '원형 대표이사 인장 (한글/한자)', icon: Circle }
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
                })
              )}
            </div>
          </div>

          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
            {stampType === 'personal' ? '✨ 이름만 표기(3자) & 인 포함(4자) 동시 제공' : '✨ 6대 한국 전통 서체 완벽 지원'}
          </div>
        </div>

        {/* Display Grid of Generated Stamp Cards */}
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

// Single Stamp Card Component
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

      {/* Font Style & Type Label */}
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
