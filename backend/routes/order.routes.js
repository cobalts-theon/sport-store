import express from 'express';
import { 
    createOrder, 
    getOrdersByUser, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder,
    updateTrackingNumber,
    getOrderByTracking
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);

// Tra cứu đơn hàng theo tracking number (Public)
router.get('/track/:trackingNumber', getOrderByTracking);

// Admin routes
router.get('/', getAllOrders);
router.patch('/:orderId/status', updateOrderStatus);
router.patch('/:orderId/tracking', updateTrackingNumber);
router.delete('/:orderId', deleteOrder);

export default router;