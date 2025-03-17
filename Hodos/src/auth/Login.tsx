import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }))
    }


    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">Login</h1>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-input-group">
                        <label htmlFor="email" className="login-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            value={loginInfo.email}
                            placeholder="Enter your email"
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-group">
                        <label htmlFor="password" className="login-label">Password</label>
                        <div className="login-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                onChange={handleChange}
                                value={loginInfo.password}
                                placeholder="Enter your password"
                                required
                                className="login-input login-password-input"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="login-toggle-password"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        {loading ? <span className="login-spinner"></span> : 'Login'}
                    </button>

                    <div className="login-footer">
                        <span className="login-signup-text">
                            Don't have an account?{' '}
                            <Link to="/signup" className="login-link">Sign up</Link>
                        </span>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login
