import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadStep from './components/UploadStep';
import SignatureStep from './components/SignatureStep';
import FooterInfo from './components/FooterInfo';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Header Navigation */}
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        resetApp={handleResetApp} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!selectedFile ? (
          /* Step 1: File Upload Screen */
          <UploadStep onFileSelect={(file) => setSelectedFile(file)} />
        ) : (
          /* Step 2 & 3: Signature Workspace & Synthesis Download */
          <SignatureStep 
            file={selectedFile} 
            onBackToUpload={() => setSelectedFile(null)} 
          />
        )}
      </main>

      {/* Footer Info & Related Tools */}
      <FooterInfo />

    </div>
  );
}
