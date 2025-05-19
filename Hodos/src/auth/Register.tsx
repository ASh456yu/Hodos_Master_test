import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../components/utils";
import "../styles/Register.css";
import axios from "axios";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { fetchUser } from '../store/authSlice';


const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(false);
    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
        employee_id: "",
        position: "",
        department: "",
    });
    const images = [
        '/images/workflow.png',
        '/images/Invoice.png',
        '/images/Approval1.png',
        '/images/Approval2.png'
    ]

    const [currentIndex, setCurrentIndex] = useState(0);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const demoWorkflowCreate = (user_id: string, label: string) => {
        const nodeIDs: string[] = [];
        const edgeIDs: string[] = [];
        for (let index = 0; index < 3; index++) {
            nodeIDs.push(`node-${user_id}-${index}-${Math.floor(Math.random() * 1000)}`);
            edgeIDs.push(`edge-${user_id}-${index}-${Math.floor(Math.random() * 1000)}`);
        }

        const newNodes = nodeIDs.map((id, index) => ({
            id,
            type: "editableNode",
            position: { x: 200 + index * 50, y: 200 + index * 30 },
            data: { userId: user_id, label, action: index == 2 ? 3 : index },
        }));

        const newEdges = [
            {
                data: { condition: "Default Condition" },
                id: edgeIDs[0],
                source: nodeIDs[0],
                sourceHandle: "output-1",
                target: nodeIDs[1],
                targetHandle: "input-1",
                type: "customEdge",
            },
            {
                data: { condition: "Default Condition" },
                id: edgeIDs[1],
                source: nodeIDs[1],
                sourceHandle: "output-2",
                target: nodeIDs[2],
                targetHandle: "input-1",
                type: "customEdge",
            },
        ];

        return { nodes: newNodes, edges: newEdges };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async () => {

        const { name, email, password, company, employee_id, position, department } = signupInfo;
        if (!name || !email || !password || !company || !employee_id || !position || !department) {
            return handleError("Please fill all fields!!");
        }

        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_SERVER_LOCATION.split(",")[0]}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupInfo),
                credentials: 'include',
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                const { nodes, edges } = demoWorkflowCreate(result.user_id, result.name);
                const payload = {
                    name: `demo-${result.user_id}-${Math.floor(Math.random() * 1000)}-workflow`,
                    nodes,
                    edges,
                    initiateTrip: [result.user_id],
                    tripApproval: [result.user_id],
                    claimApproval: [result.user_id],
                    finalClaimApproval: result.user_id,
                    user_id: result.user_id
                };

                const response2 = await axios.post(
                    `${import.meta.env.VITE_SERVER_LOCATION.split(",")[0]}/general/save-demo-workflow`,
                    payload,
                );

                if (response2.data.success) {
                    handleSuccess("Workflow saved successfully!");
                }
                handleSuccess(message);

                await dispatch(fetchUser()).unwrap();
                navigate('/workflow');
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-body">
            <div className="register-container">
                <div className="register-left-panel">
                    <div className="register-form-shape animate-float"></div>
                    <div className="register-form-shape-2 animate-float-reverse"></div>

                    <div className="register-logo animate-slide-down">
                        <div className="register-logo-icon">H</div>
                        <div className="register-logo-text">Hodos</div>
                    </div>

                    <h1 className="animate-fade-in">Start Simplifying Expenses</h1>
                    <p className="register-subtitle animate-fade-in-delay-1">Join thousands of businesses that use Hodos to streamline expense management.</p>

                    <div className="register-compact-form animate-fade-in-delay-2">
                        <div className="register-form-grid">
                            <div className="register-form-field animate-slide-up">
                                <label htmlFor="work-email">Work Email *</label>
                                <input type="email" onChange={handleChange} name="email" value={signupInfo.email} id="work-email" placeholder="name@company.com" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="register-form-field animate-slide-up-delay-1">
                                <label htmlFor="full-name">Full Name *</label>
                                <input type="text" onChange={handleChange} name="name" value={signupInfo.name} id="full-name" placeholder="Your full name" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div className="register-form-field animate-slide-up-delay-2">
                                <label htmlFor="company">Company *</label>
                                <input type="text" onChange={handleChange} name="company" value={signupInfo.company} id="company" placeholder="Your company name" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                            <div className="register-form-field animate-slide-up-delay-3">
                                <label htmlFor="position">Position *</label>
                                <input type="text" onChange={handleChange} name="position" value={signupInfo.position} id="position" placeholder="Your job title" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path><path d="M12 14l3.64 3.64a1 1 0 0 1-1.36 1.36L12 16.75 9.72 19l-1.36-1.36L12 14z"></path><path d="M17 3h4v4"></path><path d="M3 3h4v4"></path><path d="M17 21h4v-4"></path><path d="M3 21h4v-4"></path></svg>
                            </div>
                            <div className="register-form-field animate-slide-up-delay-4">
                                <label htmlFor="department">Department *</label>
                                <input type="text" onChange={handleChange} name="department" value={signupInfo.department} id="department" placeholder="Your department" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                            </div>
                            <div className="register-form-field animate-slide-up-delay-5">
                                <label htmlFor="employee-id">Employee ID *</label>
                                <input type="text" onChange={handleChange} name="employee_id" value={signupInfo.employee_id} id="employee-id" placeholder="Your employee ID" />
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div className="register-form-field full-width animate-slide-up-delay-6">
                                <label htmlFor="password">Password *</label>
                                <input type={showPassword ? "text" : "password"} onChange={handleChange} name="password" value={signupInfo.password} id="password" placeholder="Create a secure password" />
                                <svg onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} className="register-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                    <button className={`register-primary-btn animate-pulse ${loading ? 'btn-loading' : ''}`} disabled={loading} onClick={handleSignup}>
                        {loading ? (
                            <span className="btn-loader">
                                <span className="loader-dot"></span>
                                <span className="loader-dot"></span>
                                <span className="loader-dot"></span>
                            </span>
                        ) : 'Create Free Account'}
                    </button>

                    <p className="register-footer-text animate-fade-in-delay-3">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>
                    <p className="register-footer-text2 animate-fade-in-delay-3">Already have an account? <a href="/login">Signin</a></p>
                </div>

                <div className="register-right-panel">
                    {/* Feature Badges */}
                    <div className="register-features">
                        <div className="register-feature-badge animate-slide-in">Monitor Workflow</div>
                        <div className="register-feature-badge animate-slide-in-delay-1">Automating Audit</div>
                        <div className="register-feature-badge animate-slide-in-delay-2">Automated Approval</div>
                    </div>

                    {/* Image Carousel */}
                    <div className="register-product-preview-container animate-fade-in-up">
                        <img
                            src={images[currentIndex]}
                            alt="Hodos Dashboard Preview"
                            className="register-product-preview"
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
                    {/* <div className="register-testimonial animate-fade-in-up-delay">
                        <div className="register-testimonial-content">
                            <p>
                                "Hodos transformed how our team handles expenses. The automated approval workflow has saved us countless hours each month."
                            </p>
                        </div>
                        <div className="register-testimonial-author">
                            <div className="register-author-info">
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
};

export default Register;