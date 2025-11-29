import express from 'express';
import { getAllUsers, deleteUser, getProfile } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Lấy thông tin cá nhân (Cho User xem profile mình)
router.get('/profile', verifyToken, getProfile);

// Lấy danh sách tất cả người dùng (Chỉ Admin)
router.get('/', verifyToken, isAdmin, getAllUsers);

//Route cho admin (Thêm middleware isAdmin)
router.get('/', verifyToken, isAdmin, getAllUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;