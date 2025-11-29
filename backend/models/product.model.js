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
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING, 
        allowNull: true, 
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
        defaultValue: false
    },
    stock: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0
    },
}, {
    tableName: 'products',
    timestamps: true,
});

export default Product;