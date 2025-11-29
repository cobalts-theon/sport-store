import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

//import models
import User from './models/user.model.js'
import Product from './models/product.model.js'
import { Order, OrderItem } from './models/order.model.js'

//import routes
import orderRoutes from './routes/order.routes.js'
// import productRoutes from './routes/product.routes.js'
import statsRoutes from './routes/stats.routes.js'
import usersRoutes from './routes/user.routes.js'

//nạp .env
dotenv.config()
//tạo app express
const app = express()

app.use(express.json()) // Để xử lý dữ liệu JSON trong request
app.use(cors()) // Cho phép các yêu cầu tài nguyên từ các nguồn khác nhau
//Lấy cổng từ biến môi trường, nếu không có thì dùng 3000
const port = process.env.PORT || 3000

//Thiết lập quan hệ User - Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

//Thiết lập quan hệ Order - Product thông qua OrderItem
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

//Quan hệ phụ để dễ truy vấn trực tiếp từ orderitem
Order.hasMany(OrderItem, { foreignKey: 'orderId' });  
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Sử dụng các routes cho đơn hàng
app.use('/api/orders', orderRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
