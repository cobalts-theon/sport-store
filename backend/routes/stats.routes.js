import express from 'express';
import { getStatistics } from '../controllers/stats.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();    

// Lấy thống kê tổng quan (Chỉ Admin)
router.get('/', verifyToken, isAdmin, getStatistics);

export default router;