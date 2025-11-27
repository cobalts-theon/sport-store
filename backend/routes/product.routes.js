import express from 'express';
import db from '../config/db.js'; // Giả sử bạn đã tạo file db.js

const router = express.Router();

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server Error');
  }
});

// Thêm sản phẩm mới (Cần middleware kiểm tra quyền Admin)
router.post('/', (req, res) => {
  // Logic thêm sản phẩm vào DB
  res.send('Add new product endpoint');
});

export default router;