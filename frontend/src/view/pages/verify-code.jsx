import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '/src/assets/image/white-logo.png';
import "./pages-style/verification.css";
import Silk from '../components/Silk';

function VerifyCode() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [step, setStep] = useState(1); // 1: Verify Code, 2: Reset Password
    
    // State cho mật khẩu mới
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);

    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy email được truyền từ trang Forgot Password
    const email = location.state?.email;

    useEffect(() => {
        // Nếu không có email (truy cập trực tiếp link), đá về trang quên mật khẩu
        if (!email) {
            toast.error("Please enter your email first.");
            navigate('/forgot-password');
        }
        inputRefs.current[0]?.focus();
    }, [email, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Xử lý nhập mã 6 số
    const handleChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
        if (newCode.every(digit => digit !== '') && index === 5) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
    };

    // Xử lý dán mã
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newCode = [...code];
        pastedData.split('').forEach((digit, index) => { if (index < 6) newCode[index] = digit; });
        setCode(newCode);
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
        if (newCode.every(digit => digit !== '')) handleVerify(newCode.join(''));
    };

    // Gửi lại mã
    const handleResendCode = async () => {
        if (countdown > 0) return;
        setIsResending(true);
        try {
            await api.post('/users/forgot-password', { email });
            toast.success("Verification code resent!");
            setCountdown(60);
        } catch (error) {
            toast.error("Failed to resend code! Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    // Bước 1: Xác thực mã
    const handleVerify = async (verificationCode) => {
        try {
            await api.post('/users/verify-code', { email, code: verificationCode });
            toast.success("Code verified! Please set your new password.");
            setStep(2); // Chuyển sang bước nhập mật khẩu
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid verification code! Please try again.");
            // Reset ô nhập mã để nhập lại
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    // Bước 2: Đổi mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long!");
        }

        try {
            await api.post('/users/reset-password', {
                email,
                code: code.join(''), // Gửi kèm mã để backend xác thực lần cuối (vì backend yêu cầu)
                newPassword: passwords.newPassword
            });
            toast.success("Password reset successfully! Please log in.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed! Please try again.");
        }
    };

    return (
        <div className="verification-page">
            <div className="silk-background">
                <Silk speed={10} scale={1} color="#32523c" noiseIntensity={2} rotation={0} />
            </div>
            <div className="verification-container">
                <Link to="/login" className="verification-close-btn"><FaTimes /></Link>
                
                <div className="verification-form-section">
                    <div className="verification-logo">
                        <img src={logo} alt="Prime Souls Logo" />
                    </div>

                    <div className="verification-form-content">
                        {step === 1 ? (
                            // --- GIAO DIỆN BƯỚC 1: NHẬP MÃ ---
                            <>
                                <h1 className="verification-title">Verify your email</h1>
                                <p className="verification-subtitle">We've sent a code to {email}</p>

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
                            </>
                        ) : (
                            // --- GIAO DIỆN BƯỚC 2: ĐỔI MẬT KHẨU ---
                            <>
                                <h1 className="verification-title">Reset Password</h1>
                                <p className="verification-subtitle">Create a new password for your account</p>
                                <form onSubmit={handleResetPassword} className="reset-password-form">
                                    <div className="form-group-authen">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            placeholder="New Password"
                                            value={passwords.newPassword}
                                            onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                                            required
                                        />
                                        <span 
                                            className="password-toggle-icon"
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? <FaEyeSlash/> : <FaEye/>}
                                        </span>
                                    </div>
                                    <div className="form-group-authen">
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={passwords.confirmPassword}
                                            onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="verification-submit-btn">
                                        Reset Password
                                    </button>
                                </form>
                            </>
                        )}

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