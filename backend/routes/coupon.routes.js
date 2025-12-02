import express from 'express';
import { createCoupon, getAllCoupons, deleteCoupon, applyCoupon, updateCoupon } from '../controllers/coupon.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public Routes (User Logged In) ---
// Khách hàng áp dụng mã (cần đăng nhập)
router.post('/apply', verifyToken, applyCoupon); 

// --- Admin Routes ---
// Chỉ Admin mới được xem, tạo, cập nhật và xóa mã
router.get('/', verifyToken, isAdmin, getAllCoupons);
router.post('/', verifyToken, isAdmin, createCoupon);
router.patch('/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/:id', verifyToken, isAdmin, deleteCoupon);

export default router;