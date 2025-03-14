import React from 'react';
import { LockIcon, InfoIcon } from 'lucide-react';
import '../styles/UnauthorizedUserView.css';



interface UnauthorizedUserViewProps {
    description: string,
    features: string[]
}

const UnauthorizedUserView: React.FC<UnauthorizedUserViewProps> = ({ description, features }) => {
    return (
        <div className="unauthorized-container">
            <div className="unauthorized-icon-container">
                <div className="unauthorized-icon-circle">
                    <LockIcon className="unauthorized-lock-icon" />
                </div>
            </div>

            <h3 className="unauthorized-title">
                Feature Preview
            </h3>

            <p className="unauthorized-description">
                {description}
            </p>

            <div className="unauthorized-notice-box">
                <div className="unauthorized-notice-content">
                    <InfoIcon className="unauthorized-info-icon" />
                    <p className="unauthorized-notice-text">
                        You're currently viewing this in demo mode. Contact your administrator to request access to these features.
                    </p>
                </div>
            </div>

            <div className="unauthorized-features-grid">
                {features.length > 0 && features.map((feature, index) =>
                    <div key={index} className="unauthorized-feature-item">
                        <div className="unauthorized-feature-dot unauthorized-feature-dot-blue"></div>
                        <span className="unauthorized-feature-text">{feature}</span>
                    </div>)}
            </div>

            <button
                className="unauthorized-button"
                disabled
            >
                Request Access
            </button>
        </div>
    );
};

export default UnauthorizedUserView;