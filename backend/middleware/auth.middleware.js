import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// 1. Xác thực người dùng (Đã đăng nhập chưa?)
export const verifyToken = async (req, res, next) => {
  let token;

  // Lấy token từ header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Lấy phần sau "Bearer "

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      //Tìm user và gán vào req.user (Để controller dùng)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: "Token is valid but user not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({message: "No access! Please log in."});
    }
  }

  // if (!token) {
  //   return res.status(403).json({ message: "Token không hợp lệ" });
  // }

  // // Frontend thường gửi dạng "Bearer <token>", ta cần cắt bỏ chữ "Bearer "
  // if (token.startsWith('Bearer ')) {
  //   token = token.slice(7, token.length);
  // }

  // jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  //   }
  //   req.userId = decoded.id; // Lưu ID người dùng vào request để dùng ở bước sau
  //   req.userRole = decoded.role; // Lưu Role
  //   next();
  // });
};

// 2. Xác thực Admin (Có phải sếp không?)
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
};
