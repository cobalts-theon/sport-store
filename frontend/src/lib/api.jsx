//Tạo file api.jsx để cấu hình axios cho việc gọi API từ frontend đến backend để tiện sử dụng trong các component khác nhau
import axios from "axios";

//Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
    baseURL: "http://localhost:3000/api", // Địa chỉ backend
    headers: {
        'Content-Type': 'application/json'  // Kiểu dữ liệu gửi đi là JSON  
    }
});

// Thêm interceptor để tự động gắn token vào header Authorization nếu có trước khi gửi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Gắn token vào header
    }
    return config;
}), (error) => {
    return Promise.reject(error);
}

export default api;