import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Scissors, 
  Trash2, 
  Download, 
  FolderOpen, 
  CheckCircle2, 
  Loader2, 
  FileText,
  Layers,
  Settings
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function SplitStep() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'all'
  const [pageRange, setPageRange] = useState('1-2');
  const [isSplitting, setIsSplitting] = useState(false);
  const [resultFiles, setResultFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
        setFile(selected);
        setResultFiles([]);

        // Count pages using pdf-lib
        try {
          const bytes = await selected.arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          const count = pdfDoc.getPageCount();
          setTotalPages(count);
          setPageRange(count > 1 ? `1-${Math.min(count, 2)}` : '1');
        } catch (e) {
          console.error(e);
          alert('PDF 페이지 정보를 읽는 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let i = from; i <= to; i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p - 1); // 0-indexed
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;

    setIsSplitting(true);
    setResultFiles([]);

    try {
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);

      if (splitMode === 'range') {
        const targetIndices = parsePageRange(pageRange, totalPages);
        if (targetIndices.length === 0) {
          alert('유효한 페이지 범위를 입력해 주세요. (예: 1-3, 5)');
          setIsSplitting(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, targetIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const name = `${file.name.replace('.pdf', '')}_extracted_pages.pdf`;

        setResultFiles([{ name, url, pageCount: targetIndices.length }]);
      } else {
        // Extract all pages into separate PDFs
        const generated = [];
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
          newPdf.addPage(copiedPage);

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const name = `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`;
          generated.push({ name, url, pageCount: 1 });
        }
        setResultFiles(generated);
      }
    } catch (err) {
      console.error(err);
      alert('PDF 분할 중 오류가 발생했습니다.');
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!file ? (
        <div 
          {...getRootProps()}
          className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
            isDragActive 
              ? 'bg-purple-100 border-purple-600 dark:bg-slate-800 dark:border-purple-400' 
              : 'bg-purple-50/70 hover:bg-purple-100/70 border-purple-400 dark:bg-slate-800/60 dark:border-purple-500/80'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-10 flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Scissors className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              분할할 PDF 파일을 드롭하세요
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
              원하는 페이지 범위를 자유롭게 잘라내거나, 모든 페이지를 개별 파일로 즉시 나눌 수 있습니다.
            </p>

            <div className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base px-7 py-3 rounded-full shadow-lg shadow-purple-600/30 transition">
              <FolderOpen className="w-5 h-5" />
              <span>PDF 파일 선택</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-md space-y-6">
          
          {/* Header Info */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  전체 <span className="font-bold text-purple-600 dark:text-purple-400">{totalPages}</span> 페이지
                </p>
              </div>
            </div>

            <button
              onClick={() => { setFile(null); setResultFiles([]); }}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>다른 파일 선택</span>
            </button>
          </div>

          {/* Split Mode Selector */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-500" />
              <span>분할 방식 선택</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSplitMode('range')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  splitMode === 'range'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <h4 className="text-sm text-slate-900 dark:text-white font-extrabold mb-1">
                  1. 페이지 범위 지정 추출
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  원하는 페이지 번호나 범위만 골라서 하나의 PDF로 생성합니다.
                </p>
              </div>

              <div
                onClick={() => setSplitMode('all')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  splitMode === 'all'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <h4 className="text-sm text-slate-900 dark:text-white font-extrabold mb-1">
                  2. 모든 페이지 낱개 분할
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  모든 페이지를 1페이지짜리 개별 PDF 파일들로 자동 분리합니다.
                </p>
              </div>
            </div>

            {/* Range Input Option */}
            {splitMode === 'range' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  추출할 페이지 범위 (예: 1-3, 5)
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder={`1-${totalPages}`}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  콤마(,)와 하이픈(-)을 사용하여 페이지를 지정하세요. (1부터 {totalPages}까지)
                </p>
              </div>
            )}
          </div>

          {/* Trigger Button */}
          {resultFiles.length === 0 ? (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleSplit}
                disabled={isSplitting}
                className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 disabled:opacity-50 transition"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PDF 분할 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>PDF 분할 및 추출 실행</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Results Box */
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                    분할된 PDF 파일이 생성되었습니다! ({resultFiles.length}개)
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    원하시는 다운로드 버튼을 클릭하세요.
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 pt-2">
                {resultFiles.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {res.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.pageCount} 페이지
                      </p>
                    </div>
                    <a
                      href={res.url}
                      download={res.name}
                      className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>다운로드</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
