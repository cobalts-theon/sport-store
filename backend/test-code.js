import dotenv from 'dotenv';
import sendEmail from './utils/sendEmail.js';

// Nạp biến môi trường từ file .env
dotenv.config();

const runTest = async () => {
    console.log("Đang bắt đầu quá trình test...");

    // 1. Giả lập sinh mã 6 số ngẫu nhiên
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Mã sinh ra là: ${randomCode}`);

    // 2. Điền email của CHÍNH BẠN để nhận thử
    const myEmail = "vvankhanh022@gmail.com"; // <--- SỬA LẠI EMAIL NÀY

    const subject = "Prime Souls - Email Verification Code";
    const message = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'JetBrains Mono', monospace;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    padding: 40px 20px;
                    color: #ffffff;
                }
                
                .email-container {
                    background: #0f0f0f;
                    max-width: 600px;
                    margin: 0 auto;
                    border-radius: 20px;
                    border: 2px solid rgba(208, 254, 29, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    overflow: hidden;
                }
                
                .email-header {
                    background: linear-gradient(135deg, #D0FE1D 0%, #a8d916 100%);
                    padding: 40px 30px;
                    text-align: center;
                    border-bottom: 3px solid #D0FE1D;
                }
                
                .brand-title {
                    color: #0a0a0a;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin: 0;
                }
                
                .email-content {
                    padding: 50px 40px;
                }
                
                .welcome-text {
                    color: #e0e0e0;
                    font-size: 16px;
                    line-height: 1.8;
                    margin-bottom: 30px;
                }
                
                .verification-section {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
                    padding: 50px 40px;
                    text-align: center;
                    border-radius: 16px;
                    border: 2px solid #D0FE1D;
                    margin: 40px 0;
                    position: relative;
                    box-shadow: 0 0 40px rgba(208, 254, 29, 0.15);
                }
                
                .verification-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(208, 254, 29, 0.1), transparent, rgba(208, 254, 29, 0.1));
                    border-radius: 14px;
                    pointer-events: none;
                }
                
                .code-label {
                    color: #999;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 25px;
                }
                
                .verification-code {
                    font-size: 52px;
                    font-weight: 700;
                    color: #D0FE1D;
                    letter-spacing: 16px;
                    font-family: 'JetBrains Mono', monospace;
                    margin: 20px 0;
                    text-shadow: 0 0 30px rgba(208, 254, 29, 0.6);
                }
                
                .code-expiry {
                    color: #666;
                    font-size: 14px;
                    margin-top: 25px;
                    letter-spacing: 1px;
                }
                
                .code-expiry strong {
                    color: #D0FE1D;
                    font-weight: 600;
                }
                
                .divider {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(208, 254, 29, 0.3), transparent);
                    margin: 40px 0;
                }
                
                .security-notice {
                    background: rgba(208, 254, 29, 0.05);
                    border: 1px solid rgba(208, 254, 29, 0.2);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                }
                
                .security-title {
                    color: #D0FE1D;
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    letter-spacing: 1px;
                }
                
                .security-text {
                    color: #999;
                    font-size: 14px;
                    line-height: 1.7;
                }
                
                .footer-note {
                    color: #666;
                    font-size: 13px;
                    text-align: center;
                    margin-top: 30px;
                    line-height: 1.6;
                }
                
                .email-footer {
                    background: #0a0a0a;
                    padding: 35px 30px;
                    text-align: center;
                    border-top: 2px solid rgba(208, 254, 29, 0.2);
                }
                
                .footer-brand {
                    color: #D0FE1D;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    margin-bottom: 12px;
                }
                
                .footer-copyright {
                    color: #555;
                    font-size: 12px;
                    letter-spacing: 1px;
                    line-height: 1.6;
                }
                
                .footer-tagline {
                    color: #666;
                    font-size: 12px;
                    margin-top: 8px;
                    font-style: italic;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1 class="brand-title">PRIME SOULS</h1>
                </div>
                
                <div class="email-content">
                    <p class="welcome-text">
                        Thank you for choosing Prime Souls!<br>
                        To complete your email verification, please use the code below:
                    </p>
                    
                    <div class="verification-section">
                        <div class="code-label">Your Verification Code</div>
                        <div class="verification-code">${randomCode}</div>
                        <div class="code-expiry">
                            This code will expire in <strong>10 minutes</strong>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="security-notice">
                        <div class="security-title">SECURITY NOTICE</div>
                        <div class="security-text">
                            Never share this code with anyone.<br>
                            Prime Souls will never ask for your verification code via phone or email.
                        </div>
                    </div>
                    
                    <p class="footer-note">
                        If you did not request this code, please ignore this email.<br>
                        Your account security is our top priority.
                    </p>
                </div>
                
                <div class="email-footer">
                    <div class="footer-brand">PRIME SOULS</div>
                    <div class="footer-copyright">
                        Copyright 2025. All rights reserved.
                    </div>
                    <div class="footer-tagline">
                        Where athletic passion meets excellence
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    // 3. Gọi hàm gửi mail
    const success = await sendEmail(myEmail, subject, message);

    if (success) {
        console.log("THÀNH CÔNG: Email đã được gửi đi! Hãy kiểm tra hộp thư.");
    } else {
        console.log("THẤT BẠI: Vui lòng kiểm tra lại password ứng dụng trong .env");
    }
};

runTest();