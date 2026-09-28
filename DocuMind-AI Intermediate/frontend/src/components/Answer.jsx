import React from 'react';
import './Answer.css';

const Answer = ({ answer, question }) => {
    if (!answer) return null;

    return (
        <div className="premium-card answer-card">
            <div className="you-asked-section">
                <span className="asked-label">You Asked</span>
                <p className="asked-question">"{question}"</p>
            </div>
            
            <div className="ai-answer-section">
                <div className="answer-header">
                    <span className="ai-label">
                        <span className="ai-icon">✦</span> AI Answer
                    </span>
                    <span className="grounded-badge">✓ Grounded in your documents</span>
                </div>
                
                <div className="answer-content">
                    {answer.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Answer;
