import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { Order } from '../models/order.model.js';

export const getStatistics = async (req, res) => {
    try {
        // Tổng số người dùng
        const totalUsers = await User.count();

        // Tổng số sản phẩm
        const totalProducts = await Product.count();

        // Tổng số đơn hàng
        const totalOrders = await Order.count();

        // Tính tổng doanh thu (Cộng totalAmount của tất cả đơn hàng)
        const totalRevenueData = await Order.sum('totalAmount');
        const totalRevenue = totalRevenueData || 0;

        res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lần tống quan' });
    }
};