import express from 'express';
import { createOrder, getOrdersByUser, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);

// Admin routes
router.get('/', getAllOrders);
router.patch('/:orderId/status', updateOrderStatus);
router.delete('/:orderId', deleteOrder);

export default router;