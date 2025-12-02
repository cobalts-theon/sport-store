import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Upload fields cho nhiều ảnh
const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },      // Ảnh chính
  { name: 'images', maxCount: 10 }     // Ảnh phụ (tối đa 10)
]);

// Lấy tất cả sản phẩm (Public)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Thêm sản phẩm mới (Chỉ Admin)
router.post('/', verifyToken, isAdmin, productUpload, addProduct);
router.put('/:id', verifyToken, isAdmin, productUpload, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;