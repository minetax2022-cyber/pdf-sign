import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ToolSelector from './components/ToolSelector';
import UploadStep from './components/UploadStep';
import SignatureStep from './components/SignatureStep';
import StampGeneratorStep from './components/StampGeneratorStep';
import MergeStep from './components/MergeStep';
import SplitStep from './components/SplitStep';
import ImageToPdfStep from './components/ImageToPdfStep';
import PageNumberStep from './components/PageNumberStep';
import FooterInfo from './components/FooterInfo';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState('sign'); // 'sign' | 'stamp' | 'merge' | 'split' | 'imageToPdf' | 'pageNumber'
  const [selectedFile, setSelectedFile] = useState(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleResetApp = () => {
    setSelectedFile(null);
  };

  const handleToolChange = (toolId) => {
    setActiveTool(toolId);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Header Navigation */}
      <Header 
        activeTool={activeTool}
        setActiveTool={handleToolChange}
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        resetApp={handleResetApp} 
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-8">
        
        {/* Tool Selector Hero Grid */}
        <ToolSelector 
          activeTool={activeTool} 
          setActiveTool={handleToolChange} 
        />

        {/* Selected Tool Workspace */}
        <div className="mt-4">
          {activeTool === 'sign' && (
            !selectedFile ? (
              <UploadStep onFileSelect={(file) => setSelectedFile(file)} />
            ) : (
              <SignatureStep 
                file={selectedFile} 
                onBackToUpload={() => setSelectedFile(null)} 
              />
            )
          )}

          {activeTool === 'stamp' && <StampGeneratorStep />}
          {activeTool === 'merge' && <MergeStep />}
          {activeTool === 'split' && <SplitStep />}
          {activeTool === 'imageToPdf' && <ImageToPdfStep />}
          {activeTool === 'pageNumber' && <PageNumberStep />}
        </div>

      </main>

      {/* Footer Info & Related Tools */}
      <FooterInfo 
        activeTool={activeTool} 
        setActiveTool={handleToolChange} 
      />

    </div>
  );
}


