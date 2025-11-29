import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  port: process.env.PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connect on port:'. concat(process.env.PORT));
    console.log('Connected successfully to MySQL database!');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1); // Thoát ứng dụng nếu lỗi kết nối
  }
}

// Chạy kiểm tra kết nối khi khởi động ứng dụng
checkConnection();

export default pool;