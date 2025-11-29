import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import productsRoutes from './routes/product.routes.js'
// import authRoutes from './routes/auth.routes.js'
// import orderRoutes from './routes/order.routes.js'

//nạp .env
dotenv.config()
//tạo app express
const app = express()

app.use(express.json()) // Để xử lý dữ liệu JSON trong request
app.use(cors()) // Cho phép các yêu cầu tài nguyên từ các nguồn khác nhau
//Lấy cổng từ biến môi trường, nếu không có thì dùng 3000
const port = process.env.PORT || 3000

// //Routes
// app.use('/api/products', productsRoutes)
// app.use('/api/auth', authRoutes)
// app.use('/api/orders', orderRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
