import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  FolderOpen, 
  CheckCircle2, 
  Loader2, 
  Plus,
  Sliders
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ImageToPdfStep() {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('auto'); // 'auto', 'portrait', 'landscape'
  const [margin, setMargin] = useState(20); // 0, 10, 20
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    const validImages = acceptedFiles.filter((f) => f.type.startsWith('image/'));
    if (validImages.length > 0) {
      const newItems = validImages.map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages((prev) => [...prev, ...newItems]);
      setPdfUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'] },
    multiple: true
  });

  const removeImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      return copy.filter((_, i) => i !== index);
    });
    setPdfUrl(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setPdfUrl(null);
  };

  const moveDown = (index) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setPdfUrl(null);
  };

  // Convert image file to PNG ArrayBuffer via offscreen Canvas for universal pdf-lib compatibility
  const processImageToPngBytes = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to blob failed'));
            return;
          }
          blob.arrayBuffer().then(resolve).catch(reject);
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setPdfUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const pngBytes = await processImageToPngBytes(item.file);
        const embeddedImg = await pdfDoc.embedPng(pngBytes);
        const { width: imgW, height: imgH } = embeddedImg;

        let pageW = 595.28; // A4 Width
        let pageH = 841.89; // A4 Height

        if (orientation === 'landscape') {
          pageW = 841.89;
          pageH = 595.28;
        } else if (orientation === 'auto') {
          if (imgW > imgH) {
            pageW = 841.89;
            pageH = 595.28;
          }
        }

        const page = pdfDoc.addPage([pageW, pageH]);

        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;

        const scale = Math.min(maxW / imgW, maxH / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;

        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        page.drawImage(embeddedImg, {
          x,
          y,
          width: drawW,
          height: drawH
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      alert('이미지 PDF 변환 중 오류가 발생했습니다.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {images.length === 0 ? (
        <div 
          {...getRootProps()}
          className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
            isDragActive 
              ? 'bg-emerald-100 border-emerald-600 dark:bg-slate-800 dark:border-emerald-400' 
              : 'bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-400 dark:bg-slate-800/60 dark:border-emerald-500/80'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-10 flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <ImageIcon className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              PDF로 변환할 이미지들을 드롭하세요
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
              JPG, PNG, WEBP 등 여러 이미지 파일을 하나의 고품질 PDF 문서로 손쉽게 묶어줍니다.
            </p>

            <div className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-7 py-3 rounded-full shadow-lg shadow-emerald-600/30 transition">
              <FolderOpen className="w-5 h-5" />
              <span>이미지 파일 선택</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-md space-y-6">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-emerald-500" />
                <span>선택된 이미지 목록 ({images.length}장)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                순서를 조정하고 PDF 설정을 지정하세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button 
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl transition"
                >
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span>이미지 추가</span>
                </button>
              </div>

              <button
                onClick={() => { setImages([]); setPdfUrl(null); }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 transition"
              >
                전체 삭제
              </button>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                <span>페이지 방향</span>
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none"
              >
                <option value="auto">자동 맞춤 (이미지 비율 유지)</option>
                <option value="portrait">세로 방향 (A4 Portrait)</option>
                <option value="landscape">가로 방향 (A4 Landscape)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                여백 설정
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none"
              >
                <option value={0}>여백 없음 (꽉 차게)</option>
                <option value={10}>좁은 여백 (10px)</option>
                <option value={20}>보통 여백 (20px)</option>
              </select>
            </div>
          </div>

          {/* Grid Preview of Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {images.map((item, idx) => (
              <div 
                key={idx}
                className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 overflow-hidden group shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.preview} 
                    alt={`Preview ${idx + 1}`}
                    className="object-contain w-full h-full" 
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {idx + 1}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
                    {item.file.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 rounded transition text-slate-600 dark:text-slate-300"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 rounded transition text-slate-600 dark:text-slate-300"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trigger Button */}
          {!pdfUrl ? (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>이미지 PDF 변환 중...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span>{images.length}장 이미지 PDF로 변환</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Result Box */
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                  이미지 PDF 변환이 완료되었습니다!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  생성된 PDF 문서를 지금 내려받으세요.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <a
                  href={pdfUrl}
                  download="converted_images.pdf"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>변환된 PDF 다운로드</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
