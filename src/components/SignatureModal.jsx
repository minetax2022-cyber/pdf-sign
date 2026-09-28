import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { 
  X, 
  RotateCcw, 
  Check, 
  PenTool, 
  Type, 
  Image as ImageIcon,
  Palette,
  Sparkles
} from 'lucide-react';

export default function SignatureModal({ isOpen, onClose, onSaveSignature }) {
  const sigCanvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' | 'type' | 'upload'
  
  // Drawing state
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);

  // Type state
  const [typedText, setTypedText] = useState('');
  const [selectedFont, setSelectedFont] = useState('font-handwriting-1');
  const [textColor, setTextColor] = useState('#000000');

  // Upload state
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);

  if (!isOpen) return null;

  // Clear drawing canvas
  const handleClearDraw = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  // Convert typed text to PNG Data URL
  const generateTypedSignatureDataUrl = () => {
    if (!typedText.trim()) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Font mapping
    let fontFamilyName = 'Caveat, cursive';
    if (selectedFont === 'font-handwriting-2') fontFamilyName = 'Dancing Script, cursive';
    if (selectedFont === 'font-handwriting-3') fontFamilyName = 'Pacifico, cursive';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `64px ${fontFamilyName}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  };

  // Handle uploaded image file
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Signature Action
  const handleSave = () => {
    if (activeTab === 'draw') {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        alert('캔버스에 사인을 그려주세요.');
        return;
      }
      const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
      onSaveSignature(dataUrl);
    } else if (activeTab === 'type') {
      const dataUrl = generateTypedSignatureDataUrl();
      if (!dataUrl) {
        alert('서명으로 사용할 텍스트를 입력해주세요.');
        return;
      }
      onSaveSignature(dataUrl);
    } else if (activeTab === 'upload') {
      if (!uploadedImageSrc) {
        alert('업로드할 서명 이미지를 선택해주세요.');
        return;
      }
      onSaveSignature(uploadedImageSrc);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              ✍️
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              서명 생성하기
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-100/70 dark:bg-slate-800/70 p-1 gap-1">
          {[
            { id: 'draw', label: '그리기', icon: PenTool },
            { id: 'type', label: '텍스트 서명', icon: Type },
            { id: 'upload', label: '이미지 업로드', icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: DRAW CANVAS */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              
              {/* Color & Width Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
                
                {/* Pen Colors */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> 색상:
                  </span>
                  {[
                    { color: '#000000', label: '검정' },
                    { color: '#1e3a8a', label: '남색' },
                    { color: '#dc2626', label: '빨강' },
                    { color: '#16a34a', label: '초록' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => setPenColor(item.color)}
                      style={{ backgroundColor: item.color }}
                      className={`w-6 h-6 rounded-full border-2 transition transform ${
                        penColor === item.color ? 'border-orange-500 scale-110 shadow-md' : 'border-white dark:border-slate-700'
                      }`}
                      title={item.label}
                    />
                  ))}
                </div>

                {/* Pen Thickness */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">굵기:</span>
                  {[2, 3, 5].map((w) => (
                    <button
                      key={w}
                      onClick={() => setPenWidth(w)}
                      className={`px-2 py-0.5 text-xs font-bold rounded border transition ${
                        penWidth === w 
                          ? 'bg-orange-500 text-white border-orange-500' 
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700'
                      }`}
                    >
                      {w === 2 ? '얇게' : w === 3 ? '보통' : '굵게'}
                    </button>
                  ))}
                </div>

              </div>

              {/* Signature Canvas Box */}
              <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 overflow-hidden shadow-inner">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor={penColor}
                  minWidth={penWidth - 1}
                  maxWidth={penWidth + 1.5}
                  canvasProps={{
                    className: 'w-full h-56 cursor-crosshair signature-canvas-container'
                  }}
                />

                <div className="absolute bottom-2 right-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 pointer-events-none select-none">
                  마우스나 터치로 서명을 그리세요
                </div>
              </div>

              {/* Clear button inside tab */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClearDraw}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>초기화(지우기)</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: TYPE SIGNATURE */}
          {activeTab === 'type' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  서명 이름/문구 입력:
                </label>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="예: Hong Gildong 또는 홍길동"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Font Choice */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  서명 스타일 선택:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'font-handwriting-1', label: '필기체 A', sampleFont: 'font-handwriting-1' },
                    { id: 'font-handwriting-2', label: '필기체 B', sampleFont: 'font-handwriting-2' },
                    { id: 'font-handwriting-3', label: '필기체 C', sampleFont: 'font-handwriting-3' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        selectedFont === font.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`${font.sampleFont} text-2xl truncate`}>
                        {typedText || 'Signature'}
                      </div>
                      <span className="text-[11px] block mt-1 opacity-70">{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Picker */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">서명 색상:</span>
                {['#000000', '#1e3a8a', '#dc2626', '#16a34a'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      textColor === c ? 'border-orange-500 scale-110' : 'border-white dark:border-slate-700'
                    }`}
                  />
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: UPLOAD IMAGE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                서명 이미지 파일 선택 (투명 PNG 권장):
              </label>

              <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-6 text-center bg-gray-50 dark:bg-slate-950">
                {uploadedImageSrc ? (
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={uploadedImageSrc}
                      alt="Uploaded Signature"
                      className="max-h-36 object-contain border p-2 bg-white rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => setUploadedImageSrc(null)}
                      className="text-xs text-rose-500 font-bold hover:underline"
                    >
                      다른 이미지 선택
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                    <ImageIcon className="w-10 h-10 text-orange-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      이미지 파일 찾아보기
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG 이미지 지원</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            취소
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md transition transform hover:-translate-y-0.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>서명 완료 및 적용</span>
          </button>
        </div>

      </div>
    </div>
  );
}
