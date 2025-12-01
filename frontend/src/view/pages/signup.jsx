import { useState, useEffect } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import logo from '/src/assets/image/white-logo.png';
import "./pages-style/login.css";
import Silk from '../components/Silk';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "Signing up was the best decision for my fitness journey. Prime Souls delivers quality every time!",
            name: "Alex Thompson",
            role: "Marathon Runner"
        },
        {
            quote: "The seamless shopping experience and premium products make Prime Souls my go-to athletic brand.",
            name: "Emma Williams",
            role: "Yoga Instructor"
        },
        {
            quote: "From registration to delivery, everything exceeded my expectations. Truly a premium experience!",
            name: "David Kim",
            role: "Personal Trainer"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //Đăng ký = google OAuth
    const signupWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Lấy thông tin người dùng từ Google
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                // Gửi thông tin người dùng đến backend để đăng ký hoặc đăng nhập
                const res = await api.post('/users/google-login', {
                    email: userInfo.data.email,
                    name: userInfo.data.name,
                    googleId: userInfo.data.sub
                });

                //Đăng nhập luôn sau khi đăng ký thành công :3
                if(res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));

                    toast.success("Signup successful! Welcome to Prime Souls.");
                    if (res.data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error("Google Signup Error:", error);
                const message = error.response?.data?.message || "Google Signup failed. Please try again.";
                toast.error(message);
            }
        },
        onError: () => {
            toast.error("Google Signup Failed");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!agreeToTerms) {
            toast.error("You must agree to the Terms");
            return;
        }

        if(formData.password !== formData.confirmPassword) {
            
            toast.error("Passwords do not match");
            return;
        }

        try {
            const { confirmPassword, ...datatoSend } = formData;

            const res = await api.post('/users/register', datatoSend);

            toast.success("Signup successful! Please log in.");
            navigate('/login'); //Chuyển hướng đến trang login
        } catch (error) {
            console.error("Signup error:", error);
            const message = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(message);
        }
    };

    const handleSocialSignup = (provider) => {
        console.log(`Sign up with ${provider}`);
        toast.success(`Sign up with ${provider} is not implemented yet.`);
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
                <Silk
                    speed={10}
                    scale={1}
                    color="#32523c"
                    noiseIntensity={2}
                    rotation={0}
                />
            </div>
            <div className="login-container">
                {/* Close Button */}
                <Link to="/" className="login-close-btn">
                    <FaTimes />
                </Link>
                
                {/* Left Side - Signup Form */}
                <div className="login-form-section">
                    <div className="login-logo">
                        <img src={logo} alt="Prime Souls Logo" />
                    </div>

                    <div className="login-form-content">
                        <h1 className="login-title">Create Account</h1>
                        <p className="login-subtitle">Join Prime Souls community today</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group-authen">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>

                            <div className="form-group-authen">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="form-group-authen">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div className="form-group-authen">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span>I agree to Terms & Conditions</span>
                                </label>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                Sign up
                            </button>
                        </form>

                        <div className="alt-login">
                            <div className="alt-login-text">or continue with</div>
                        </div>

                        <div className="social-login">
                            <button 
                                className="social-btn google"
                                onClick={() => signupWithGoogle()}
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                                </svg>
                                Sign up with Google
                            </button>
                            {/* <button 
                                className="social-btn github"
                                onClick={() => handleSocialSignup('GitHub')}
                                type="button"
                            >
                                <FaGithub />
                            </button>
                            <button 
                                className="social-btn facebook"
                                onClick={() => handleSocialSignup('Facebook')}
                                type="button"
                            >
                                <FaFacebookF />
                            </button> */}
                        </div>

                        <p className="signup-link">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>

                {/* Right Side - Testimonials */}
                <div className="login-testimonial-section">
                    <div className="testimonial-card">
                        <div className="starburst-decoration"></div>
                        <h2 className="testimonial-title">What our Athletes Said.</h2>
                        <div className="testimonial-content">
                            <div className="quote-mark">"</div>
                            <p className="testimonial-text">
                                {testimonials[currentTestimonial].quote}
                            </p>
                            <div className="testimonial-author">
                                <h3>{testimonials[currentTestimonial].name}</h3>
                                <p>{testimonials[currentTestimonial].role}</p>
                            </div>
                            <div className="testimonial-navigation">
                                <button 
                                    className="testimonial-btn prev"
                                    onClick={prevTestimonial}
                                    type="button"
                                >
                                    <FaArrowLeft />
                                </button>
                                <button 
                                    className="testimonial-btn next"
                                    onClick={nextTestimonial}
                                    type="button"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="promo-card">
                        <div className="promo-bubble"></div>
                        <h3>Start your athletic journey today</h3>
                        <p>Join thousands of athletes who trust Prime Souls for their premium sportswear needs.</p>
                        <div className="user-avatars">
                            <div className="avatar avatar1"></div>
                            <div className="avatar avatar2"></div>
                            <div className="avatar avatar3"></div>
                            <div className="avatar avatar4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

