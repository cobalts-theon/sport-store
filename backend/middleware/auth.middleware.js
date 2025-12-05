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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
};

// 2. Xác thực Admin (Có phải sếp không?) (Nếu là BigBoss thì cho qua, or người dùng thì chim cút) (When you cant even say my name!!!!)
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
};
