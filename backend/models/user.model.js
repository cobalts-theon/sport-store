import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";   

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'), 
        defaultValue: 'customer'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending'), 
        defaultValue: 'pending'
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    address: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    verificationCode: {
        type: DataTypes.STRING, 
        allowNull: true,
        field: 'verification_code'
    },
    codeExpiredAt: {
        type: DataTypes.DATE, 
        allowNull: true,
        field: 'code_expired_at'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default User;