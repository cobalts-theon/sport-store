import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    discountType: {
        type: DataTypes.ENUM('percent', 'fixed'),
        defaultValue: 'percent',
        field: 'discount_type' // Map với cột discount_type trong DB
    },
    discountValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'discount_value' // Map với cột discount_value
    },
    minOrderAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'min_order_amount' // Map với cột min_order_amount
    },
    maxUses: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        field: 'max_uses'
    },
    usesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'uses_count'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'coupons',
    timestamps: true,
    underscored: true // Tự động map createdAt -> created_at
});

export default Coupon;