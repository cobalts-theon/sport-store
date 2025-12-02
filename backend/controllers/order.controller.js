import { Order, OrderItem } from "../models/order.model.js";
import Product from "../models/product.model.js";
import sequelize from "../config/db.js";

export const createOrder = async (req, res) => {
    //Dùng transaction để báo lỗi nếu có bước nào đó không thành công: Nếu lỗi thì rollback lại toàn bộ
    const t = await sequelize.transaction();

    try {
        const { fullName, email, phone, address, cartItems, userId } = req.body;

        // 1. Validate dữ liệu đầu vào
        if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng trống!" });
        }

        let calculatedTotal = 0;
        const orderItemsData = [];

        // 2. Duyệt qua từng sản phẩm trong giỏ để kiểm tra kho và lấy giá chuẩn từ DB
        for (const item of cartItems) {
        const product = await Product.findByPk(item.id, { transaction: t });

        if (!product) {
            throw new Error(`Sản phẩm ID ${item.id} không tồn tại!`);
        }

        // Kiểm tra tồn kho (Stock)
        if (product.stock < item.quantity) {
            throw new Error(`Sản phẩm "${product.name}" không đủ hàng (Còn: ${product.stock})`);
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

        // 3. Tạo Đơn hàng (Order)
        const newOrder = await Order.create({
            userId: userId || null,
            fullName,
            email,
            phone,
            address,
            totalAmount: calculatedTotal
        }, { transaction: t });

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
            message: "Đặt hàng thành công!", 
            orderId: newOrder.id 
        });} 
    catch (error) {
        // Nếu có lỗi, rollback transaction
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: 'Lỗi tạo đơn hàng' });
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