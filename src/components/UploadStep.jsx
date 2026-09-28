import React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  ShieldCheck, 
  Download, 
  FolderOpen, 
  CheckCircle2, 
  Star, 
  Cloud, 
  HardDrive, 
  Camera, 
  Link as LinkIcon,
  FileText
} from 'lucide-react';

export default function UploadStep({ onFileSelect }) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelect(file);
      } else {
        alert('PDF 파일만 업로드할 수 있습니다.');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
      {/* Title Area */}
      <div className="text-center max-w-3xl mb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          PDF 서명
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed font-medium">
          프린터나 스캐너 없이 사인을 그리거나 업로드하거나 촬영하여 계약서, 신청서, 양식에 전자 방식으로 사인하세요
        </p>

        {/* Check Points */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
          {[
            { label: '무료', desc: '100% Free' },
            { label: '온라인', desc: '웹 브라우저 즉시 설치 필요 없음' },
            { label: '제한 없음', desc: '무제한 이용 가능' },
            { label: '안전함', desc: '암호화 보안 처리' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main File Upload Box */}
      <div 
        {...getRootProps()}
        className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
          isDragActive 
            ? 'bg-blue-100 border-blue-600 scale-[1.01] dark:bg-slate-800 dark:border-blue-400' 
            : 'bg-blue-50 hover:bg-blue-100/70 border-blue-400 dark:bg-slate-800/70 dark:border-blue-500/80 dark:hover:bg-slate-800'
        }`}
      >
        <input {...getInputProps()} />

        <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[340px] sm:min-h-[380px]">
          
          {/* Top Bar inside Box */}
          <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>파일 보호 활성화</span>
            </div>
            
            <a
              href="#desktop-download"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>데스크톱 앱 다운로드</span>
            </a>
          </div>

          {/* Center Content inside Box */}
          <div className="flex flex-col items-center justify-center my-auto text-center space-y-4">
            {/* Orange Capsule Button */}
            <div className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all">
              <FolderOpen className="w-6 h-6 stroke-[2.5]" />
              <span>파일 선택</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
              ... 또는 여기에 파일을 놓으십시오
            </p>
          </div>

          {/* Bottom Bar inside Box */}
          <div className="flex flex-wrap items-center justify-between w-full pt-6 border-t border-blue-200/60 dark:border-slate-700/60 gap-4">
            
            {/* Bottom Left: Star Rating */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">4.9</span>
              <span className="text-gray-500 dark:text-gray-400">(12,450개 평가)</span>
            </div>

            {/* Bottom Right: Cloud Storage Icons */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button 
                title="Google 드라이브에서 가져오기"
                onClick={() => alert('Google 드라이브 연결 기능은 곧 준비될 예정입니다.')}
                className="p-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition flex items-center gap-1 text-xs font-medium"
              >
                <Cloud className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">Google 드라이브</span>
              </button>

              <button 
                title="Dropbox에서 가져오기"
                onClick={() => alert('Dropbox 연결 기능은 곧 준비될 예정입니다.')}
                className="p-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition flex items-center gap-1 text-xs font-medium"
              >
                <HardDrive className="w-4 h-4 text-sky-500" />
                <span className="hidden sm:inline">Dropbox</span>
              </button>

              <button 
                title="카메라 촬영"
                onClick={() => alert('카메라 웹캠 촬영 기능이 준비되어 있습니다.')}
                className="p-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition"
              >
                <Camera className="w-4 h-4 text-purple-500" />
              </button>

              <button 
                title="웹 URL에서 불러오기"
                onClick={() => alert('웹 URL PDF 불러오기 기능입니다.')}
                className="p-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition"
              >
                <LinkIcon className="w-4 h-4 text-emerald-500" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Quick Demo Sample Button */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">PDF 파일이 없으신가요?</span>
        <button
          onClick={() => {
            // Generate a sample standard blank/sample PDF blob
            createSamplePdfBlob().then(file => onFileSelect(file));
          }}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>샘플 계약서 문서로 테스트하기</span>
        </button>
      </div>

    </div>
  );
}

// Helper function to create a demo sample PDF file on the fly
async function createSamplePdfBlob() {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('STANDARD ELECTRONIC CONTRACT / AGREEMENT', {
    x: 50,
    y: 780,
    size: 18,
    font,
    color: rgb(0.12, 0.22, 0.54)
  });

  page.drawLine({
    start: { x: 50, y: 765 },
    end: { x: 545, y: 765 },
    thickness: 2,
    color: rgb(0.2, 0.4, 0.8)
  });

  const bodyTexts = [
    'Document Ref: PDF24-SIGN-2026-00912',
    'Date: September 21, 2026',
    'Subject: Electronic Document Signature Verification',
    '',
    'This is a sample PDF document created for testing digital electronic signatures.',
    'You can draw, type, or upload your signature using PDF24 Tools Clone app.',
    '',
    '1. Terms and Conditions: All digital signatures applied are encrypted and processed.',
    '2. Authentication: Instant transparent PNG signature overlay via pdf-lib.',
    '3. Privacy Guarantee: Files are processed client-side in your browser for 100% security.',
    '',
    '--------------------------------------------------------------------------------',
    'Signer Name: _______________________',
    'Signature Date: ____________________'
  ];

  let currentY = 720;
  bodyTexts.forEach(line => {
    page.drawText(line, {
      x: 50,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    currentY -= 24;
  });

  // Draw signature box target at bottom
  page.drawRectangle({
    x: 180,
    y: 120,
    width: 235,
    height: 90,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1.5
  });

  page.drawText('SIGNATURE AREA (서명란)', {
    x: 210,
    y: 195,
    size: 10,
    font,
    color: rgb(0.6, 0.6, 0.6)
  });

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], 'sample_contract.pdf', { type: 'application/pdf' });
}
