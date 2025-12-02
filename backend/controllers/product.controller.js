import Product from '../models/product.model.js';
import sequelize from '../config/db.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'ASC']]
    });
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
        const { name, description, price, stock, category, tag, brand, material, isHotDeal, originalPrice } = req.body;

        // Xử lý ảnh chính
        let imgUrl = '';
        if (req.files && req.files['image'] && req.files['image'][0]) {
            imgUrl = `/uploads/${req.files['image'][0].filename}`;
        }

        // Xử lý nhiều ảnh phụ
        let images = [];
        if (req.files && req.files['images']) {
            images = req.files['images'].map(file => `/uploads/${file.filename}`);
        }
        
        const newProduct = await Product.create({ 
            name, 
            description, 
            price: parseFloat(price), 
            stock: parseInt(stock), 
            category, 
            img_url: imgUrl,
            images: images,
            tag: tag || null,
            brand: brand || null,
            material: material || null,
            isHotDeal: isHotDeal === 'true' || isHotDeal === true,
            original_price: originalPrice ? parseFloat(originalPrice) : null
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm (Chỉ Admin)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, tag, brand, material, isHotDeal, originalPrice, existingImages } = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xử lý ảnh chính nếu có upload mới
        let imgUrl = product.img_url;
        if (req.files && req.files['image'] && req.files['image'][0]) {
            imgUrl = `/uploads/${req.files['image'][0].filename}`;
        }

        // Xử lý ảnh phụ
        let images = [];
        
        // Giữ lại các ảnh cũ nếu có
        if (existingImages) {
            try {
                images = JSON.parse(existingImages);
            } catch (e) {
                images = [];
            }
        }
        
        // Thêm các ảnh mới upload
        if (req.files && req.files['images']) {
            const newImages = req.files['images'].map(file => `/uploads/${file.filename}`);
            images = [...images, ...newImages];
        }

        await product.update({ 
            name, 
            description, 
            price: parseFloat(price), 
            stock: parseInt(stock),
            category,
            img_url: imgUrl,
            images: images,
            tag: tag || null,
            brand: brand || null,
            material: material || null,
            isHotDeal: isHotDeal === 'true' || isHotDeal === true,
            original_price: originalPrice ? parseFloat(originalPrice) : null
        });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
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

