// adminUtils.js chứa các hàm tiện ích để xác định trạng thái của sản phẩm, khuyến mãi và đơn hàng trong trang quản trị
//Liên quan đến frontend/src/view/components/admin/AdminHeader.jsx
//Liên quan đến frontend/src/view/components/admin/AdminSidebar.jsx

export const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', color: '#F44336' };
  if (stock < 20) return { text: 'Low Stock', color: '#FF9800' };
  return { text: 'In Stock', color: '#4CAF50' };
};

//Khai báo hàm getPromotionStatus để xác định trạng thái của khuyến mãi dựa trên ngày bắt đầu, ngày kết thúc và trạng thái hoạt động
//Liên quan đến frontend/src/view/pages/admin.jsx
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
    shipping: { text: 'Shipping', color: '#2196F3' },
    completed: { text: 'Completed', color: '#4CAF50' },
    cancelled: { text: 'Cancelled', color: '#F44336' }
  };
  return statusMap[status] || { text: status, color: '#666' };
};
