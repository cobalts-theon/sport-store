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
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};