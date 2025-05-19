import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../components/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchUser } from '../store/authSlice';
import '../styles/Login.css'


const Login: React.FC = () => {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [animateBackground, setAnimateBackground] = useState(false);
    const images = [
        '/images/workflow.png',
        '/images/Invoice.png',
        '/images/Approval1.png',
        '/images/Approval2.png'
    ]
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setAnimateBackground(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }))
    }


    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async () => {
        const { email, password } = loginInfo;

        if (!email || !password) {
            return handleError('Email and password are required');
        }
        setLoading(true);
        // sending details along with httpCookie
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                dispatch(fetchUser());
                navigate('/workflow');
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }



    return (
      <div className={`login-body ${animateBackground ? "animate-bg" : ""}`}>
        <div className="login-container">
          <div className="login-left-panel">
            <div className="login-form-shape"></div>
            <div className="login-form-shape-2"></div>

            <div className="login-logo">
              <div className="login-logo-icon">H</div>
              <div className="login-logo-text">Hodos</div>
            </div>

            <h1>Welcome back!</h1>
            <p className="login-subtitle">
              Log in to access your Hodos dashboard and continue managing your
              business expenses effortlessly.
            </p>

            <div className="login-compact-form">
              <div className="login-form-grid">
                <div className="login-form-field">
                  <label htmlFor="work-email">Work Email *</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={loginInfo.email}
                    id="work-email"
                    placeholder="name@company.com"
                  />
                  <svg
                    className="login-input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="login-form-field full-width">
                  <label htmlFor="password">Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={loginInfo.password}
                    id="password"
                    placeholder="Enter your password"
                  />
                  <svg
                    className="login-input-icon"
                    onClick={togglePasswordVisibility}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <button
                className="login-primary-btn"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Log in to Hodos"
                )}
              </button>
              <button
                className="login-primary-btn"
                onClick={() =>
                  window.open(
                    `${import.meta.env.VITE_CLIENT_LOCATION.split(",")[0]}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Log in as Employee"
                )}
              </button>
            </div>

            <div className="login-social-options">
              <div className="login-divider">
                <span>Or continue with</span>
              </div>
            </div>

            <p className="login-footer-text2">
              New account? <a href="/signup">Sign Up</a>
            </p>
          </div>

          <div className="login-right-panel">
            {/* Feature Badges */}
            <div className="login-features">
              <div className="login-feature-badge animate-slide-in">
                Monitor Workflow
              </div>
              <div className="login-feature-badge animate-slide-in-delay-1">
                Automating Audit
              </div>
              <div className="login-feature-badge animate-slide-in-delay-2">
                Automated Approval
              </div>
            </div>

            {/* Image Carousel */}
            <div className="login-product-preview-container animate-fade-in-up">
              <img
                src={images[currentIndex]}
                alt="Hodos Dashboard Preview"
                className="login-product-preview"
              />

              {/* Dots for Navigation */}
              <div className="carousel-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Section */}
            {/* <div className="login-testimonial animate-fade-in-up-delay">
                        <div className="login-testimonial-content">
                            <p>
                                "Hodos transformed how our team handles expenses. The automated approval workflow has saved us countless hours each month."
                            </p>
                        </div>
                        <div className="login-testimonial-author">
                            <div className="login-author-info">
                                <h4>Michael Reeves</h4>
                                <p>Finance Director, Elysium Tech</p>
                            </div>
                        </div>
                    </div> */}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
}

export default Login
