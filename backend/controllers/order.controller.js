import { Order, OrderItem } from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import sequelize from "../config/db.js";

export const createOrder = async (req, res) => {
    //Dùng transaction để báo lỗi nếu có bước nào đó không thành công: Nếu lỗi thì rollback lại toàn bộ
    const t = await sequelize.transaction();

    try {
        const { fullName, email, phone, address, cartItems, userId, subtotal, shippingFee, discount, couponCode, totalAmount } = req.body;

        // 1. Validate dữ liệu đầu vào
        if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
        }

        let calculatedTotal = 0;
        const orderItemsData = [];

        // 2. Duyệt qua từng sản phẩm trong giỏ để kiểm tra kho và lấy giá chuẩn từ DB
        for (const item of cartItems) {
        const product = await Product.findByPk(item.id, { transaction: t });

        if (!product) {
            throw new Error(`Product with id ${item.id} not found`);
        }

        // Kiểm tra tồn kho (Stock)
        if (product.stock < item.quantity) {
            throw new Error(`Product "${product.name}" is out of stock (Stock: ${product.stock})`);
        }

        // Trừ tồn kho
        await product.decrement('stock', { by: item.quantity, transaction: t });

            // Tính tổng tiền (Giá từ DB * Số lượng)
            calculatedTotal += Number(product.price) * item.quantity;

            // Chuẩn bị dữ liệu cho bảng OrderItem
            orderItemsData.push({
                // orderId sẽ được gán sau khi tạo Order
                productId: product.id,   // product_id
                quantity: item.quantity, // quantity
                price: product.price     // price (Giá tại thời điểm mua)
            });
        }

        // 3. Tính tổng tiền cuối cùng (áp dụng discount và shipping)
        const shippingAmount = shippingFee || 30000; // Default shipping 30,000 VND
        const discountAmount = discount || 0;
        const finalTotal = totalAmount || (calculatedTotal + shippingAmount - discountAmount);

        // 3. Tạo Đơn hàng (Order)
        const newOrder = await Order.create({
            userId: userId || null,
            fullName,
            email,
            phone,
            address,
            subtotal: calculatedTotal,
            shippingFee: shippingAmount,
            discount: discountAmount,
            couponCode: couponCode || null,
            totalAmount: finalTotal
        }, { transaction: t });

        // 3.5 Cập nhật usesCount của coupon nếu có
        if (couponCode) {
            await Coupon.increment('usesCount', {
                by: 1,
                where: { code: couponCode.toUpperCase() },
                transaction: t
            });
        }

        // 4. Tạo chi tiết đơn hàng (OrderItems)
        // Gán order_id vừa tạo vào danh sách items
        const finalItems = orderItemsData.map(item => ({
            ...item,
            orderId: newOrder.id // order_id
        }));

        // Lưu hàng loạt vào bảng order_items
        await OrderItem.bulkCreate(finalItems, { transaction: t });

        // 5. Xác nhận thành công (Commit Transaction)
        await t.commit();

        res.status(201).json({ 
            message: "Place order successfully", 
            orderId: newOrder.id 
        });} 
    catch (error) {
        // Nếu có lỗi, rollback transaction
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: 'Error creating order' });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Cập nhật trạng thái thành công', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng' });
    }
};

// Admin: Xóa đơn hàng
export const deleteOrder = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, { transaction: t });
        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Xóa các OrderItems trước
        await OrderItem.destroy({ 
            where: { orderId: orderId },
            transaction: t 
        });

        // Xóa Order
        await order.destroy({ transaction: t });

        await t.commit();
        res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi xóa đơn hàng' });
    }
};

// Admin: Cập nhật mã vận đơn (Tracking Number)
export const updateTrackingNumber = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { trackingNumber } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        order.trackingNumber = trackingNumber;
        
        // Tự động chuyển status sang shipping nếu có tracking number và đang pending
        if (trackingNumber && order.status === 'pending') {
            order.status = 'shipping';
        }
        
        await order.save();

        res.json({ 
            message: 'Cập nhật mã vận đơn thành công', 
            order: {
                id: order.id,
                trackingNumber: order.trackingNumber,
                status: order.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật mã vận đơn' });
    }
};

// Tra cứu đơn hàng theo mã vận đơn (Public)
export const getOrderByTracking = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const order = await Order.findOne({
            where: { trackingNumber },
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng với mã vận đơn này' });
        }

        // Trả về thông tin cơ bản (không bao gồm thông tin nhạy cảm)
        res.json({
            orderId: order.id,
            status: order.status,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: (order.OrderItems || []).map(item => ({
                name: item.Product?.name || 'Unknown',
                quantity: item.quantity
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi tra cứu đơn hàng' });
    }
};