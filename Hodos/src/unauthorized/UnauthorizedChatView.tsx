import React from 'react';
import { MessageSquareIcon, InfoIcon } from 'lucide-react';
import '../styles/UnauthorizedChatView.css'


const UnauthorizedChatView: React.FC = () => {
  return (
    <div className="unauthorized-chat-container">
      <div className="unauthorized-header">
        <div className="unauthorized-icon-container">
          <div className="unauthorized-icon-circle">
            <MessageSquareIcon className="unauthorized-lock-icon" />
          </div>
        </div>

        <h2 className="unauthorized-title">
          Secure Communication Portal
        </h2>

        <p className="unauthorized-description">
          Our enterprise messaging platform enables team collaboration through encrypted channels,
          ensuring your business communications remain private and secure.
        </p>
      </div>

      <div className="unauthorized-notice-box">
        <div className="unauthorized-notice-content">
          <InfoIcon className="unauthorized-info-icon" />
          <p className="unauthorized-notice-text">
            Access restricted. You are currently in preview mode. Please contact your system administrator
            for authorization credentials.
          </p>
        </div>
      </div>

      <div className="unauthorized-features">
        <h3 className="unauthorized-features-title">Enterprise Features</h3>
        <div className="unauthorized-features-grid">
          <div className="unauthorized-feature-item">
            <div className="unauthorized-feature-dot unauthorized-feature-dot-blue"></div>
            <span className="unauthorized-feature-text">Secure real-time messaging</span>
          </div>
          <div className="unauthorized-feature-item">
            <div className="unauthorized-feature-dot unauthorized-feature-dot-green"></div>
            <span className="unauthorized-feature-text">Team collaboration tools</span>
          </div>
          <div className="unauthorized-feature-item">
            <div className="unauthorized-feature-dot unauthorized-feature-dot-purple"></div>
            <span className="unauthorized-feature-text">Encrypted file sharing</span>
          </div>
          <div className="unauthorized-feature-item">
            <div className="unauthorized-feature-dot unauthorized-feature-dot-orange"></div>
            <span className="unauthorized-feature-text">Audit & compliance</span>
          </div>
        </div>
      </div>

      <div className="unauthorized-footer">
        <p className="unauthorized-support">For access requests: <a href="mailto:hodosindia@gmail.com" className="unauthorized-support-link">hodosindia@gmail.com</a></p>
      </div>
    </div>
  );
};

export default UnauthorizedChatView;