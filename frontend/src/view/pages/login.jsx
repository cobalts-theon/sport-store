import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebookF, FaArrowLeft, FaArrowRight, FaTimes, FaGoogle } from 'react-icons/fa';
import logo from '/src/assets/image/white-logo.png';
import "./pages-style/login.css";
import Silk from '../components/Silk';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "Prime Souls transformed my athletic journey. The quality and comfort are unmatched. Every product feels premium!",
            name: "Jordan Mitchell",
            role: "Professional Runner"
        },
        {
            quote: "Shopping here is effortless. The website is intuitive, and the customer service is exceptional. Highly recommended!",
            name: "Sarah Chen",
            role: "Fitness Enthusiast"
        },
        {
            quote: "I've never experienced such attention to detail in sportswear. Prime Souls truly understands athletes' needs.",
            name: "Marcus Rodriguez",
            role: "Basketball Coach"
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { email, password, keepLoggedIn });
    };

    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
        // Handle social login logic
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
                
                {/* Left Side - Login Form */}
                <div className="login-form-section">
                    <div className="login-logo">
                        <img src={logo} alt="Prime Souls Logo" />
                    </div>

                    <div className="login-form-content">
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Please Enter your Account details</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group-authen">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="form-group-authen">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={keepLoggedIn}
                                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                    />
                                    <span>Keep me logged in</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                Sign in
                            </button>
                        </form>

                        <div className="alt-login">
                            <div className="alt-login-text">or continue with</div>
                        </div>
                        
                        <div className="social-login">
                            <button 
                                className="social-btn google"
                                onClick={() => handleSocialLogin('Google')}
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                                </svg>
                                Login with Google
                            </button>
                            {/* <button 
                                className="social-btn github"
                                onClick={() => handleSocialLogin('GitHub')}
                                type="button"
                            >
                                <FaGithub />
                            </button>
                            <button 
                                className="social-btn facebook"
                                onClick={() => handleSocialLogin('Facebook')}
                                type="button"
                            >
                                <FaFacebookF />
                            </button> */}
                        </div>

                        <p className="signup-link">
                            Don't have an account? <Link to="/signup">Sign up</Link>
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
                        <h3>Get your premium gear at prime quality</h3>
                        <p>Be among the first to experience the ultimate athletic performance with our exclusive collection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
