import React, { useState } from 'react';
import './QuestionBox.css';

const QuestionBox = ({ onAsk, isAsking }) => {
    const [question, setQuestion] = useState('');

    const suggestions = [
        "What is this document about?",
        "Summarize the main points",
        "What are the key findings?"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() && !isAsking) {
            onAsk(question);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuestion(suggestion);
    };

    return (
        <div className="premium-card question-box-card">
            <div className="card-header">
                <h3 className="card-title">Ask your documents</h3>
                <p className="card-subtitle">Get answers grounded in your uploaded content.</p>
            </div>

            <form onSubmit={handleSubmit} className="question-form">
                <div className="input-wrapper">
                    <textarea
                        className="question-input"
                        placeholder="Ask a question about your documents..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={isAsking}
                        rows="3"
                    />
                    <button 
                        type="submit" 
                        className="send-btn"
                        disabled={!question.trim() || isAsking}
                    >
                        <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                
                <div className="suggestions-container">
                    <span className="suggestions-label">Suggestions:</span>
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                className="suggestion-btn"
                                onClick={() => handleSuggestionClick(suggestion)}
                                disabled={isAsking}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QuestionBox;
