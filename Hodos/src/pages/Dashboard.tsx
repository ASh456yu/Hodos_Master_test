import React from 'react';
import '../styles/Dashboard.css';


const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            {/* Video Hero Section */}
            <section className="video-section">
                <div className="video-wrapper">
                    <iframe
                        className="intro-video"
                        src="https://www.youtube.com/embed/lMwFxU5jM0w?autoplay=1&mute=1&loop=1&playlist=lMwFxU5jM0w&modestbranding=1&color=white&controls=1"
                        title="Hodos Introduction Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            </section>


            {/* Blog Content Section */}
            <section className="blog-section">
                <div className="blog-header">
                    <h2 className="blog-title">Revolutionizing Business Travel Expense Management</h2>
                    <p className="blog-date">March 17, 2025</p>
                </div>

                <article className="blog-content">
                    <div className="blog-intro">
                        <p>
                            At Hodos, we understand the challenges businesses face with travel expense management.
                            From tedious bill auditing to complex invoice creation and expense tracking - we've built
                            a comprehensive solution that transforms these pain points into a streamlined process.
                        </p>
                    </div>

                    <div className="blog-feature">
                        <h3 className="feature-title">Automated Bill Auditing</h3>
                        <div className="feature-content">
                            <div className="feature-image-container">
                                <img src="/api/placeholder/400/300" alt="Bill Auditing Dashboard" className="feature-image" />
                            </div>
                            <div className="feature-text">
                                <p>
                                    Our intelligent auditing system automatically reviews travel-related bills,
                                    flagging discrepancies and ensuring compliance with your company's expense policies.
                                    This automated approach reduces errors by 95% while saving your finance team
                                    hours of manual review time.
                                </p>
                                <ul className="feature-benefits">
                                    <li>Real-time expense policy verification</li>
                                    <li>Automatic detection of duplicate charges</li>
                                    <li>Custom approval workflows</li>
                                    <li>Compliance reporting</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="blog-feature">
                        <h3 className="feature-title">Seamless Invoice Creation</h3>
                        <div className="feature-content">
                            <div className="feature-text">
                                <p>
                                    Generate professional invoices with a single click. Our system consolidates all
                                    trip expenses, applies appropriate tax codes, and creates branded invoices ready
                                    for submission. Integration with popular accounting software ensures smooth
                                    financial operations from end to end.
                                </p>
                                <ul className="feature-benefits">
                                    <li>Automated tax calculation</li>
                                    <li>Custom invoice templates</li>
                                    <li>Multi-currency support</li>
                                    <li>Direct integration with accounting systems</li>
                                </ul>
                            </div>
                            <div className="feature-image-container">
                                <img src="/api/placeholder/400/300" alt="Invoice Creation Interface" className="feature-image" />
                            </div>
                        </div>
                    </div>

                    <div className="blog-feature">
                        <h3 className="feature-title">Comprehensive Expense Management</h3>
                        <div className="feature-content">
                            <div className="feature-image-container">
                                <img src="/api/placeholder/400/300" alt="Expense Management Dashboard" className="feature-image" />
                            </div>
                            <div className="feature-text">
                                <p>
                                    Our unified dashboard gives financial controllers and travelers alike a complete
                                    view of all trip expenses. From pre-approval requests to post-trip reconciliation,
                                    Hodos provides real-time visibility and control over your travel spending.
                                </p>
                                <ul className="feature-benefits">
                                    <li>Centralized expense tracking</li>
                                    <li>Budget forecasting and analysis</li>
                                    <li>Receipt capture and storage</li>
                                    <li>Spending pattern insights</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default Dashboard;