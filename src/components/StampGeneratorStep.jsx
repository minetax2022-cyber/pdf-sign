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
  const [stampType, setStampType] = useState('corporate'); // 'corporate' | 'personal'
  const [corpShapeFilter, setCorpShapeFilter] = useState('circle'); // 'circle' | 'square' | 'all'
  const [personalShapeFilter, setPersonalShapeFilter] = useState('all'); // 'all' | 'oval' | 'circle' | 'square'
  
  // Inputs
  const [nameInput, setNameInput] = useState('배종호');
  const [corpNameInput, setCorpNameInput] = useState('주식회사 마인오피스');
  const [corpCenterText, setCorpCenterText] = useState('代表理事'); // '代表理事' | '대표이사' | '직인' | '인'
  const [stampColor, setStampColor] = useState('#C82323'); // Authentic Seal Red (#C82323 / #D92B2B)

  // 6 Font Styles List with heavy weight stroke multipliers:
  const fontStylesList = [
    { fontKey: 'jeonseo', fontName: '전서체(소전/구첩전)', desc: '90%+ 밀집 구첩전서체 (인장 획 꽉 채움)', fontCss: 'Gungsuh, 궁서체, Nanum Myeongjo, serif', stretchX: 1.2, stretchY: 1.35, strokeW: 2.5 },
    { fontKey: 'inseo', fontName: '인서체', desc: '정방형 굵은 인서체 (직인선 꽉 채움)', fontCss: 'Nanum Myeongjo, Batang, 바탕체, serif', stretchX: 1.25, stretchY: 1.3, strokeW: 2.2 },
    { fontKey: 'haeseo', fontName: '해서체', desc: '정갈하고 묵직한 해서체', fontCss: 'Nanum Myeongjo, BatangChe, serif', stretchX: 1.1, stretchY: 1.2, strokeW: 1.8 },
    { fontKey: 'goin', fontName: '고인체', desc: '두터운 고인체 (묵직한 사각형 인장)', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.3, stretchY: 1.4, strokeW: 2.8 },
    { fontKey: 'yeseo', fontName: '예서체', desc: '횡선 강조 예서체', fontCss: 'Malgun Gothic, 맑은 고딕, sans-serif', stretchX: 1.15, stretchY: 1.15, strokeW: 1.6 },
    { fontKey: 'hunmin', fontName: '훈민정음체', desc: '훈민정음 원문체 (목판본)', fontCss: 'Pretendard, Gothic, sans-serif', stretchX: 1.1, stretchY: 1.1, strokeW: 1.5 }
  ];

  // Personal Templates: half '이름만' (3-char), half ''인' 포함' (4-char)
  const allPersonalTemplates = [
    // 🥚 타원형 (Oval)
    { id: 'p_oval_name_1', name: '타원형 [전서체 - 이름만]', shape: 'oval', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.1, stretchY: 1.25, strokeW: 1.8, desc: '이름만 표기 (배종호)' },
    { id: 'p_oval_in_1', name: '타원형 [전서체 - 인 포함]', shape: 'oval', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.1, stretchY: 1.25, strokeW: 1.8, desc: '이름+인 4자 (배종호인)' },
    { id: 'p_oval_name_2', name: '타원형 [인서체 - 이름만]', shape: 'oval', appendIn: false, fontName: '인서체', fontCss: 'Nanum Myeongjo, 바탕체, serif', stretchX: 1.15, stretchY: 1.3, strokeW: 2.0, desc: '이름만 표기 (배종호)' },
    { id: 'p_oval_in_2', name: '타원형 [인서체 - 인 포함]', shape: 'oval', appendIn: true, fontName: '인서체', fontCss: 'Nanum Myeongjo, 바탕체, serif', stretchX: 1.15, stretchY: 1.3, strokeW: 2.0, desc: '이름+인 4자 (배종호인)' },

    // 🔳 네모/정사각형 (Square)
    { id: 'p_sq_name_1', name: '정사각형 [전서체 - 이름만]', shape: 'square', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.15, stretchY: 1.3, strokeW: 2.2, desc: '이름 3자 꽉 차게 (배종호)' },
    { id: 'p_sq_in_1', name: '정사각형 [전서체 - 인 포함]', shape: 'square', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.15, stretchY: 1.3, strokeW: 2.2, desc: '이름+인 2x2격자 (배종호인)' },
    { id: 'p_sq_name_2', name: '정사각형 [인서체 - 이름만]', shape: 'square', appendIn: false, fontName: '인서체', fontCss: 'Nanum Myeongjo, 바탕체, serif', stretchX: 1.2, stretchY: 1.3, strokeW: 2.4, desc: '이름 3자 꽉 차게 (배종호)' },
    { id: 'p_sq_in_2', name: '정사각형 [인서체 - 인 포함]', shape: 'square', appendIn: true, fontName: '인서체', fontCss: 'Nanum Myeongjo, 바탕체, serif', stretchX: 1.2, stretchY: 1.3, strokeW: 2.4, desc: '이름+인 2x2격자 (배종호인)' },

    // ⭕ 둥근 원형 (Circle)
    { id: 'p_circ_name_1', name: '원형 [전서체 - 이름만]', shape: 'circle', appendIn: false, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.1, stretchY: 1.25, strokeW: 2.0, desc: '이름만 표기 (배종호)' },
    { id: 'p_circ_in_1', name: '원형 [전서체 - 인 포함]', shape: 'circle', appendIn: true, fontName: '전서체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.1, stretchY: 1.25, strokeW: 2.0, desc: '이름+인 2x2격자 (배종호인)' },
    { id: 'p_circ_name_2', name: '원형 [해서체 - 이름만]', shape: 'circle', appendIn: false, fontName: '해서체', fontCss: 'Nanum Myeongjo, BatangChe, serif', stretchX: 1.0, stretchY: 1.1, strokeW: 1.6, desc: '이름만 표기 (배종호)' },
    { id: 'p_circ_in_2', name: '원형 [고인체 - 인 포함]', shape: 'circle', appendIn: true, fontName: '고인체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.25, stretchY: 1.35, strokeW: 2.5, desc: '이름+인 2x2격자 (배종호인)' }
  ];

  let personalTemplates = [];
  if (personalShapeFilter === 'all') {
    personalTemplates = allPersonalTemplates;
  } else {
    personalTemplates = allPersonalTemplates.filter((t) => t.shape === personalShapeFilter);
  }

  // Corporate Templates (Ultra-thick, 90%+ filled circular representative seals + square seals)
  const corporateCircleTemplates = [
    { id: 'corp_c_1', name: '정통 법인 대표인 [전서체 / 한자 代表理事 / 점 ●]', shape: 'corp_circle', symbol: '●', center: '代表理事', fontName: '전서체(소전/구첩전)', fontCss: 'Gungsuh, 궁서체, Nanum Myeongjo, serif', stretchX: 1.2, stretchY: 1.35, strokeW: 2.6, desc: '첨부 이미지와 100% 동일한 정통 한자 대표인 (90%+ 꽉 찬 구첩전)' },
    { id: 'corp_c_2', name: '정통 법인 대표인 [전서체 / 한글 대표이사 / 점 ●]', shape: 'corp_circle', symbol: '●', center: '대표이사', fontName: '전서체(소전)', fontCss: 'Gungsuh, 궁서체, Nanum Myeongjo, serif', stretchX: 1.2, stretchY: 1.35, strokeW: 2.6, desc: '90%+ 꽉 찬 한글 전서체 대표인 (대표이사)' },
    { id: 'corp_c_3', name: '정통 법인 대표인 [인서체 / 한자 代表理事 / 점 ●]', shape: 'corp_circle', symbol: '●', center: '代表理事', fontName: '인서체', fontCss: 'Nanum Myeongjo, Batang, 바탕체, serif', stretchX: 1.25, stretchY: 1.3, strokeW: 2.4, desc: '직인선이 굵고 꽉 찬 정방형 한자 대표인' },
    { id: 'corp_c_4', name: '정통 법인 대표인 [인서체 / 한글 대표이사 / 점 ●]', shape: 'corp_circle', symbol: '●', center: '대표이사', fontName: '인서체', fontCss: 'Nanum Myeongjo, Batang, 바탕체, serif', stretchX: 1.25, stretchY: 1.3, strokeW: 2.4, desc: '직인선이 굵고 꽉 찬 한글 대표인' },
    { id: 'corp_c_5', name: '정통 법인 대표인 [고인체 / 한자 代表理事 / 별 ★]', shape: 'corp_circle', symbol: '★', center: '代表理事', fontName: '고인체', fontCss: 'Gungsuh, 궁서체, serif', stretchX: 1.3, stretchY: 1.4, strokeW: 2.8, desc: '별 장식 묵직한 고인체 한자 대표인' },
    { id: 'corp_c_6', name: '정통 법인 대표인 [해서체 / 한자 代表理事 / 점 ●]', shape: 'corp_circle', symbol: '●', center: '代表理事', fontName: '해서체', fontCss: 'Nanum Myeongjo, BatangChe, serif', stretchX: 1.1, stretchY: 1.2, strokeW: 1.8, desc: '정갈하고 선명한 해서체 한자 대표인' }
  ];

  const corporateSquareTemplates = fontStylesList.map((f) => ({
    id: `corp_sq_${f.fontKey}`,
    name: `법인 사각 직인 [${f.fontName}]`,
    shape: 'square',
    appendIn: true,
    fontName: f.fontName,
    fontCss: f.fontCss,
    stretchX: f.stretchX,
    stretchY: f.stretchY,
    strokeW: f.strokeW,
    desc: f.desc
  }));

  let corporateTemplates = [];
  if (corpShapeFilter === 'circle') {
    corporateTemplates = corporateCircleTemplates;
  } else if (corpShapeFilter === 'square') {
    corporateTemplates = corporateSquareTemplates;
  } else {
    corporateTemplates = [...corporateCircleTemplates, ...corporateSquareTemplates];
  }

  const templates = stampType === 'personal' ? personalTemplates : corporateTemplates;

  // Ultra-thick, 90%+ Fill High-Precision Seal Canvas Rendering Engine
  const renderStampToCanvas = (canvas, tpl, rawText, color) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 280;
    const height = 280;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const centerX = width / 2;
    const centerY = height / 2;

    const fontName = tpl.fontCss || 'Nanum Myeongjo, Gungsuh, serif';
    const stretchX = tpl.stretchX || 1.15;
    const stretchY = tpl.stretchY || 1.25;
    const extraStrokeW = tpl.strokeW || 2.2;

    let text = rawText.trim();
    if (tpl.appendIn && !text.endsWith('인')) {
      text += '인';
    }

    if (tpl.shape === 'oval') {
      // Personal Oval Stamp (Heavy Filled Border & Text)
      const radiusX = 72;
      const radiusY = 108;

      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX - 4.5, radiusY - 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        const fontSize = 48;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const spacing = 58;
        const startY = centerY - ((text.length - 1) * spacing) / 2;

        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(text[i], 0, 0);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else {
        const fontSize = 42;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const pos = [
          { x: centerX + 22, y: centerY - 28, char: text[0] },
          { x: centerX + 22, y: centerY + 28, char: text[1] },
          { x: centerX - 22, y: centerY - 28, char: text[2] },
          { x: centerX - 22, y: centerY + 28, char: text[3] }
        ];
        pos.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'square') {
      // Square Seal Stamp (정사각형 직인 - 획이 두껍고 네모반듯하게 꽉 차게)
      const size = 196;
      const x = centerX - size / 2;
      const y = centerY - size / 2;

      ctx.lineWidth = 7;
      ctx.strokeRect(x, y, size, size);

      ctx.lineWidth = 2.2;
      ctx.strokeRect(x + 5, y + 5, size - 10, size - 10);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        // Vertical 3-char name only
        const fontSize = 52;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const spacing = 56;
        const startY = centerY - ((text.length - 1) * spacing) / 2;

        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(text[i], 0, 0);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else if (text.length <= 4) {
        // 4-char 2x2 Grid (90%+ Fill Quadrants)
        const fontSize = 52;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const positions = [
          { x: centerX - 38, y: centerY - 38, char: text[0] },
          { x: centerX + 38, y: centerY - 38, char: text[1] },
          { x: centerX - 38, y: centerY + 38, char: text[2] },
          { x: centerX + 38, y: centerY + 38, char: text[3] }
        ];

        positions.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      } else {
        // Multi-character corporate square seal
        const fontSize = 38;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const half = Math.ceil(text.length / 2);
        const col1 = text.slice(0, half);
        const col2 = text.slice(half);

        col1.split('').forEach((ch, idx) => {
          ctx.save();
          ctx.translate(centerX - 35, centerY - 45 + idx * 42);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(ch, 0, 0);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });

        col2.split('').forEach((ch, idx) => {
          ctx.save();
          ctx.translate(centerX + 35, centerY - 45 + idx * 42);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(ch, 0, 0);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'circle') {
      // Circle Personal Stamp
      const radius = 92;
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (text.length <= 3) {
        const fontSize = 48;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const spacing = 52;
        const startY = centerY - ((text.length - 1) * spacing) / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.save();
          ctx.translate(centerX, startY + i * spacing);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(text[i], 0, 0);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      } else {
        const fontSize = 42;
        ctx.font = `900 ${fontSize}px ${fontName}`;
        ctx.lineWidth = extraStrokeW;
        const positions = [
          { x: centerX - 28, y: centerY - 28, char: text[0] },
          { x: centerX + 28, y: centerY - 28, char: text[1] },
          { x: centerX - 28, y: centerY + 28, char: text[2] },
          { x: centerX + 28, y: centerY + 28, char: text[3] }
        ];
        positions.forEach((p) => {
          if (!p.char) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(stretchX, stretchY);
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      }

    } else if (tpl.shape === 'corp_circle') {
      // Ultra-authentic Corporate Circular Representative Seal (Exact proportion of attached screenshot)
      const outerRadius = 112; // Outer Circle Frame
      const innerRadius = 58;  // Inner Center Circle Frame

      // 1. Outer Double Circle Borders
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius - 4.5, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Inner Circle Border Frame
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Top Red Dot (12 o'clock center)
      const symbolChar = tpl.symbol || '●';
      if (symbolChar === '●') {
        ctx.beginPath();
        ctx.arc(centerX, centerY - outerRadius + 18, 6.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = `900 18px ${fontName}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbolChar, centerX, centerY - outerRadius + 18);
      }

      // 4. Outer Ring Arc Text (Company Name: e.g. 주식회사 마인오피스)
      // Height of outer ring gap: outerRadius(112) - innerRadius(58) = 54px.
      // Font size: 24px + stretch + stroke outline to touch outer and inner circle borders cleanly!
      const corpText = corpNameInput.trim() || '주식회사 마인오피스';
      const numChars = corpText.length;
      const angleStep = Math.PI / Math.max(numChars + 1.2, 7.5);
      const startAngle = -Math.PI / 2 - ((numChars - 1) * angleStep) / 2;

      ctx.font = `900 24px ${fontName}`;
      ctx.lineWidth = 1.8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < numChars; i++) {
        const angle = startAngle + i * angleStep;
        const charRadius = outerRadius - 25;
        const x = centerX + charRadius * Math.cos(angle);
        const y = centerY + charRadius * Math.sin(angle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.scale(1.15, 1.4); // Stretch text radially to fill outer ring width completely!
        ctx.strokeText(corpText[i], 0, 0);
        ctx.fillText(corpText[i], 0, 0);
        ctx.restore();
      }

      // 5. Center Inner Circle Text (90%+ Fill Area: 대표이사 or 代表理事)
      const centerTitle = tpl.center || corpCenterText || '代表理事';
      ctx.font = `900 32px ${fontName}`;
      ctx.lineWidth = extraStrokeW;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (centerTitle.length === 4) {
        // Traditional Seal Grid Layout (代/表 right col, 理/事 left col)
        // Filling 90%+ of inner circle (innerRadius 58px)
        const pos = [
          { x: centerX + 23, y: centerY - 23, char: centerTitle[0] },
          { x: centerX + 23, y: centerY + 23, char: centerTitle[1] },
          { x: centerX - 23, y: centerY - 23, char: centerTitle[2] },
          { x: centerX - 23, y: centerY + 23, char: centerTitle[3] }
        ];

        pos.forEach((p) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(stretchX, stretchY); // Scale to stretch into grid corners
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      } else {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(stretchX, stretchY);
        ctx.strokeText(centerTitle, 0, 0);
        ctx.fillText(centerTitle, 0, 0);
        ctx.restore();
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
    link.download = `corporate_stamp_${tpl.fontName || tpl.id}.png`;
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
          <span>마인 간편PDF / 전자서명 — 90%+ 꽉 찬 정통 법인 대표인 생성기</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          무료 전자 도장 만들기
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
          실제 법인 인감 규격에 맞춰 여백 없이 90%+ 꽉 차고 획이 굵은 정통 법인 대표인(한자 代表理事 / 한글 대표이사) 및 사각 직인을 생성합니다.
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Type Switcher: 법인/회사 도장 vs 개인 도장 */}
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
              <span>법인 / 회사 도장 (90%+ 꽉 찬 정통 대표인 & 직인)</span>
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
              <span>개인 도장 (이름만 & 인 포함)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Inputs Bar */}
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
                  maxLength={16}
                  placeholder="예: 주식회사 마인오피스 또는 마인오피스"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  중앙 대표인 표기:
                </label>
                <select
                  value={corpCenterText}
                  onChange={(e) => setCorpCenterText(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
                >
                  <option value="代表理事">代表理事 (한자 정통)</option>
                  <option value="대표이사">대표이사 (한글)</option>
                  <option value="직인">직인 (한글)</option>
                  <option value="인">인 (한글)</option>
                </select>
              </div>
            </>
          ) : (
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
          )}

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>인영 색상 통일:</span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[
                { color: '#C82323', label: '정통 인주 빨강 (#C82323)' },
                { color: '#D92B2B', label: '선명한 인주 빨강 (#D92B2B)' },
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
              도장 형태 구분:
            </span>
            <div className="flex gap-1.5">
              {stampType === 'corporate' ? (
                [
                  { id: 'circle', label: '원형 대표이사 인장 (한자/한글)', icon: Circle },
                  { id: 'square', label: '정사각형 법인 직인 (6대 서체)', icon: Square },
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
                })
              ) : (
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
              )}
            </div>
          </div>

          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
            {stampType === 'corporate' ? '✨ 실제 법인 인감 규격 90%+ 꽉 찬 굵은 인장선 적용' : '✨ 이름만 & 인 포함 디자인 구성'}
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
      <div className="w-52 h-52 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition transform duration-200">
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
