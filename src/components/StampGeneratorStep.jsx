import React, { useState, useEffect, useRef } from 'react';
import { 
  Stamp, 
  Download, 
  Check, 
  RefreshCw, 
  Building2, 
  User, 
  Sparkles, 
  Palette,
  FileSignature
} from 'lucide-react';

export default function StampGeneratorStep({ onSelectStampForSign }) {
  const [stampType, setStampType] = useState('personal'); // 'personal' | 'corporate'
  const [nameInput, setNameInput] = useState('배종호');
  const [corpNameInput, setCorpNameInput] = useState('마인오피스');
  const [corpCenterText, setCorpCenterText] = useState('대표이사'); // '대표이사' | '직인' | '인'
  const [stampColor, setStampColor] = useState('#cc1e1e'); // Red seal color
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);

  // Generate template options based on type
  const templates = stampType === 'personal' ? [
    { id: 'oval_3', name: '타원형 (기본)', shape: 'oval', appendIn: true, fontStyle: 'Gungseo' },
    { id: 'oval_simple', name: '타원형 (심플)', shape: 'oval', appendIn: false, fontStyle: 'Batang' },
    { id: 'square_bold', name: '사각 직인 (전통)', shape: 'square', appendIn: true, fontStyle: 'Gungseo' },
    { id: 'square_modern', name: '사각 직인 (현대)', shape: 'square', appendIn: true, fontStyle: 'Pretendard' },
    { id: 'circle_simple', name: '원형 개인인 (기본)', shape: 'circle', appendIn: true, fontStyle: 'Gungseo' },
    { id: 'circle_bold', name: '원형 개인인 (강조)', shape: 'circle', appendIn: true, fontStyle: 'Dotum' }
  ] : [
    { id: 'corp_star', name: '법인 대표인 (별 장식)', shape: 'corp_circle', symbol: '★', center: corpCenterText, fontStyle: 'Gungseo' },
    { id: 'corp_dot', name: '법인 대표인 (점 장식)', shape: 'corp_circle', symbol: '●', center: corpCenterText, fontStyle: 'Gungseo' },
    { id: 'corp_square', name: '법인 사각 직인', shape: 'square', appendIn: true, fontStyle: 'Gungseo' },
    { id: 'corp_circle_simple', name: '원형 법인인 (심플)', shape: 'corp_circle', symbol: '◆', center: corpCenterText, fontStyle: 'Batang' }
  ];

  // Helper to render stamp to a canvas element
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

    if (tpl.shape === 'oval') {
      // Personal Oval Stamp
      const radiusX = 65;
      const radiusY = 95;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.stroke();

      // Inner thin ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX - 4, radiusY - 4, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Format text
      let text = nameText.trim();
      if (tpl.appendIn && !text.endsWith('인')) {
        text += '인';
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fontName = tpl.fontStyle === 'Gungseo' ? 'Gungsuh, 궁서체, serif' : 'Pretendard, sans-serif';

      if (text.length <= 3) {
        // Render 3 chars vertically
        const fontSize = 42;
        ctx.font = `bold ${fontSize}px ${fontName}`;
        const charSpacing = 50;
        const startY = centerY - ((text.length - 1) * charSpacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], centerX, startY + i * charSpacing);
        }
      } else {
        // Render 4 chars in 2x2 grid
        const fontSize = 36;
        ctx.font = `bold ${fontSize}px ${fontName}`;
        // Right col (chars 0, 1), Left col (chars 2, 3) in traditional Korean order or standard
        ctx.fillText(text[0] || '', centerX + 18, centerY - 24);
        ctx.fillText(text[1] || '', centerX + 18, centerY + 24);
        ctx.fillText(text[2] || '', centerX - 18, centerY - 24);
        ctx.fillText(text[3] || '', centerX - 18, centerY + 24);
      }

    } else if (tpl.shape === 'square') {
      // Square Stamp
      const size = 170;
      const x = centerX - size / 2;
      const y = centerY - size / 2;

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
      const fontName = tpl.fontStyle === 'Gungseo' ? 'Gungsuh, 궁서체, serif' : 'Pretendard, sans-serif';

      if (text.length <= 4) {
        // 2x2 layout
        const fontSize = 44;
        ctx.font = `bold ${fontSize}px ${fontName}`;
        ctx.fillText(text[0] || '', centerX - 32, centerY - 32);
        ctx.fillText(text[1] || '', centerX + 32, centerY - 32);
        ctx.fillText(text[2] || '', centerX - 32, centerY + 32);
        ctx.fillText(text[3] || '', centerX + 32, centerY + 32);
      } else {
        // Multi-line vertical flow (e.g. 마인오피스인 -> 2 cols x 3 rows)
        const fontSize = 32;
        ctx.font = `bold ${fontSize}px ${fontName}`;
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
      // Simple Personal Circle Stamp
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
      const fontName = tpl.fontStyle === 'Gungseo' ? 'Gungsuh, 궁서체, serif' : 'Pretendard, sans-serif';

      if (text.length <= 3) {
        const fontSize = 40;
        ctx.font = `bold ${fontSize}px ${fontName}`;
        const spacing = 45;
        const startY = centerY - ((text.length - 1) * spacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], centerX, startY + i * spacing);
        }
      } else {
        const fontSize = 36;
        ctx.font = `bold ${fontSize}px ${fontName}`;
        ctx.fillText(text[0] || '', centerX - 25, centerY - 25);
        ctx.fillText(text[1] || '', centerX + 25, centerY - 25);
        ctx.fillText(text[2] || '', centerX - 25, centerY + 25);
        ctx.fillText(text[3] || '', centerX + 25, centerY + 25);
      }

    } else if (tpl.shape === 'corp_circle') {
      // Corporate Circular Stamp (Outer company ring + Inner Center title)
      const outerRadius = 88;
      const innerRadius = 42;

      // Outer border (double lines)
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius - 3.5, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner circle border
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const fontName = 'Gungsuh, 궁서체, serif';

      // Top Symbol (star / dot at 12 o'clock)
      ctx.font = `bold 14px ${fontName}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tpl.symbol || '★', centerX, centerY - outerRadius + 14);

      // Arc Text for Corporate Name along outer ring
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

      // Center Text (대표이사 / 직인)
      const centerTitle = corpCenterText.trim() || '대표이사';
      ctx.font = `bold 22px ${fontName}`;
      if (centerTitle.length <= 2) {
        ctx.fillText(centerTitle, centerX, centerY);
      } else {
        // 2x2 layout for 4 chars (대표이사)
        ctx.font = `bold 18px ${fontName}`;
        ctx.fillText(centerTitle[0] || '', centerX - 12, centerY - 12);
        ctx.fillText(centerTitle[1] || '', centerX + 12, centerY - 12);
        ctx.fillText(centerTitle[2] || '', centerX - 12, centerY + 12);
        ctx.fillText(centerTitle[3] || '', centerX + 12, centerY + 12);
      }
    }
  };

  // Download generated stamp image as transparent PNG
  const downloadStampPng = (tpl) => {
    const canvas = document.createElement('canvas');
    const nameText = stampType === 'personal' ? nameInput : corpNameInput;
    renderStampToCanvas(canvas, tpl, nameText, stampColor);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `electronic_stamp_${tpl.id}.png`;
    link.click();
  };

  // Use stamp in PDF signature mode
  const applyStampToPdf = (tpl) => {
    const canvas = document.createElement('canvas');
    const nameText = stampType === 'personal' ? nameInput : corpNameInput;
    renderStampToCanvas(canvas, tpl, nameText, stampColor);

    const dataUrl = canvas.toDataURL('image/png');
    if (onSelectStampForSign) {
      onSelectStampForSign(dataUrl);
    } else {
      alert('생성된 도장이 저장되었습니다! [PDF 서명] 기능에서 클릭하여 배치할 수 있습니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
          <Stamp className="w-4 h-4 text-rose-500" />
          <span>온라인 무제한 도장/인장 즉시 무료 생성</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          무료 전자 도장 만들기
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
          개인 도장부터 법인 대표이사 인장, 직인까지 원하는 이름으로 고품질 도장을 생성하세요.
        </p>
      </div>

      {/* Main Control & Preview Box */}
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
              <span>개인 도장 만들기</span>
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
              <span>법인 / 회사 도장 만들기</span>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          
          {stampType === 'personal' ? (
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
          )}

          {/* Color Chooser */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>인영 인쇄 색상:</span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[
                { color: '#cc1e1e', label: '전통 인목 빨강' },
                { color: '#b91c1c', label: '짙은 빨강' },
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

        {/* Generated Stamp Templates Grid (4x3 / 2x3 style like Donue reference) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>생성된 도장 스타일 목록 ({templates.length}개)</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              클릭하여 원하시는 도장을 다운로드하거나 서명에 사용하세요.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl, idx) => (
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition flex flex-col items-center justify-between space-y-4 group">
      
      {/* Badge / Title */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {tpl.name}
        </span>
        <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
          투명 PNG
        </span>
      </div>

      {/* Stamp Preview Canvas */}
      <div className="w-44 h-44 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition transform">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>

      {/* Actions */}
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
