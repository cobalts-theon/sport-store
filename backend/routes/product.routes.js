import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Lấy tất cả sản phẩm (Public)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Thêm sản phẩm mới (Chỉ Admin)
router.post('/', verifyToken, isAdmin, addProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;