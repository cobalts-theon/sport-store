import Coupon from '../models/coupon.model.js';
import { Op } from 'sequelize';

// --- ADMIN: Create New Coupon ---
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxUses, startDate, endDate, isActive } = req.body;
        
        // Validate required fields
        if (!code || !discountValue) {
            return res.status(400).json({ message: "Code and discount value are required!" });
        }
        
        // Kiểm tra xem mã đã tồn tại chưa
        const existingCoupon = await Coupon.findOne({ where: { code: code.toUpperCase() } });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists!" });
        }

        const newCoupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType: discountType || 'percent', 
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxUses: maxUses || 100,
            startDate: startDate || null,
            endDate: endDate || null,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json(newCoupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
};

// --- ADMIN: Get All Coupons ---
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.findAll();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupons" });
    }
};

// --- ADMIN: Delete Coupon ---
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await Coupon.destroy({ where: { id } });
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting coupon" });
    }
};

// --- ADMIN: Update Coupon ---
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discountType, discountValue, minOrderAmount, maxUses, startDate, endDate, isActive } = req.body;
        
        const coupon = await Coupon.findByPk(id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        // Nếu cập nhật code, kiểm tra xem code mới có trùng không
        if (code && code !== coupon.code) {
            const existingCoupon = await Coupon.findOne({ where: { code: code.toUpperCase() } });
            if (existingCoupon) {
                return res.status(400).json({ message: "Coupon code already exists!" });
            }
        }

        // Cập nhật các trường nếu được gửi lên
        await coupon.update({
            code: code ? code.toUpperCase() : coupon.code,
            discountType: discountType !== undefined ? discountType : coupon.discountType,
            discountValue: discountValue !== undefined ? discountValue : coupon.discountValue,
            minOrderAmount: minOrderAmount !== undefined ? minOrderAmount : coupon.minOrderAmount,
            maxUses: maxUses !== undefined ? maxUses : coupon.maxUses,
            startDate: startDate !== undefined ? startDate : coupon.startDate,
            endDate: endDate !== undefined ? endDate : coupon.endDate,
            isActive: isActive !== undefined ? isActive : coupon.isActive
        });

        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating coupon", error: error.message });
    }
};

// --- USER: Apply Coupon (Logic quan trọng nhất) ---
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        
        // 1. Tìm mã trong DB
        const coupon = await Coupon.findOne({ 
            where: { 
                code: code, 
                isActive: true 
            } 
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code!" });
        }

        const now = new Date();

        // 2. Kiểm tra thời gian hiệu lực
        if (coupon.startDate && new Date(coupon.startDate) > now) {
            return res.status(400).json({ message: "Coupon is not yet active!" });
        }
        if (coupon.endDate && new Date(coupon.endDate) < now) {
            return res.status(400).json({ message: "Coupon has expired!" });
        }

        // 3. Kiểm tra số lượt sử dụng
        if (coupon.maxUses > 0 && coupon.usesCount >= coupon.maxUses) {
            return res.status(400).json({ message: "Coupon usage limit reached!" });
        }

        // 4. Kiểm tra giá trị đơn hàng tối thiểu
        if (orderTotal < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Order amount must be at least ${coupon.minOrderAmount.toLocaleString()} to use this coupon.` 
            });
        }

        // 5. Tính toán số tiền được giảm
        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
            discountAmount = (orderTotal * coupon.discountValue) / 100;
            // (Optional) Có thể thêm logic giới hạn số tiền giảm tối đa (maxDiscount) tại đây
        } else {
            discountAmount = coupon.discountValue;
        }

        // Đảm bảo không giảm quá giá trị đơn hàng
        if (discountAmount > orderTotal) {
            discountAmount = orderTotal;
        }

        res.json({
            success: true,
            code: coupon.code,
            discountAmount: discountAmount,
            newTotal: orderTotal - discountAmount,
            message: "Coupon applied successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error applying coupon" });
    }
};