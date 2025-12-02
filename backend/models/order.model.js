import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// 1. Bảng Order (Đơn hàng tổng)
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cho phép khách vãng lai (không đăng nhập)
    field: 'user_id' // Tên cột trong DB là user_id
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  email: {
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  address: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    field: 'shipping_address'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2), // Tổng tiền với 2 chữ số thập phân
    allowNull: false,
    field: 'total_amount'
  },
  status: {
    type: DataTypes.ENUM('pending', 'shipping', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tracking_number' // Map với cột tracking_number trong DB
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true // Tự động chuyển camelCase sang snake_case (createdAt -> created_at)
});

// 2. Bảng OrderItem (Chi tiết từng món) - ĐÚNG CẤU TRÚC BẠN YÊU CẦU
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // order_id và product_id sẽ được Sequelize tự động tạo khi thiết lập quan hệ,
  // nhưng ta khai báo rõ ở đây để code minh bạch.
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id' // Tên cột trong DB: order_id
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id' // Tên cột trong DB: product_id
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Giá tại thời điểm mua'
  }
}, {
  tableName: 'order_items',
  timestamps: false, // Bảng này thường không cần created_at
  underscored: true
});

export { Order, OrderItem };