import multer from 'multer';    //multer là middleware xử lý file upload trong Node.js có tác dụng phân tích các yêu cầu đa phần (multipart/form-data) và lưu trữ các file tải lên từ client.
import path from 'path';

// Cấu hình lưu trữ cho multer (Tên file và thư mục lưu)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu file tải lên
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất: timestamp + tên gốc
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname));
    }
});

// Lọc file: Chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|heic|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép tải lên các file ảnh!'));
    }
};

// Tạo middleware upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file: 5MB
});

export default upload;