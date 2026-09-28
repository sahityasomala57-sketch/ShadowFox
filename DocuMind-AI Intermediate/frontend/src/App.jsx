import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import QuestionBox from './components/QuestionBox';
import Answer from './components/Answer';
import Sources from './components/Sources';
import { getDocuments, askQuestion } from './services/api';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // 0=none, 1=understanding, 2=searching, 3=retrieving, 4=generating
  const [answerData, setAnswerData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  const handleUploadSuccess = (newDoc) => {
    fetchDocuments();
  };

  const handleDocumentDeleted = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleAskQuestion = async (question) => {
    setIsAsking(true);
    setAnswerData(null);
    setError('');
    
    // Simulate multi-step loading for better UX
    setLoadingStep(1);
    setTimeout(() => setLoadingStep(2), 500);
    setTimeout(() => setLoadingStep(3), 1200);
    setTimeout(() => setLoadingStep(4), 2000);

    try {
      const response = await askQuestion(question);
      setAnswerData({ question, ...response.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get answer. Please try again.');
    } finally {
      setIsAsking(false);
      setLoadingStep(0);
    }
  };

  const totalChunks = documents.reduce((sum, doc) => sum + (doc.chunks || 0), 0);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-nav">
          <div className="brand">
            <span className="brand-icon">✦</span>
            <h1>DocuMind AI</h1>
            <span className="brand-subtitle">Document Intelligence</span>
          </div>
          <nav className="nav-links">
            <a href="#" className="active">Documents</a>
            <a href="#">Ask AI</a>
            <a href="#">About</a>
          </nav>
          <div className="header-status">
            <span className="status-dot"></span>
            AI Powered
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-badge">✦ Retrieval-Augmented AI</div>
        <h2>Ask anything.<br/>Your documents have the answers.</h2>
        <p>Upload your documents and get accurate, grounded answers powered by AI.</p>
      </section>

      <main className="app-main">
        <div className="left-panel">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <DocumentList 
            documents={documents} 
            totalChunks={totalChunks}
            onDocumentDeleted={handleDocumentDeleted} 
          />
        </div>

        <div className="right-panel">
          <QuestionBox onAsk={handleAskQuestion} isAsking={isAsking} />
          
          {isAsking && (
            <div className="loading-steps-container">
              <div className={`loading-step ${loadingStep >= 1 ? 'active' : ''}`}>
                 {loadingStep > 1 ? '✓' : (loadingStep === 1 ? '◌' : '')} Understanding question
              </div>
              <div className={`loading-step ${loadingStep >= 2 ? 'active' : ''}`}>
                 {loadingStep > 2 ? '✓' : (loadingStep === 2 ? '◌' : '')} Searching documents
              </div>
              <div className={`loading-step ${loadingStep >= 3 ? 'active' : ''}`}>
                 {loadingStep > 3 ? '✓' : (loadingStep === 3 ? '◌' : '')} Retrieving relevant content
              </div>
              <div className={`loading-step ${loadingStep >= 4 ? 'active' : ''}`}>
                 {loadingStep > 4 ? '✓' : (loadingStep === 4 ? '◌' : '')} Generating grounded answer
              </div>
            </div>
          )}

          {error && (
            <div className="toast-error">
              <span className="toast-icon">⚠</span>
              <div className="toast-content">
                <strong>Document processing failed</strong>
                <p>{error}</p>
              </div>
              <button className="toast-close" onClick={() => setError('')}>✕</button>
            </div>
          )}

          {answerData && !error && (
            <div className="results-container">
              <Answer answer={answerData.answer} question={answerData.question} />
              <Sources sources={answerData.sources} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
