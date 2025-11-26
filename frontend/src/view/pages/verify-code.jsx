import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import logo from '/src/assets/image/white-logo.png';
import "./pages-style/verification.css";
import Silk from '../components/Silk';

function VerifyCode() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        // Countdown timer for resend button
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newCode.every(digit => digit !== '') && index === 5) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) {
                newCode[index] = digit;
            }
        });
        setCode(newCode);

        // Focus last filled input or last input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();

        // Auto-submit if all fields are filled
        if (newCode.every(digit => digit !== '')) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleSubmit = (verificationCode) => {
        console.log('Verification code:', verificationCode);
        // Handle verification logic here
        // On success, navigate to next page
        // navigate('/dashboard');
    };

    const handleResendCode = () => {
        if (countdown > 0) return;
        
        setIsResending(true);
        // Simulate API call
        setTimeout(() => {
            setIsResending(false);
            setCountdown(60); // Start 60 second countdown
            console.log('Verification code resent');
        }, 1000);
    };

    return (
        <div className="verification-page">
            <div className="silk-background">
                <Silk
                    speed={10}
                    scale={1}
                    color="#32523c"
                    noiseIntensity={2}
                    rotation={0}
                />
            </div>
            <div className="verification-container">
                {/* Close Button */}
                <Link to="/" className="verification-close-btn">
                    <FaTimes />
                </Link>
                
                {/* Verification Form */}
                <div className="verification-form-section">
                    <div className="verification-logo">
                        <img src={logo} alt="Prime Souls Logo" />
                    </div>

                    <div className="verification-form-content">
                        <h1 className="verification-title">Verify your email</h1>
                        <p className="verification-subtitle">We've sent a 6-digit code to your email</p>

                        <div className="verification-code-inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="verification-code-input"
                                />
                            ))}
                        </div>

                        <div className="verification-actions">
                            <button
                                type="button"
                                className="verification-resend-btn"
                                onClick={handleResendCode}
                                disabled={countdown > 0 || isResending}
                            >
                                {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                            </button>
                        </div>

                        <p className="verification-back-link">
                            <Link to="/login">← Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyCode;
