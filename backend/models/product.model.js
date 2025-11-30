import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define('Product',{
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING, 
        allowNull: true, 
        field: 'img',
        comment: 'Đường dẫn ảnh sản phẩm (Vì database không lưu ảnh nên chỉ lưu đường dẫn)'
    },
    hover: {
        type: DataTypes.STRING, 
        allowNull: true, 
        comment: 'Ảnh hiển thị khi di chuột vào (Có thể null)'
    },
    link: {
        type: DataTypes.STRING, 
        allowNull: true,defaultValue: '#', 
        comment: 'Link sản phẩm'
    },
    tag: {
        type: DataTypes.STRING, 
        allowNull: true, 
        comment: 'Tag sản phẩm'
    },
    category: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    original_price: {
        type: DataTypes.FLOAT, 
        field: 'originalPrice',
        allowNull: true
    },
    material: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING, 
        allowNull: true},
    isHotDeal: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        field: 'is_hot_deal'
    },
    stock: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 100
    },
}, {
    tableName: 'products',
    underscored: false, // Quan trọng: Tắt cái này đi để nó tìm 'createdAt' thay vì 'created_at'
    timestamps: true,
});

export default Product;