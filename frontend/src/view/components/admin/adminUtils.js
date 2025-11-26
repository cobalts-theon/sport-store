// Utility functions for admin panel

export const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', color: '#F44336' };
  if (stock < 20) return { text: 'Low Stock', color: '#FF9800' };
  return { text: 'In Stock', color: '#4CAF50' };
};

export const getPromotionStatus = (promotion) => {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  
  if (!promotion.active) return { text: 'Inactive', color: '#666' };
  if (now < start) return { text: 'Scheduled', color: '#2196F3' };
  if (now > end) return { text: 'Expired', color: '#F44336' };
  return { text: 'Active', color: '#4CAF50' };
};

export const getOrderStatus = (status) => {
  const statusMap = {
    pending: { text: 'Pending', color: '#FF9800' },
    processing: { text: 'Processing', color: '#2196F3' },
    shipped: { text: 'Shipped', color: '#9C27B0' },
    delivered: { text: 'Delivered', color: '#4CAF50' },
    cancelled: { text: 'Cancelled', color: '#F44336' }
  };
  return statusMap[status] || { text: status, color: '#666' };
};
