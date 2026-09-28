import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FilePlus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  ShieldCheck, 
  FolderOpen, 
  CheckCircle2, 
  Loader2,
  FileText,
  Plus
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function MergeStep() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [mergedFilename, setMergedFilename] = useState('merged_document.pdf');

  const onDrop = (acceptedFiles) => {
    const pdfOnly = acceptedFiles.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (pdfOnly.length > 0) {
      setFiles((prev) => [...prev, ...pdfOnly]);
      setMergedPdfUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      const temp = newFiles[index - 1];
      newFiles[index - 1] = newFiles[index];
      newFiles[index] = temp;
      return newFiles;
    });
    setMergedPdfUrl(null);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      const temp = newFiles[index + 1];
      newFiles[index + 1] = newFiles[index];
      newFiles[index] = temp;
      return newFiles;
    });
    setMergedPdfUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('PDF를 합치려면 최소 2개 이상의 PDF 파일이 필요합니다.');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (err) {
      console.error('PDF Merge Error:', err);
      alert('PDF 파일 합치기 중 오류가 발생했습니다. 보호되지 않은 PDF 파일인지 확인해 주세요.');
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Upload Zone */}
      {files.length === 0 ? (
        <div 
          {...getRootProps()}
          className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
            isDragActive 
              ? 'bg-indigo-100 border-indigo-600 dark:bg-slate-800 dark:border-indigo-400' 
              : 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-400 dark:bg-slate-800/60 dark:border-indigo-500/80'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-10 flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <FilePlus className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              합칠 PDF 파일들을 끌어다 놓으세요
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
              여러 개의 PDF 파일을 한 번에 선택하거나 이곳에 드롭하세요. 순서를 자유롭게 조정하고 하나로 합칠 수 있습니다.
            </p>

            <div className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base px-7 py-3 rounded-full shadow-lg shadow-indigo-600/30 transition">
              <FolderOpen className="w-5 h-5" />
              <span>PDF 파일들 선택하기</span>
            </div>
          </div>
        </div>
      ) : (
        /* File list & ordering area */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-md space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FilePlus className="w-6 h-6 text-indigo-500" />
                <span>선택된 PDF 목록 ({files.length}개)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                위/아래 화살표를 눌러 합칠 순서를 변경하세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button 
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl transition"
                >
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span>파일 추가</span>
                </button>
              </div>

              <button
                onClick={() => { setFiles([]); setMergedPdfUrl(null); }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 transition"
              >
                전체 삭제
              </button>
            </div>
          </div>

          {/* List of files */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Actions: Reorder & Remove */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition"
                    title="위로 이동"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition"
                    title="아래로 이동"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition ml-1"
                    title="파일 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Trigger Button */}
          {!mergedPdfUrl ? (
            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                onClick={handleMerge}
                disabled={isMerging || files.length < 2}
                className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PDF 병합 처리 중...</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="w-5 h-5" />
                    <span>{files.length}개 PDF 합치기</span>
                  </>
                )}
              </button>
              {files.length < 2 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  ⚠️ PDF를 합치려면 파일이 최소 2개 이상 필요합니다. [파일 추가] 버튼을 눌러주세요.
                </p>
              )}
            </div>
          ) : (
            /* Success Download Box */
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                  PDF 합치기가 완료되었습니다!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  아래 버튼을 눌러 완성된 PDF 문서를 내려받으세요.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={mergedPdfUrl}
                  download={mergedFilename}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>병합된 PDF 다운로드</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
