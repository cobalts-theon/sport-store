import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { OAuth2Client } from 'google-auth-library';

// Đăng ký người dùng mới
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Kiểm tra nếu email đã tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if  (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'customer', // Mặc định là khách hàng
            status: 'active'
        });
        res.status(201).json({ message: 'Sign up successfully', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing up' });
    }
};

// Chức năng đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if(!user) {
      return res.status(400).json({ message: 'Email or Password is incorrect' });
    }

    // Kiểm tra trạng thái tài khoản
    if(user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    if(user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin verification.' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ message: 'Email or Password is incorrect' });
    }

    // Tạo JWT (Token để lưu phiên đăng nhập)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '3d' } // Token có hạn trong 3 ngày
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

//Đăng nhâp bằng Google OAuth
//Google OAuth có thể sử dụng như login hoặc đăng ký luôn (nếu email chưa có trong hệ thống)
export const googleLogin = async (req, res) => {
    try {
        // Nhận trực tiếp thông tin từ Frontend gửi về
        const { email, name, avatar } = req.body;

        // 1. Kiểm tra user có trong DB chưa
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // 2. Nếu chưa có -> Tạo user mới
            // Tạo mật khẩu ngẫu nhiên để thỏa mãn DB
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name: name,
                email: email,
                password: hashedPassword, 
                avatar: avatar, 
                role: 'customer',
                status: 'active'
            });
        } else {
            // Kiểm tra trạng thái tài khoản nếu user đã tồn tại
            if(user.status === 'suspended') {
                return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
            }
            if(user.status === 'pending') {
                return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin verification.' });
            }
        }

        // 3. Tạo JWT Token của hệ thống
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '3d' }
        );

        res.status(200).json({
            message: 'Google login successful',
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Lỗi đăng nhập Google" });
    }
};

//Gửi mã xác thực qua email
export const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body; //Lấy email từ yêu cầu (Email người dùng gửi lên)

        //Kiểm tra email có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        //Tạo mã xác thực ngẫu nhiên 6 chữ số
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        //Lưu mã và thời gian hết hạn (4 phút) vào database
        user.verificationCode = code;
        user.codeExpiredAt = new Date(Date.now() + 4 * 60 * 1000); //4 phút từ bây giờ
        await user.save();

        //Gửi mã xác thực qua email
        const subject = 'Prime Souls - Code Verification';
        const text = `
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
                        <div class="verification-code">${code}</div>
                        <div class="code-expiry">
                            This code will expire in <strong>4 minutes</strong>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="security-notice">
                        <div class="security-title">SECURITY NOTICE</div>
                        <div class="security-text">
                            Never share this code with anyone.<br>
                        </div>
                    </div>
                    
                    <p class="footer-note">
                      Please do not reply to this email.
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
        await sendEmail(email, subject, text);
        res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending verification code' });
    }
};

//Kiểm tra mã xác thực người dùng gửi lên so với mã trong database
export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        //Tìm người dùng theo email và khớp mã đồng thời mã chưa hết hạn
        const user = await User.findOne({
            where: {
                email,
                verificationCode: code,
                codeExpiredAt: { [Op.gt]: new Date() } //Op.gt nghĩa là "lớn hơn" thời gian hiện tại
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Verification code is incorrect' });
        }

        // Không xóa mã ở đây, để resetPassword có thể dùng lại
        // Mã sẽ được xóa sau khi reset password thành công

        res.status(200).json({ message: 'Verification code is correct' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying code' });
    }
};


//Reset mật khẩu người dùng (Chức năng này có thể được mở rộng sau)
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        //Tìm người dùng theo email và khớp mã đồng thời mã chưa hết hạn
        const user = await User.findOne({
            where: {
                email,
                verificationCode: code,
                codeExpiredAt: { [Op.gt]: new Date() } //Op.gt nghĩa là "lớn hơn" thời gian hiện tại
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Verification code is incorrect' });
        }

        //Băm mật khẩu mới
        const salt = await bcrypt.genSalt(10);  //Gọi hàm genSalt để tạo biến salt (salt là chuỗi ngẫu nhiên để tăng độ bảo mật)
        const hashedPassword = await bcrypt.hash(newPassword, salt);    //Băm mật khẩu từ biến salt 

        //Cập nhật mật khẩu mới và xóa mã xác thực khỏi database
        user.password = hashedPassword;
        user.verificationCode = null;
        user.codeExpiredAt = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Lấy userId từ middleware xác thực token
        const { name, phone, address } = req.body;  // Lấy các trường cần cập nhật từ req.body

        const user = await User.findByPk(userId);   // Tìm người dùng theo userId
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Cập nhật thông tin người dùng
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        //Xử lý upload ảnh
        if (req.file) {
            user.avatar = `uploads/${req.file.filename}`; // Lưu đường dẫn ảnh vào trường avatar
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
}
        

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'verificationCode', 'codeExpiredAt'] },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {   
        res.status(500).json({ message: 'Error fetching users' });
    }
}

// Cập nhật thông tin người dùng (Cho Admin)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, phone, address } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật thông tin
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (status) user.status = status;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;

        await user.save();

        // Trả về user không bao gồm password
        const userResponse = user.toJSON();
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.codeExpiredAt;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Tạo người dùng mới (Cho Admin)
export const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, role, status, phone, address } = req.body;

        // Kiểm tra nếu email đã tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            address: address || null,
            role: role || 'customer',
            status: status || 'active'
        });

        // Trả về user không bao gồm password
        const userResponse = newUser.toJSON();
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.codeExpiredAt;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Xóa người dùng (Cho Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Lấy thông tin cá nhân (Cho User xem profile mình)
export const getProfile = async (req, res) => {
  try {
    //Middleware token đã lưu req.userId
    //nên chỉ cần trả về req.user ko cần truy vấn lại database
    if (!req.user) {
        return res.status(404).json({ message: "User information not found" });
    }

    // Trả về thông tin người dùng đã được lấy trong middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Đổi mật khẩu (yêu cầu mật khẩu cũ)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ middleware xác thực token
    const { currentPassword, newPassword } = req.body;

    // Tìm người dùng theo userId trong database
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Băm và lưu mật khẩu mới
    const salt = await bcrypt.genSalt(10);  // Tạo biến salt để băm mật khẩu
    user.password = await bcrypt.hash(newPassword, salt);   // Băm mật khẩu mới và gán vào trường password
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing password" });
  }
};