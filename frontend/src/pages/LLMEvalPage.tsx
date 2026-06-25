import React from 'react';
import { LLMEvalForm } from '../components/LLMEval/LLMEvalForm';
import '../styles/testleaf-theme.css';
import '../styles/provider-toggle.css';

export const LLMEvalPage: React.FC = () => {
  return (
    <div className="llm-eval-page">
      {/* Header */}
      <div className="llm-eval-header">
        <h1>LLM Evaluation Framework</h1>
      </div>

      {/* Container */}
      <div className="llm-eval-container">
        <LLMEvalForm />
      </div>
    </div>
  );
};
