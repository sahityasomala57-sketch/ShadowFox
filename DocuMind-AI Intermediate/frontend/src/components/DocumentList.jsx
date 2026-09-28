import React, { useState } from 'react';
import { deleteDocument } from '../services/api';
import './DocumentList.css';

const DocumentList = ({ documents, totalChunks, onDocumentDeleted }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteDocument(id);
            onDocumentDeleted(id);
        } catch (error) {
            console.error('Failed to delete document', error);
            alert('Failed to delete document. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    if (!documents || documents.length === 0) {
        return (
            <div className="premium-card empty-state">
                <div className="empty-icon-wrapper">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h4>Your knowledge base is empty</h4>
                <p>Upload a PDF or TXT document to start asking questions.</p>
            </div>
        );
    }

    return (
        <div className="premium-card">
            <h3 className="card-title">Your Documents</h3>
            
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-label">Documents</span>
                    <span className="stat-value">{documents.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Chunks</span>
                    <span className="stat-value">{totalChunks}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Indexed</span>
                    <span className="stat-value success">✓ Ready</span>
                </div>
            </div>

            <ul className="document-ul">
                {documents.map((doc) => {
                    const isDeleting = deletingId === doc.id;
                    return (
                        <li key={doc.id} className="document-li">
                            <div className="doc-icon">📄</div>
                            <div className="doc-info">
                                <span className="doc-name">{doc.filename}</span>
                                <span className="doc-meta">
                                    ✓ Ready • {doc.chunks} chunks
                                </span>
                            </div>
                            <button 
                                className="doc-delete-btn" 
                                onClick={() => handleDelete(doc.id)}
                                disabled={isDeleting}
                                title="Remove document"
                            >
                                {isDeleting ? '...' : '✕'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DocumentList;
