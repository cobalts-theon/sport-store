import Product from '../models/product.model.js';
import sequelize from '../config/db.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm mới (Chỉ Admin)
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // Xử lý ảnh nếu có
        let imgUrl = '';
        if (req.file) {
            imgUrl = `/uploads/${req.file.filename}`; // Lưu đường dẫn ảnh
        }
        const newProduct = await Product.create({ name, description, price, stock, category, img_url: imgUrl });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm (Chỉ Admin)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update({ name, description, price, stock });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm (Chỉ Admin) 
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

