import React from 'react';
import { MessageSquareIcon, InfoIcon, UsersIcon } from 'lucide-react';
import '../styles/UnauthorizedChatView.css';


const UnauthorizedChatView: React.FC = () => {
  return (
    <div className="unauthorized-chat-container">
      <div className="unauthorized-icon-container">
        <div className="unauthorized-icon-circle">
          <MessageSquareIcon className="unauthorized-lock-icon" />
        </div>
      </div>

      <h3 className="unauthorized-title">
        Employee Chat System
      </h3>

      <p className="unauthorized-description">
        Our secure messaging platform allows authorized users to communicate with team members
        in real-time through a private channel.
      </p>

      <div className="unauthorized-notice-box">
        <div className="unauthorized-notice-content">
          <InfoIcon className="unauthorized-info-icon" />
          <p className="unauthorized-notice-text">
            You're currently in view-only mode. Contact your administrator to request full chat access.
          </p>
        </div>
      </div>

      <div className="unauthorized-chat-preview">
        <div className="unauthorized-chat-demo-header">
          <UsersIcon className="unauthorized-chat-demo-icon" />
          <span className="unauthorized-chat-demo-title">Preview Mode</span>
        </div>

        <div className="unauthorized-chat-messages">
          <div className="unauthorized-chat-message unauthorized-chat-message-employee">
            <div className="unauthorized-chat-bubble">Hi there! When will the new project start?</div>
          </div>
          <div className="unauthorized-chat-message unauthorized-chat-message-admin">
            <div className="unauthorized-chat-bubble">We're aiming for next Monday. I'll send the schedule soon.</div>
          </div>
          <div className="unauthorized-chat-message unauthorized-chat-message-employee">
            <div className="unauthorized-chat-bubble">Perfect, thanks for the update!</div>
          </div>
        </div>

        <div className="unauthorized-chat-input-disabled">
          <input
            className="unauthorized-chat-input-field"
            placeholder="Message unavailable in demo mode"
            disabled
          />
          <button className="unauthorized-chat-send-button" disabled>
            <span>Send</span>
          </button>
        </div>
      </div>

      <div className="unauthorized-features-grid">
        <div className="unauthorized-feature-item">
          <div className="unauthorized-feature-dot unauthorized-feature-dot-blue"></div>
          <span className="unauthorized-feature-text">Real-time messaging</span>
        </div>
        <div className="unauthorized-feature-item">
          <div className="unauthorized-feature-dot unauthorized-feature-dot-green"></div>
          <span className="unauthorized-feature-text">Employee directory</span>
        </div>
        <div className="unauthorized-feature-item">
          <div className="unauthorized-feature-dot unauthorized-feature-dot-purple"></div>
          <span className="unauthorized-feature-text">Message history</span>
        </div>
      </div>

      <button
        className="unauthorized-button"
        disabled
      >
        Request Chat Access
      </button>
    </div>
  );
};

export default UnauthorizedChatView;