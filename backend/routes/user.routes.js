import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { getAllUsers, deleteUser, getProfile, register, login, sendVerificationCode, verifyCode, resetPassword, updateProfile, changePassword, googleLogin } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

//routes login và register được đặt trong user.controller.js public
router.post('/register', register);
router.post('/login', login);

// Route đăng nhập bằng Google OAuth
router.post('/google-login', googleLogin);

// Gửi mã xác thực đến email người dùng
router.post('/forgot-password', sendVerificationCode);

// Xác thực mã code người dùng nhập
router.post('/verify-code', verifyCode);

// Đổi mật khẩu (qua email verification)
router.post('/reset-password', resetPassword);

// Lấy thông tin cá nhân (Cho User xem profile mình)
router.get('/profile', verifyToken, getProfile);

// Cập nhật thông tin cá nhân
router.put('/profile', verifyToken, upload.single('avatar'), updateProfile);

// Đổi mật khẩu (yêu cầu mật khẩu cũ)
router.put('/profile/password', verifyToken, changePassword);

// Lấy danh sách tất cả người dùng (Chỉ Admin)
router.get('/', verifyToken, isAdmin, getAllUsers);

//Route cho admin (Thêm middleware isAdmin)
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;