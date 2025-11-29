import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// 1. Xác thực người dùng (Đã đăng nhập chưa?)
export const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "Không có quyền truy cập! Vui lòng đăng nhập." });
  }

  // Frontend thường gửi dạng "Bearer <token>", ta cần cắt bỏ chữ "Bearer "
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    req.userId = decoded.id; // Lưu ID người dùng vào request để dùng ở bước sau
    req.userRole = decoded.role; // Lưu Role
    next();
  });
};

// 2. Xác thực Admin (Có phải sếp không?)
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user && user.role === 'admin') {
      next(); // Là Admin, cho qua
    } else {
      res.status(403).json({ message: "Truy cập bị từ chối! Chỉ dành cho Admin." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra quyền Admin" });
  }
};
