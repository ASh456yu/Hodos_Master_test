import React from 'react';
import { AlertCircleIcon, DollarSignIcon } from 'lucide-react';
import '../styles/UnauthorizedBudgetView.css';


const UnauthorizedBudgetView: React.FC = () => {
  return (
    <div className="unauth-budget-container">
      <div className="unauth-budget-header">
        <div className="unauth-budget-icon-container">
          <div className="unauth-budget-icon-circle">
            <DollarSignIcon className="unauth-budget-lock-icon" />
          </div>
        </div>

        <h2 className="unauth-budget-title">
          Budget Monitoring System
        </h2>

        <p className="unauth-budget-description">
          Our financial management platform provides real-time budget tracking, expense monitoring, 
          and automated claim processing for enterprise departments.
        </p>
      </div>

      <div className="unauth-budget-notice-box">
        <div className="unauth-budget-notice-content">
          <AlertCircleIcon className="unauth-budget-alert-icon" />
          <p className="unauth-budget-notice-text">
            Access denied. You are not authorized to view budget information. 
            Please contact our support team for proper access credentials.
          </p>
        </div>
      </div>

      <div className="unauth-budget-features">
        <h3 className="unauth-budget-features-title">System Features</h3>
        <div className="unauth-budget-features-grid">
          <div className="unauth-budget-feature-item">
            <div className="unauth-budget-feature-dot unauth-budget-feature-dot-blue"></div>
            <span className="unauth-budget-feature-text">Real-time budget tracking</span>
          </div>
          <div className="unauth-budget-feature-item">
            <div className="unauth-budget-feature-dot unauth-budget-feature-dot-green"></div>
            <span className="unauth-budget-feature-text">Expense claim processing</span>
          </div>
          <div className="unauth-budget-feature-item">
            <div className="unauth-budget-feature-dot unauth-budget-feature-dot-orange"></div>
            <span className="unauth-budget-feature-text">Fraud detection system</span>
          </div>
          <div className="unauth-budget-feature-item">
            <div className="unauth-budget-feature-dot unauth-budget-feature-dot-purple"></div>
            <span className="unauth-budget-feature-text">Department analytics</span>
          </div>
        </div>
      </div>

      <div className="unauth-budget-footer">
        <p className="unauth-budget-support">For access requests: <a href="mailto:hodosindia@gmail.com" className="unauth-budget-support-link">hodosindia@gmail.com</a></p>
      </div>
    </div>
  );
};

export default UnauthorizedBudgetView;