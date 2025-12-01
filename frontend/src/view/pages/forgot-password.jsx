import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api"; // Import API
import toast from "react-hot-toast"; // Import thông báo
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import logo from '/src/assets/image/white-logo.png';
import "./pages-style/login.css";
import Silk from '../components/Silk';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [loading, setLoading] = useState(false);

    const testimonials = [
        {
            quote: "Prime Souls support team was incredibly helpful when I needed assistance. Quick and professional!",
            name: "Michael Chang",
            role: "CrossFit Athlete"
        },
        {
            quote: "Security and ease of access are top-notch with Prime Souls. I feel safe shopping here.",
            name: "Lisa Anderson",
            role: "Professional Swimmer"
        },
        {
            quote: "The recovery process was smooth and hassle-free. Back to shopping in no time!",
            name: "James Wilson",
            role: "Gym Owner"
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Gọi API gửi mã
            await api.post('/users/forgot-password', { email });
            
            toast.success("Mã xác thực đã được gửi tới email của bạn!");
            
            // Chuyển sang trang nhập mã, mang theo email
            navigate('/verify-code', { state: { email: email } });
            
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Không thể gửi email. Vui lòng thử lại!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="login-page">
            <div className="silk-background">
                <Silk speed={10} scale={1} color="#32523c" noiseIntensity={2} rotation={0} />
            </div>
            <div className="login-container">
                <Link to="/" className="login-close-btn"><FaTimes /></Link>
                
                <div className="login-form-section">
                    <div className="login-logo">
                        <img src={logo} alt="Prime Souls Logo" />
                    </div>

                    <div className="login-form-content">
                        <h1 className="login-title">Forgot Password?</h1>
                        <p className="login-subtitle">Enter your email to reset your password.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group-authen">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>

                            <div className="alt-login">
                                <div className="alt-login-text">
                                    <Link to="/login" className="forgot-password" style={{ color: '#fff', textDecoration: 'none' }}>
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="login-testimonial-section">
                    <div className="testimonial-card">
                        <div className="starburst-decoration"></div>
                        <h2 className="testimonial-title">What our Athletes Said.</h2>
                        <div className="testimonial-content">
                            <div className="quote-mark">"</div>
                            <p className="testimonial-text">{testimonials[currentTestimonial].quote}</p>
                            <div className="testimonial-author">
                                <h3>{testimonials[currentTestimonial].name}</h3>
                                <p>{testimonials[currentTestimonial].role}</p>
                            </div>
                            <div className="testimonial-navigation">
                                <button className="testimonial-btn prev" onClick={prevTestimonial} type="button"><FaArrowLeft /></button>
                                <button className="testimonial-btn next" onClick={nextTestimonial} type="button"><FaArrowRight /></button>
                            </div>
                        </div>
                    </div>
                    <div className="promo-card">
                        <div className="promo-bubble"></div>
                        <h3>Secure & Reliable</h3>
                        <p>We prioritize your account security so you can focus on your performance.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;