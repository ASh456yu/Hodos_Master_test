import React from 'react';
import '../styles/ErrorPage.css'; 

const ErrorPage: React.FC = () => {
  return (
    <div className="err-container">
      <div className="err-content">
        <div className="err-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className="err-title">Oops! Something went wrong</h1>
        <p className="err-message">We're sorry, but it seems that we've encountered an error.</p>
        <p className="err-description">Our team has been notified and is working on resolving the issue.</p>
        <div className="err-actions">
          <button className="err-button err-button-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          <button className="err-button err-button-secondary" onClick={() => window.location.href = '/'}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;