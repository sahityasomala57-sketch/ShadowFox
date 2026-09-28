import React, { useState, useRef } from 'react';
import { uploadDocument } from '../services/api';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        if (!file) return false;
        // Let backend decide on the extension/mimetype as well, but provide quick frontend feedback
        const ext = file.name.split('.').pop().toLowerCase();
        if (file.type !== 'application/pdf' && file.type !== 'text/plain' && ext !== 'pdf' && ext !== 'txt') {
            setErrorMessage('Unsupported file type. Only PDF and TXT are allowed.');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage('File size exceeds 10MB limit.');
            return false;
        }
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                handleUpload(selectedFile);
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                handleUpload(selectedFile);
            }
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleUpload = async (fileToUpload) => {
        setStatus('uploading');
        setProgress(0);
        setErrorMessage('');
        
        try {
            const response = await uploadDocument(fileToUpload, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            });
            
            setStatus('success');
            onUploadSuccess(response.data);
            
            setTimeout(() => {
                setStatus('idle');
                setFile(null);
                setProgress(0);
            }, 3000);
        } catch (error) {
            setStatus('error');
            const backendError = error.response?.data?.error || 'Upload failed';
            
            // Provide a cleaner frontend message as requested
            if (backendError.includes('Failed to generate embeddings') || backendError.includes('embedding')) {
                setErrorMessage('Document processing failed: Unable to create document embeddings. Please try again.');
            } else {
                setErrorMessage(backendError);
            }

            setTimeout(() => {
                setStatus('idle');
                setFile(null);
            }, 5000);
        }
    };

    return (
        <div className="premium-card file-upload-card">
            <h3 className="card-title">Upload your documents</h3>
            <div 
                className={`drop-zone ${dragActive ? 'drag-active' : ''} ${status === 'error' ? 'error-state' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input 
                    ref={inputRef}
                    type="file" 
                    className="file-input" 
                    onChange={handleChange} 
                    accept=".pdf,.txt"
                />
                
                <div className="upload-content">
                    <div className="upload-icon-wrapper">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h4>Drag & drop files here</h4>
                    <p className="or-divider">or</p>
                    <span className="browse-link">Browse files</span>
                    <p className="file-hints">PDF and TXT • Max 10 MB</p>
                </div>
            </div>

            {status === 'uploading' && (
                <div className="progress-wrapper">
                    <div className="progress-info">
                        <span className="file-name">{file?.name}</span>
                        <span className="progress-percent">{progress}%</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="status-toast success">
                    ✓ Document indexed successfully
                </div>
            )}

            {status === 'error' && (
                <div className="status-toast error">
                    ⚠ {errorMessage}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
