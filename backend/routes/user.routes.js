import express from 'express';
import { getAllUsers, deleteUser, getProfile, register, login, sendVerificationCode, verifyCode } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

//routes login và register được đặt trong user.controller.js public
router.post('/register', register);
router.post('/login', login);

// Gửi mã xác thực đến email người dùng
router.post('/forgot-password', sendVerificationCode);

// Xác thực mã code người dùng nhập
router.post('/verify-code', verifyCode);

// Lấy thông tin cá nhân (Cho User xem profile mình)
router.get('/profile', verifyToken, getProfile);

// Lấy danh sách tất cả người dùng (Chỉ Admin)
router.get('/', verifyToken, isAdmin, getAllUsers);

//Route cho admin (Thêm middleware isAdmin)
router.get('/', verifyToken, isAdmin, getAllUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;