import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Hash, 
  Trash2, 
  Download, 
  FolderOpen, 
  CheckCircle2, 
  Loader2, 
  FileText,
  Sliders,
  Type
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PageNumberStep() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [position, setPosition] = useState('bottom-center'); // 'bottom-center', 'bottom-right', 'bottom-left', 'top-right', 'top-center'
  const [format, setFormat] = useState('page-total'); // 'page-total', 'simple', 'hyphen'
  const [skipCover, setSkipCover] = useState(false);
  const [fontSize, setFontSize] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
        setFile(selected);
        setPdfUrl(null);

        try {
          const bytes = await selected.arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          setTotalPages(pdfDoc.getPageCount());
        } catch (e) {
          console.error(e);
          alert('PDF 파일 페이지를 읽을 수 없습니다.');
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleApplyNumbers = async () => {
    if (!file || totalPages === 0) return;

    setIsProcessing(true);
    setPdfUrl(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        if (skipCover && index === 0) return;

        const pageNum = skipCover ? index : index + 1;
        const countTotal = skipCover ? totalPages - 1 : totalPages;

        let text = '';
        if (format === 'page-total') {
          text = `Page ${pageNum} of ${countTotal}`;
        } else if (format === 'slash') {
          text = `${pageNum} / ${countTotal}`;
        } else if (format === 'hyphen') {
          text = `- ${pageNum} -`;
        } else {
          text = `${pageNum}`;
        }

        const { width: pW, height: pH } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);

        let x = (pW - textWidth) / 2;
        let y = 30; // default bottom margin

        if (position === 'bottom-left') {
          x = 40;
        } else if (position === 'bottom-right') {
          x = pW - textWidth - 40;
        } else if (position === 'top-center') {
          y = pH - 35;
        } else if (position === 'top-right') {
          x = pW - textWidth - 40;
          y = pH - 35;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.2, 0.2, 0.2)
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      alert('페이지 번호 삽입 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!file ? (
        <div 
          {...getRootProps()}
          className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
            isDragActive 
              ? 'bg-amber-100 border-amber-600 dark:bg-slate-800 dark:border-amber-400' 
              : 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-400 dark:bg-slate-800/60 dark:border-amber-500/80'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-10 flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Hash className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              페이지 번호를 넣을 PDF를 드롭하세요
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
              상단/하단 원하는 위치에 1/페이지수, Page 1 등 다양한 넘버링 스타일을 자동으로 매겨줍니다.
            </p>

            <div className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base px-7 py-3 rounded-full shadow-lg shadow-amber-500/30 transition">
              <FolderOpen className="w-5 h-5" />
              <span>PDF 파일 선택</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-md space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  전체 <span className="font-bold text-amber-600 dark:text-amber-400">{totalPages}</span> 페이지
                </p>
              </div>
            </div>

            <button
              onClick={() => { setFile(null); setPdfUrl(null); }}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>다른 파일 선택</span>
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>페이지 번호 디자인 옵션</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Position */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  번호 위치
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none"
                >
                  <option value="bottom-center">하단 중앙 (Bottom Center)</option>
                  <option value="bottom-right">하단 우측 (Bottom Right)</option>
                  <option value="bottom-left">하단 좌측 (Bottom Left)</option>
                  <option value="top-right">상단 우측 (Top Right)</option>
                  <option value="top-center">상단 중앙 (Top Center)</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  표시 형식 (Format)
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none"
                >
                  <option value="page-total">Page 1 of {totalPages}</option>
                  <option value="slash">1 / {totalPages}</option>
                  <option value="hyphen">- 1 -</option>
                  <option value="simple">1</option>
                </select>
              </div>

              {/* Font size */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  글자 크기 (Font Size)
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none"
                >
                  <option value={9}>9 pt (작게)</option>
                  <option value={10}>10 pt (보통)</option>
                  <option value={12}>12 pt (크게)</option>
                  <option value={14}>14 pt (매우 크게)</option>
                </select>
              </div>

              {/* Cover page option */}
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={skipCover}
                    onChange={(e) => setSkipCover(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    첫 페이지(표지) 번호 제외하기
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!pdfUrl ? (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleApplyNumbers}
                disabled={isProcessing}
                className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-500/30 disabled:opacity-50 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>페이지 번호 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Hash className="w-5 h-5" />
                    <span>페이지 번호 적용하기</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                  페이지 번호 적용이 완료되었습니다!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  완성된 PDF 문서를 다운로드하세요.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <a
                  href={pdfUrl}
                  download={`${file.name.replace('.pdf', '')}_numbered.pdf`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>완성된 PDF 다운로드</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
