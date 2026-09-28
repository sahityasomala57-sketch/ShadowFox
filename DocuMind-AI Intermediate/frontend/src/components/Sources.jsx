import React, { useState } from 'react';
import './Sources.css';

const Sources = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="sources-container">
            <h4 className="sources-title">Sources Used</h4>
            <div className="sources-list">
                {sources.map((source, index) => (
                    <SourceCard key={index} source={source} index={index} />
                ))}
            </div>
        </div>
    );
};

const SourceCard = ({ source, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`premium-card source-card ${expanded ? 'expanded' : ''}`}>
            <div className="source-header" onClick={() => setExpanded(!expanded)}>
                <div className="source-info">
                    <span className="source-icon">📄</span>
                    <div className="source-meta-text">
                        <span className="source-filename">{source.filename}</span>
                        <span className="source-details">Chunk {source.chunk_number}</span>
                    </div>
                </div>
                
                <div className="source-right">
                    {source.similarity && (
                        <div className="similarity-badge">
                            <span className="sim-dot"></span>
                            {(source.similarity * 100).toFixed(0)}% Match
                        </div>
                    )}
                    <button className="expand-btn">
                        {expanded ? 'Collapse' : 'View source →'}
                    </button>
                </div>
            </div>
            
            {expanded && (
                <div className="source-content">
                    <div className="source-text">
                        "{source.text}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sources;
