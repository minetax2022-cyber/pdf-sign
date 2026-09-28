import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Download, 
  RotateCcw, 
  PenTool, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Trash2, 
  Sparkles,
  ArrowLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';
import SignatureModal from './SignatureModal';

// Set pdfjs worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function SignatureStep({ file, onBackToUpload }) {
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  // PDF render canvas ref
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDocProxy, setPdfDocProxy] = useState(null);

  // Signature state
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  // Position & size of signature on canvas
  const [sigPosition, setSigPosition] = useState({ x: 35, y: 70 }); // percentages (0-100)
  const [sigWidth, setSigWidth] = useState(180); // in pixels (default 180px)

  // Drag & Resize interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ 
    x: 0, 
    y: 0, 
    initialSigX: 0, 
    initialSigY: 0, 
    initialWidth: 180 
  });

  // Load PDF file via PDFJS
  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    setIsPdfLoading(true);

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        const pdfDoc = await loadingTask.promise;

        if (isMounted) {
          setPdfDocProxy(pdfDoc);
          setNumPages(pdfDoc.numPages);
          setIsPdfLoading(false);
        }
      } catch (err) {
        console.error('Failed to load PDF via PDFJS:', err);
        setIsPdfLoading(false);
      }
    };
    fileReader.readAsArrayBuffer(file);

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Render PDF page
  useEffect(() => {
    if (!pdfDocProxy || !canvasRef.current) return;

    let renderTask = null;
    const renderPage = async () => {
      try {
        const page = await pdfDocProxy.getPage(currentPage);
        const viewport = page.getViewport({ scale: zoomLevel * 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDocProxy, currentPage, zoomLevel]);

  // Handle Drag Move (Mouse & Touch)
  const handleDragStart = (e) => {
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialSigX: sigPosition.x,
      initialSigY: sigPosition.y,
      initialWidth: sigWidth
    };
  };

  // Handle Resize Corner Start (Mouse & Touch)
  const handleResizeStart = (e) => {
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsResizing(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialSigX: sigPosition.x,
      initialSigY: sigPosition.y,
      initialWidth: sigWidth
    };
  };

  // Mouse / Touch Move Listener
  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = containerRef.current.getBoundingClientRect();

      if (isDragging) {
        const deltaXPercent = ((clientX - dragStartRef.current.x) / rect.width) * 100;
        const deltaYPercent = ((clientY - dragStartRef.current.y) / rect.height) * 100;

        let newX = dragStartRef.current.initialSigX + deltaXPercent;
        let newY = dragStartRef.current.initialSigY + deltaYPercent;

        newX = Math.max(0, Math.min(85, newX));
        newY = Math.max(0, Math.min(85, newY));

        setSigPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = clientX - dragStartRef.current.x;
        let newWidth = dragStartRef.current.initialWidth + deltaX;

        // Clamp width between 60px and 450px
        newWidth = Math.max(60, Math.min(450, newWidth));
        setSigWidth(newWidth);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing]);

  // PDF Synthesis & Download using pdf-lib
  const handleCompleteAndDownload = async () => {
    if (!signatureDataUrl) {
      alert('먼저 서명을 생성하여 PDF에 배치해 주세요!');
      setIsSigModalOpen(true);
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();
      const targetPageIndex = Math.min(currentPage - 1, pages.length - 1);
      const targetPage = pages[targetPageIndex];
      const { width: pagePdfWidth, height: pagePdfHeight } = targetPage.getSize();

      const pngImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
      const embeddedPng = await pdfDoc.embedPng(pngImageBytes);

      const pngDims = embeddedPng.scale(1.0);
      const aspectRatio = pngDims.width / pngDims.height;

      const containerWidthPx = containerRef.current ? containerRef.current.getBoundingClientRect().width : 550;
      const pdfSigWidth = (sigWidth / containerWidthPx) * pagePdfWidth;
      const pdfSigHeight = pdfSigWidth / aspectRatio;

      const pdfSigX = (sigPosition.x / 100) * pagePdfWidth;
      const pdfSigY = pagePdfHeight - ((sigPosition.y / 100) * pagePdfHeight) - pdfSigHeight;

      targetPage.drawImage(embeddedPng, {
        x: Math.max(0, pdfSigX),
        y: Math.max(0, pdfSigY),
        width: pdfSigWidth,
        height: pdfSigHeight
      });

      const signedPdfBytes = await pdfDoc.save();

      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const baseName = file.name.replace(/\.pdf$/i, '');
      link.download = `${baseName}_signed.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      console.error('Failed to composite PDF signature:', err);
      alert('PDF 서명합성 중 오류가 발생했습니다: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Top Bar Navigation */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Back & File Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUpload}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>파일 변경</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {file.name}
              </h2>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(1)} KB • 총 {numPages}페이지
              </span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls & Zoom */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800 text-xs font-semibold">
          
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-800 dark:text-gray-200 px-1">
              {currentPage} / {numPages}
            </span>
            <button
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
              className="p-1 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-4 bg-gray-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition"
              title="축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-gray-700 dark:text-gray-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
              className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition"
              title="확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Signature Creation Trigger */}
        <button
          onClick={() => setIsSigModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:scale-[1.02]"
        >
          <PenTool className="w-4 h-4 stroke-[2.5]" />
          <span>{signatureDataUrl ? '서명 재작성 / 변경' : '+ 서명 만들기'}</span>
        </button>

      </div>

      {/* Main Preview & Signature Placement Canvas Area */}
      <div className="w-full flex flex-col items-center mb-8">
        
        {/* Workspace Instruction Badge */}
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>서명 위치는 드래그로 이동하고, <b>우측 하단 핸들(🟠)</b>을 끌거나 상단 <b>[ - ] [ + ] 버튼</b>으로 크기를 자유롭게 조절하세요</span>
        </div>

        {/* PDF Page Container */}
        <div 
          ref={containerRef}
          className="relative bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex items-center justify-center transition-all duration-200"
          style={{ width: `${Math.min(750, 550 * zoomLevel)}px` }}
        >
          {isPdfLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-20">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">PDF 문서 렌더링 중...</span>
            </div>
          )}

          {/* HTML5 Canvas for PDF Page */}
          <canvas ref={canvasRef} className="w-full h-auto block select-none pointer-events-none" />

          {/* Draggable & Resizable Signature Overlay */}
          {signatureDataUrl ? (
            <div
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                top: `${sigPosition.y}%`,
                left: `${sigPosition.x}%`,
                width: `${sigWidth}px`
              }}
              className={`absolute cursor-move select-none z-30 group p-1.5 rounded-lg border-2 transition-shadow ${
                isDragging || isResizing 
                  ? 'border-orange-500 bg-orange-500/10 shadow-2xl scale-[1.01]' 
                  : 'border-blue-500 hover:border-orange-500 bg-blue-500/5 hover:bg-orange-500/10'
              }`}
            >
              <img
                src={signatureDataUrl}
                alt="Signature Overlay"
                className="w-full h-auto pointer-events-none filter drop-shadow select-none"
              />

              {/* Top Handle Bar: Size Controls & Move Badge */}
              <div className="absolute -top-9 left-0 right-0 flex items-center justify-between pointer-events-auto">
                
                {/* Move Badge */}
                <div className="bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Move className="w-3 h-3 text-orange-400" />
                  <span>드래그 이동</span>
                </div>

                {/* Quick Resize Buttons */}
                <div className="flex items-center gap-1 bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSigWidth(prev => Math.max(60, prev - 25));
                    }}
                    className="hover:text-orange-400 p-0.5"
                    title="서명 축소"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-bold text-orange-300 px-0.5">
                    {Math.round(sigWidth)}px
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSigWidth(prev => Math.min(450, prev + 25));
                    }}
                    className="hover:text-orange-400 p-0.5"
                    title="서명 확대"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

              </div>

              {/* Delete Button (Top-Right Handle) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSignatureDataUrl(null);
                }}
                className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg text-xs font-bold transition pointer-events-auto"
                title="서명 지우기"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* CORNER RESIZE HANDLE (Bottom-Right) */}
              <div
                onMouseDown={handleResizeStart}
                onTouchStart={handleResizeStart}
                className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 hover:bg-orange-600 border-2 border-white rounded-full flex items-center justify-center cursor-nwse-resize shadow-lg z-40 transform hover:scale-125 transition pointer-events-auto"
                title="드래그하여 크기 조절"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>

              {/* Bottom-Left Resize Handle indicator */}
              <div
                onMouseDown={handleResizeStart}
                onTouchStart={handleResizeStart}
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md opacity-70 hover:opacity-100 transition pointer-events-auto"
                title="드래그하여 크기 조절"
              />

            </div>
          ) : (
            <div className="absolute z-20 inset-x-8 bottom-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-2 border-dashed border-orange-400 rounded-2xl p-6 text-center shadow-lg">
              <PenTool className="w-10 h-10 text-orange-500 mx-auto mb-2 animate-bounce" />
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                아직 생성된 서명이 없습니다
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                상단의 '+ 서명 만들기' 버튼을 눌러 손으로 그리거나 이름을 입력하세요.
              </p>
              <button
                onClick={() => setIsSigModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md transition"
              >
                지금 서명 그리기
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Floating Action Bar: Reset & Complete Signature Download */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky bottom-4 z-30">
        
        {/* Reset Button */}
        <button
          onClick={() => {
            setSignatureDataUrl(null);
            setSigPosition({ x: 35, y: 70 });
            setSigWidth(180);
          }}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm transition"
        >
          <RotateCcw className="w-4 h-4 text-rose-500" />
          <span>서명 초기화</span>
        </button>

        {/* Primary Download Button */}
        <button
          onClick={handleCompleteAndDownload}
          className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>PDF 서명 완료 및 다운로드</span>
        </button>

      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSaveSignature={(dataUrl) => {
          setSignatureDataUrl(dataUrl);
          setIsSigModalOpen(false);
        }}
      />

    </div>
  );
}
