# 📚 Prime Souls API Documentation

> **Base URL:** `http://localhost:3000/api`  
> **Version:** 1.0.0  
> **Last Updated:** December 2025

---

## 📑 Mục Lục

- [1. Authentication & Users](#1-authentication--users)
- [2. Products](#2-products)
- [3. Orders](#3-orders)
- [4. Coupons](#4-coupons)
- [5. Statistics](#5-statistics)
- [6. Data Models](#6-data-models)

---

## 🔐 Authentication

Hệ thống sử dụng **JWT (JSON Web Token)** để xác thực. Token có thời hạn **3 ngày**.

### Headers
```
Authorization: Bearer <token>
```

### Roles
| Role | Mô tả |
|------|-------|
| `customer` | Khách hàng thông thường |
| `admin` | Quản trị viên |

### User Status
| Status | Mô tả |
|--------|-------|
| `active` | Tài khoản hoạt động bình thường |
| `suspended` | Tài khoản bị tạm ngưng |
| `pending` | Tài khoản chờ duyệt |

---

## 1. Authentication & Users

### 1.1 Đăng ký tài khoản
```
POST /users/register
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ✅ | Tên người dùng |
| `email` | string | ✅ | Email (unique) |
| `password` | string | ✅ | Mật khẩu |
| `phone` | string | ❌ | Số điện thoại |
| `address` | string | ❌ | Địa chỉ |

**Response Success (201):**
```json
{
  "message": "Sign up successfully",
  "userId": 1
}
```

**Response Error (400):**
```json
{
  "message": "Email already exists"
}
```

---

### 1.2 Đăng nhập
```
POST /users/login
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `email` | string | ✅ | Email đã đăng ký |
| `password` | string | ✅ | Mật khẩu |

**Response Success (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "avatar": "uploads/avatar.jpg",
    "phone": "0123456789",
    "address": "123 Street"
  }
}
```

**Response Error:**
- `400`: Email or Password is incorrect
- `403`: Your account has been suspended / pending approval

---

### 1.3 Đăng nhập bằng Google OAuth
```
POST /users/google-login
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `email` | string | ✅ | Email từ Google |
| `name` | string | ✅ | Tên từ Google |
| `avatar` | string | ❌ | URL avatar từ Google |

**Response Success (200):**
```json
{
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "customer",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```

---

### 1.4 Quên mật khẩu - Gửi mã xác thực
```
POST /users/forgot-password
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `email` | string | ✅ | Email đã đăng ký |

**Response Success (200):**
```json
{
  "message": "Verification code sent successfully"
}
```

> ⏱️ Mã xác thực có hiệu lực trong **4 phút**

---

### 1.5 Xác thực mã code
```
POST /users/verify-code
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `email` | string | ✅ | Email |
| `code` | string | ✅ | Mã 6 chữ số |

**Response Success (200):**
```json
{
  "message": "Verification code is correct"
}
```

---

### 1.6 Đặt lại mật khẩu
```
POST /users/reset-password
```

**Quyền truy cập:** Public

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `email` | string | ✅ | Email |
| `code` | string | ✅ | Mã xác thực |
| `newPassword` | string | ✅ | Mật khẩu mới |

**Response Success (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### 1.7 Lấy thông tin Profile
```
GET /users/profile
```

**Quyền truy cập:** 🔒 Authenticated User

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "status": "active",
  "phone": "0123456789",
  "address": "123 Street",
  "avatar": "uploads/avatar.jpg"
}
```

---

### 1.8 Cập nhật Profile
```
PUT /users/profile
```

**Quyền truy cập:** 🔒 Authenticated User

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ❌ | Tên mới |
| `phone` | string | ❌ | Số điện thoại mới |
| `address` | string | ❌ | Địa chỉ mới |
| `avatar` | file | ❌ | File ảnh avatar |

**Response Success (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "0987654321",
    "address": "456 New Street",
    "avatar": "uploads/new-avatar.jpg",
    "role": "customer"
  }
}
```

---

### 1.9 Đổi mật khẩu
```
PUT /users/profile/password
```

**Quyền truy cập:** 🔒 Authenticated User

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `currentPassword` | string | ✅ | Mật khẩu hiện tại |
| `newPassword` | string | ✅ | Mật khẩu mới |

**Response Success (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Response Error (400):**
```json
{
  "message": "Current password is incorrect"
}
```

---

### 1.10 Lấy danh sách tất cả Users (Admin)
```
GET /users
```

**Quyền truy cập:** 🔒 Admin Only

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "status": "active",
    "phone": "0123456789",
    "address": "123 Street",
    "avatar": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "totalOrders": 5,
    "totalSpent": 1500000
  }
]
```

---

### 1.11 Tạo User mới (Admin)
```
POST /users/admin-create
```

**Quyền truy cập:** 🔒 Admin Only

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ✅ | Tên |
| `email` | string | ✅ | Email |
| `password` | string | ✅ | Mật khẩu |
| `role` | string | ❌ | `customer` / `admin` (default: customer) |
| `status` | string | ❌ | `active` / `suspended` / `pending` (default: active) |
| `phone` | string | ❌ | Số điện thoại |
| `address` | string | ❌ | Địa chỉ |

---

### 1.12 Cập nhật User (Admin)
```
PUT /users/:id
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID của user |

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ❌ | Tên mới |
| `email` | string | ❌ | Email mới |
| `role` | string | ❌ | Role mới |
| `status` | string | ❌ | Status mới |
| `phone` | string | ❌ | Số điện thoại |
| `address` | string | ❌ | Địa chỉ |

---

### 1.13 Xóa User (Admin)
```
DELETE /users/:id
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID của user cần xóa |

**Response Success (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## 2. Products

### 2.1 Lấy tất cả sản phẩm
```
GET /products
```

**Quyền truy cập:** Public

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "Nike Air Max",
    "description": "Comfortable running shoes",
    "price": 2500000,
    "original_price": 3000000,
    "img_url": "/uploads/nike-air-max.jpg",
    "images": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
    "category": "Sneakers",
    "tag": "Hot",
    "brand": "Nike",
    "material": "Leather",
    "isHotDeal": true,
    "stock": 50,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 2.2 Lấy sản phẩm theo ID
```
GET /products/:id
```

**Quyền truy cập:** Public

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID sản phẩm |

**Response Success (200):**
```json
{
  "id": 1,
  "name": "Nike Air Max",
  "description": "Comfortable running shoes",
  "price": 2500000,
  "original_price": 3000000,
  "img_url": "/uploads/nike-air-max.jpg",
  "images": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
  "category": "Sneakers",
  "tag": "Hot",
  "brand": "Nike",
  "material": "Leather",
  "isHotDeal": true,
  "stock": 50
}
```

**Response Error (404):**
```json
{
  "message": "Product not found"
}
```

---

### 2.3 Thêm sản phẩm mới (Admin)
```
POST /products
```

**Quyền truy cập:** 🔒 Admin Only

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ✅ | Tên sản phẩm |
| `description` | string | ❌ | Mô tả |
| `price` | number | ✅ | Giá bán |
| `originalPrice` | number | ❌ | Giá gốc (trước giảm giá) |
| `stock` | integer | ✅ | Số lượng tồn kho |
| `category` | string | ✅ | Danh mục |
| `tag` | string | ❌ | Tag (Hot, New, Sale...) |
| `brand` | string | ❌ | Thương hiệu |
| `material` | string | ❌ | Chất liệu |
| `isHotDeal` | boolean | ❌ | Đánh dấu Hot Deal |
| `image` | file | ❌ | Ảnh chính (1 file) |
| `images` | files | ❌ | Ảnh phụ (tối đa 10 files) |

**Response Success (201):**
```json
{
  "id": 1,
  "name": "Nike Air Max",
  "price": 2500000,
  "stock": 50,
  "category": "Sneakers",
  "img_url": "/uploads/nike-air-max.jpg",
  "images": ["/uploads/img1.jpg"],
  ...
}
```

---

### 2.4 Cập nhật sản phẩm (Admin)
```
PUT /products/:id
```

**Quyền truy cập:** 🔒 Admin Only

**Content-Type:** `multipart/form-data`

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID sản phẩm |

**Request Body:** (Tương tự thêm sản phẩm)

Thêm field:
| Field | Type | Mô tả |
|-------|------|-------|
| `existingImages` | JSON string | Danh sách ảnh cũ cần giữ lại |

---

### 2.5 Xóa sản phẩm (Admin)
```
DELETE /products/:id
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID sản phẩm |

**Response Success (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## 3. Orders

### 3.1 Tạo đơn hàng mới
```
POST /orders
```

**Quyền truy cập:** Public (Cho phép khách vãng lai)

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `fullName` | string | ✅ | Tên người nhận |
| `email` | string | ✅ | Email |
| `phone` | string | ✅ | Số điện thoại |
| `address` | string | ✅ | Địa chỉ giao hàng |
| `userId` | integer | ❌ | ID user (nếu đã đăng nhập) |
| `cartItems` | array | ✅ | Danh sách sản phẩm |
| `subtotal` | number | ❌ | Tổng tiền hàng |
| `shippingFee` | number | ❌ | Phí ship (default: 30000) |
| `discount` | number | ❌ | Số tiền giảm |
| `couponCode` | string | ❌ | Mã giảm giá |
| `totalAmount` | number | ❌ | Tổng thanh toán |

**cartItems structure:**
```json
[
  {
    "id": 1,
    "quantity": 2
  },
  {
    "id": 3,
    "quantity": 1
  }
]
```

**Response Success (201):**
```json
{
  "message": "Đặt hàng thành công!",
  "orderId": 123
}
```

**Response Error:**
- `400`: Giỏ hàng trống
- `500`: Sản phẩm không tồn tại / không đủ hàng

---

### 3.2 Lấy đơn hàng theo User
```
GET /orders/user/:userId
```

**Quyền truy cập:** Public

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `userId` | integer | ID của user |

**Response Success (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Street",
    "totalAmount": 2530000,
    "subtotal": 2500000,
    "shippingFee": 30000,
    "discount": 0,
    "couponCode": null,
    "status": "pending",
    "trackingNumber": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "OrderItems": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": 1250000,
        "Product": {
          "id": 1,
          "name": "Nike Air Max",
          "img_url": "/uploads/nike.jpg"
        }
      }
    ]
  }
]
```

---

### 3.3 Tra cứu đơn hàng theo mã vận đơn
```
GET /orders/track/:trackingNumber
```

**Quyền truy cập:** Public

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `trackingNumber` | string | Mã vận đơn |

**Response Success (200):**
```json
{
  "orderId": 1,
  "status": "shipping",
  "trackingNumber": "VN123456789",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z",
  "items": [
    {
      "name": "Nike Air Max",
      "quantity": 2
    }
  ]
}
```

---

### 3.4 Lấy tất cả đơn hàng (Admin)
```
GET /orders
```

**Quyền truy cập:** 🔒 Admin Only

**Response:** Danh sách tất cả đơn hàng với đầy đủ thông tin

---

### 3.5 Cập nhật trạng thái đơn hàng (Admin)
```
PATCH /orders/:orderId/status
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `orderId` | integer | ID đơn hàng |

**Request Body:**
| Field | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | ✅ | `pending` / `shipping` / `completed` / `cancelled` |

**Order Status Flow:**
```
pending → shipping → completed
    ↓
cancelled
```

**Response Success (200):**
```json
{
  "message": "Cập nhật trạng thái thành công",
  "order": { ... }
}
```

---

### 3.6 Cập nhật mã vận đơn (Admin)
```
PATCH /orders/:orderId/tracking
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `orderId` | integer | ID đơn hàng |

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `trackingNumber` | string | ✅ | Mã vận đơn |

> ⚡ Auto-update: Khi thêm tracking number và status đang là `pending`, hệ thống tự động chuyển sang `shipping`

**Response Success (200):**
```json
{
  "message": "Cập nhật mã vận đơn thành công",
  "order": {
    "id": 1,
    "trackingNumber": "VN123456789",
    "status": "shipping"
  }
}
```

---

### 3.7 Xóa đơn hàng (Admin)
```
DELETE /orders/:orderId
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `orderId` | integer | ID đơn hàng |

**Response Success (200):**
```json
{
  "message": "Xóa đơn hàng thành công"
}
```

---

## 4. Coupons

### 4.1 Lấy danh sách coupon khả dụng
```
GET /coupons/available
```

**Quyền truy cập:** Public

**Response Success (200):**
```json
[
  {
    "id": 1,
    "code": "SAVE10",
    "discountType": "percent",
    "discountValue": 10,
    "minOrderAmount": 500000,
    "maxUses": 100,
    "usesCount": 25,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T23:59:59.000Z"
  }
]
```

> Chỉ trả về coupon:
> - `isActive = true`
> - Trong thời gian hiệu lực
> - Chưa hết lượt sử dụng

---

### 4.2 Áp dụng mã giảm giá
```
POST /coupons/apply
```

**Quyền truy cập:** 🔒 Authenticated User

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `code` | string | ✅ | Mã coupon |
| `orderTotal` | number | ✅ | Tổng giá trị đơn hàng |

**Response Success (200):**
```json
{
  "success": true,
  "code": "SAVE10",
  "discountAmount": 250000,
  "newTotal": 2250000,
  "message": "Coupon applied successfully!"
}
```

**Response Error:**
- `404`: Invalid coupon code
- `400`: Coupon is not yet active / has expired / usage limit reached / Order amount too low

---

### 4.3 Lấy tất cả coupons (Admin)
```
GET /coupons
```

**Quyền truy cập:** 🔒 Admin Only

---

### 4.4 Tạo coupon mới (Admin)
```
POST /coupons
```

**Quyền truy cập:** 🔒 Admin Only

**Request Body:**
| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `code` | string | ✅ | Mã coupon (unique, auto uppercase) |
| `discountType` | string | ❌ | `percent` / `fixed` (default: percent) |
| `discountValue` | integer | ✅ | Giá trị giảm (% hoặc VND) |
| `minOrderAmount` | integer | ❌ | Đơn hàng tối thiểu (default: 0) |
| `maxUses` | integer | ❌ | Số lượt sử dụng tối đa (default: 100) |
| `startDate` | datetime | ❌ | Ngày bắt đầu |
| `endDate` | datetime | ❌ | Ngày kết thúc |
| `isActive` | boolean | ❌ | Kích hoạt (default: true) |

**Discount Types:**
| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `percent` | Giảm theo phần trăm | `discountValue: 10` = giảm 10% |
| `fixed` | Giảm số tiền cố định | `discountValue: 50000` = giảm 50,000đ |

---

### 4.5 Cập nhật coupon (Admin)
```
PATCH /coupons/:id
```

**Quyền truy cập:** 🔒 Admin Only

**URL Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| `id` | integer | ID coupon |

**Request Body:** (Các field tương tự tạo mới, tất cả optional)

---

### 4.6 Xóa coupon (Admin)
```
DELETE /coupons/:id
```

**Quyền truy cập:** 🔒 Admin Only

**Response Success (200):**
```json
{
  "message": "Coupon deleted successfully"
}
```

---

## 5. Statistics

### 5.1 Lấy thống kê tổng quan
```
GET /stats
```

**Quyền truy cập:** 🔒 Admin Only

**Response Success (200):**
```json
{
  "totalUsers": 150,
  "totalProducts": 45,
  "totalOrders": 320,
  "totalRevenue": 125000000
}
```

| Field | Type | Mô tả |
|-------|------|-------|
| `totalUsers` | integer | Tổng số người dùng |
| `totalProducts` | integer | Tổng số sản phẩm |
| `totalOrders` | integer | Tổng số đơn hàng |
| `totalRevenue` | number | Tổng doanh thu (VND) |

---

## 6. Data Models

### 6.1 User Model
```javascript
{
  id: Integer (PK, Auto Increment),
  name: String (Required),
  email: String (Required, Unique),
  password: String (Required, Hashed),
  role: Enum ['customer', 'admin'] (Default: 'customer'),
  status: Enum ['active', 'suspended', 'pending'] (Default: 'pending'),
  phone: String (Nullable),
  address: String (Nullable),
  avatar: String (Nullable),
  verificationCode: String (Nullable),
  codeExpiredAt: DateTime (Nullable),
  created_at: DateTime,
  updated_at: DateTime
}
```

### 6.2 Product Model
```javascript
{
  id: Integer (PK, Auto Increment),
  name: String (Required),
  description: Text (Nullable),
  price: Float (Required),
  original_price: Float (Nullable),
  img_url: String (Nullable) - Ảnh chính,
  images: JSON Array (Default: []) - Ảnh phụ,
  hover: String (Nullable) - Ảnh hover,
  link: String (Default: '#'),
  tag: String (Nullable),
  category: String (Required),
  material: String (Nullable),
  brand: String (Nullable),
  isHotDeal: Boolean (Default: false),
  stock: Integer (Default: 100),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 6.3 Order Model
```javascript
{
  id: Integer (PK, Auto Increment),
  userId: Integer (FK -> User, Nullable),
  fullName: String (Required),
  email: String (Required),
  phone: String (Required),
  address: Text (Required),
  totalAmount: Decimal(10,2) (Required),
  subtotal: Decimal(10,2) (Nullable),
  shippingFee: Decimal(10,2) (Default: 0),
  discount: Decimal(10,2) (Default: 0),
  couponCode: String (Nullable),
  status: Enum ['pending', 'shipping', 'completed', 'cancelled'] (Default: 'pending'),
  trackingNumber: String (Nullable),
  created_at: DateTime,
  updated_at: DateTime
}
```

### 6.4 OrderItem Model
```javascript
{
  id: Integer (PK, Auto Increment),
  orderId: Integer (FK -> Order, Required),
  productId: Integer (FK -> Product, Required),
  quantity: Integer (Required),
  price: Decimal(10,2) (Required) - Giá tại thời điểm mua
}
```

### 6.5 Coupon Model
```javascript
{
  id: Integer (PK, Auto Increment),
  code: String (Required, Unique),
  discountType: Enum ['percent', 'fixed'] (Default: 'percent'),
  discountValue: Integer (Required),
  minOrderAmount: Integer (Default: 0),
  maxUses: Integer (Default: 100),
  usesCount: Integer (Default: 0),
  startDate: DateTime (Nullable),
  endDate: DateTime (Nullable),
  isActive: Boolean (Default: true),
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## 📝 Error Response Format

Tất cả lỗi trả về theo format:
```json
{
  "message": "Error description here"
}
```

### Common HTTP Status Codes
| Code | Mô tả |
|------|-------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad Request - Invalid data |
| `401` | Unauthorized - Token missing/invalid |
| `403` | Forbidden - No permission |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## 🔧 Middleware

### verifyToken
- Kiểm tra JWT token trong header `Authorization`
- Decode và attach `req.user` với thông tin user

### isAdmin
- Kiểm tra `req.user.role === 'admin'`
- Return 403 nếu không phải admin

### upload (Multer)
- Xử lý upload file
- Lưu vào folder `uploads/`
- Support: `image`, `images[]`

---

## 📌 Notes

1. **Tất cả giá tiền** được tính bằng VND
2. **Token hết hạn** sau 3 ngày
3. **Mã xác thực email** có hiệu lực 4 phút
4. **Coupon code** tự động chuyển thành UPPERCASE
5. **Stock** được tự động giảm khi tạo đơn hàng thành công
6. **Tracking number** khi được cập nhật sẽ tự động chuyển status sang `shipping`

---

> 📧 **Contact:** support@primesouls.com  
> 🌐 **Website:** https://primesouls.com
