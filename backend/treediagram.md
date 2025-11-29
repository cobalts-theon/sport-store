backend/
│
├── config/
│   └── db.js               # Cấu hình kết nối MySQL (đã có file nhưng cần hoàn thiện)
│
├── controllers/            # Nơi xử lý logic chính (Logic Admin & User)
│   ├── auth.controller.js  # Xử lý đăng ký, đăng nhập, quên mật khẩu
│   ├── product.controller.js # Xử lý thêm/sửa/xóa/lấy sản phẩm
│   ├── order.controller.js   # Xử lý đặt hàng và xem đơn hàng
│   ├── user.controller.js    # Quản lý người dùng (dành cho Admin)
│   └── stats.controller.js   # Xử lý số liệu cho Admin Dashboard (Analytics)
│
├── middleware/             # Các hàm kiểm tra trung gian
│   ├── auth.middleware.js  # Kiểm tra xem user đã đăng nhập chưa (Verify Token)
│   └── admin.middleware.js # Kiểm tra xem user có phải là ADMIN không
│
├── models/                 # Định nghĩa cấu trúc dữ liệu (nếu dùng Sequelize) hoặc các hàm SQL
│   ├── user.model.js
│   ├── product.model.js
│   └── order.model.js
│
├── routes/                 # Định nghĩa các đường dẫn API
│   ├── auth.routes.js      # VD: /api/auth/login, /api/auth/signup
│   ├── product.routes.js   # VD: /api/products (đã có)
│   ├── order.routes.js     # VD: /api/orders
│   ├── user.routes.js      # VD: /api/users (Admin only)
│   └── stats.routes.js     # VD: /api/admin/stats
│
├── utils/                  # Các hàm phụ trợ
│   └── sendEmail.js        # Cấu hình Nodemailer để gửi mail
│
├── .env                    # Biến môi trường (DB_HOST, JWT_SECRET...)
├── index.js                # File chạy chính (đã có)
└── package.json            # Khai báo thư viện (đã có)