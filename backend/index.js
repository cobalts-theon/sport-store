import express from 'express'
import dotenv from 'dotenv'

//nạp .env
dotenv.config()
//tạo app express
const app = express()
//Lấy cổng từ biến môi trường, nếu không có thì dùng 3000
const port = process.env.PORT || 3000

app.get('/', (req ,res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
