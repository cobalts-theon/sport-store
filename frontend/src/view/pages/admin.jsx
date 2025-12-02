import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faTimes,
  faImage,
  faDollarSign,
  faTag,
  faBoxes,
  faChevronDown,
  faChevronUp,
  faSave,
  faTachometerAlt,
  faShoppingCart,
  faUsers,
  faChartLine,
  faBullhorn,
  faPercent,
  faCalendarAlt,
  faEnvelope,
  faCheck,
  faClock,
  faTruck,
  faEye,
  faThLarge,
  faList,
  faSpinner,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { 
  AdminSidebar, 
  AdminHeader, 
  SettingsSection, 
  PlaceholderSection,
  UserManagement,
  Dashboard,
  Analytics,
  mockPromotions, 
  mockOrders,
  mockUsers,
  getStockStatus, 
  getPromotionStatus, 
  getOrderStatus 
} from '../components/admin';
import './pages-style/admin.css';

function Admin() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('products');
  
  //Chế độ xem danh sách hoặc lưới
  const [productViewMode, setProductViewMode] = useState('list');
  const [orderViewMode, setOrderViewMode] = useState('list');
  const [userViewMode, setUserViewMode] = useState('list');
  const [promotionViewMode, setPromotionViewMode] = useState('list');

  // Marketing/Promotions state
  const [promotions, setPromotions] = useState([]);
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionFormData, setPromotionFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minPurchase: '',
    usageLimit: '',
    active: true
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    description: '',
    image: null,
    imagePreview: '',
    images: [],           // Nhiều ảnh mới upload
    imagePreviews: [],    // Preview cho nhiều ảnh
    existingImages: [],   // Ảnh cũ khi edit
    tag: '',
    brand: '',
    material: '',
    isHotDeal: false
  });

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // Map API response
        const mappedProducts = res.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.original_price,
          image: p.img_url ? (p.img_url.startsWith('http') ? p.img_url : `http://localhost:3000${p.img_url}`) : '',
          images: p.images || [],
          hover: p.hover,
          tag: p.tag,
          category: p.category,
          material: p.material,
          brand: p.brand,
          isHotDeal: p.isHotDeal,
          stock: p.stock,
          createdAt: p.createdAt
        }));
        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load promotions data
  useEffect(() => {
    setPromotions(mockPromotions);
  }, []);

  // Load orders data từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        // Map API response to frontend format
        const mappedOrders = (res.data || []).map(order => ({
          id: order.id,
          date: order.createdAt,
          status: order.status || 'pending',
          total: Number(order.totalAmount) || 0,
          customer: {
            name: order.fullName,
            email: order.email,
            phone: order.phone
          },
          items: (order.OrderItems || []).map(item => ({
            id: item.id,
            name: item.Product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: Number(item.price) || 0,
            image: item.Product?.img_url 
              ? (item.Product.img_url.startsWith('http') 
                  ? item.Product.img_url 
                  : `http://localhost:3000${item.Product.img_url}`)
              : ''
          })),
          shipping: {
            address: order.address || 'N/A',
            method: 'Standard Delivery'
          }
        }));
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        setOrders(mockOrders);
      }
    };
    fetchOrders();
  }, []);

  // Fetch users từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        // Map API response to match frontend format
        const mappedUsers = res.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status || 'active',
          phone: u.phone,
          address: u.address,
          avatar: u.avatar,
          totalOrders: u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
          joinedDate: u.created_at || u.createdAt,
          lastActive: u.updated_at || u.updatedAt
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to mock data if API fails
        setUsers(mockUsers);
      }
    };
    fetchUsers();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '',
      description: '',
      image: null,
      imagePreview: '',
      images: [],
      imagePreviews: [],
      existingImages: [],
      tag: '',
      brand: '',
      material: '',
      isHotDeal: false
    });
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product) => {
    // Parse images từ product nếu có
    let existingImages = [];
    if (product.images) {
      existingImages = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    }
    
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      image: null,
      imagePreview: product.image || '',
      images: [],
      imagePreviews: [],
      existingImages: existingImages,
      tag: product.tag || '',
      brand: product.brand || '',
      material: product.material || '',
      isHotDeal: product.isHotDeal || false
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  // Handler cho nhiều ảnh phụ
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map(file => URL.createObjectURL(file));
      setFormData({
        ...formData,
        images: [...formData.images, ...files],
        imagePreviews: [...formData.imagePreviews, ...previews]
      });
    }
  };

  // Xóa ảnh phụ mới (chưa upload)
  const handleRemoveNewImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...formData.imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews
    });
  };

  // Xóa ảnh cũ (đã lưu trong DB)
  const handleRemoveExistingImage = (index) => {
    const newExisting = [...formData.existingImages];
    newExisting.splice(index, 1);
    setFormData({
      ...formData,
      existingImages: newExisting
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('stock', formData.stock);
    submitData.append('description', formData.description);
    submitData.append('tag', formData.tag);
    submitData.append('brand', formData.brand);
    submitData.append('material', formData.material);
    submitData.append('isHotDeal', formData.isHotDeal);
    if (formData.originalPrice) {
      submitData.append('originalPrice', formData.originalPrice);
    }
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    // Thêm nhiều ảnh phụ
    formData.images.forEach(img => {
      submitData.append('images', img);
    });
    
    // Gửi danh sách ảnh cũ cần giữ lại
    if (formData.existingImages.length > 0) {
      submitData.append('existingImages', JSON.stringify(formData.existingImages));
    }

    try {
      if (editingProduct) {
        // Update existing product
        const res = await api.put(`/products/${editingProduct.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const updatedProduct = {
          ...res.data,
          image: res.data.img_url ? (res.data.img_url.startsWith('http') ? res.data.img_url : `http://localhost:3000${res.data.img_url}`) : editingProduct.image
        };
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        const res = await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const newProduct = {
          ...res.data,
          image: res.data.img_url ? (res.data.img_url.startsWith('http') ? res.data.img_url : `http://localhost:3000${res.data.img_url}`) : ''
        };
        setProducts([...products, newProduct]);
        toast.success('Product added successfully!');
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '',
      description: '',
      image: null,
      imagePreview: '',
      images: [],
      imagePreviews: [],
      existingImages: [],
      tag: '',
      brand: '',
      material: '',
      isHotDeal: false
    });
  };

  const toggleProductDetails = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Promotion handlers
  const handleAddPromotion = () => {
    setPromotionFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      minPurchase: '',
      usageLimit: '',
      active: true
    });
    setEditingPromotion(null);
    setShowAddPromotion(true);
  };

  const handleEditPromotion = (promotion) => {
    setPromotionFormData({
      code: promotion.code,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      minPurchase: promotion.minPurchase,
      usageLimit: promotion.usageLimit || '',
      active: promotion.active
    });
    setEditingPromotion(promotion);
    setShowAddPromotion(true);
  };

  const handleDeletePromotion = (promotionId) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(p => p.id !== promotionId));
    }
  };

  const handleTogglePromotionStatus = (promotionId) => {
    setPromotions(promotions.map(p => 
      p.id === promotionId ? { ...p, active: !p.active } : p
    ));
  };

  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    
    if (editingPromotion) {
      setPromotions(promotions.map(p => 
        p.id === editingPromotion.id 
          ? { ...p, ...promotionFormData }
          : p
      ));
    } else {
      const newPromotion = {
        id: Math.max(...promotions.map(p => p.id)) + 1,
        ...promotionFormData,
        usedCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPromotions([...promotions, newPromotion]);
    }
    
    setShowAddPromotion(false);
    setEditingPromotion(null);
  };

  const handleCancelPromotionForm = () => {
    setShowAddPromotion(false);
    setEditingPromotion(null);
  };

  // Order handlers

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await api.delete(`/orders/${orderId}`);
        setOrders(orders.filter(order => order.id !== orderId));
        toast.success('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  //Chức năng in đơn hàng sử dụng window.print()
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'completed': return '#22c55e';
        case 'shipping': return '#3b82f6';
        case 'pending': return '#f59e0b';
        case 'cancelled': return '#ef4444';
        default: return '#6b7280';
      }
    };
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order #${order.id} - Invoice</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            color: #1f2937;
            line-height: 1.6;
          }
          
          .invoice-container {
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #0f0f10 0%, #1a1a1c 50%, #0f0f10 100%);
            color: #fff;
            padding: 30px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header-left h1 {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 4px;
          }
          
          .header-left h1 span {
            color: #D0FE1D;
          }
          
          .header-left p {
            font-size: 12px;
            color: #9ca3af;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          
          .header-right {
            text-align: right;
          }
          
          .invoice-badge {
            background: #D0FE1D;           
            color: black;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
            margin-bottom: 8px;
            display: inline-block;
          }
          
          .invoice-number {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
          }
          
          .content {
            padding: 30px 40px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 24px;
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 2px dashed #e5e7eb;
          }
          
          .info-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          
          .info-section h3 {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .info-section p {
            font-size: 13px;
            margin-bottom: 6px;
            color: #374151;
          }
          
          .info-section p strong {
            color: #111827;
            font-weight: 600;
          }
          
          .info-section .highlight {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: capitalize;
            background: ${getStatusColor(order.status)}15;
            color: ${getStatusColor(order.status)};
            border: 1px solid ${getStatusColor(order.status)}40;
          }
          
          .status-badge::before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${getStatusColor(order.status)};
          }
          
          .items-section h3 {
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .items-section h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #D0FE1D;
            border-radius: 2px;
          }
          
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 20px;
          }
          
          thead tr {
            background: #111827;
          }
          
          th {
            padding: 14px 16px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          th:first-child {
            border-radius: 8px 0 0 8px;
          }
          
          th:last-child {
            border-radius: 0 8px 8px 0;
            text-align: right;
          }
          
          td {
            padding: 16px;
            font-size: 13px;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
          }
          
          td:last-child {
            text-align: right;
            font-weight: 600;
            color: #111827;
          }
          
          tbody tr:hover {
            background: #f9fafb;
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          .product-name {
            font-weight: 600;
            color: #111827;
          }
          
          .quantity-badge {
            background: #e5e7eb;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .totals-section {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            color: #6b7280;
          }
          
          .total-row.subtotal {
            border-bottom: 1px dashed #d1d5db;
            padding-bottom: 16px;
            margin-bottom: 8px;
          }
          
          .total-row.grand-total {
            font-size: 20px;
            font-weight: 800;
            color: #111827;
            padding-top: 16px;
            border-top: 2px solid #111827;
            margin-top: 8px;
          }
          
          .total-row.grand-total span:last-child {
            color: #059669;
          }
          
          .footer {
            background: #f9fafb;
            padding: 24px 40px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .footer-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .thank-you {
            background: linear-gradient(135deg, #D0FE1D 0%, #a3e635 100%);
            color: #0f0f10;
            padding: 10px 20px;
            border-radius: 8px;
            clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
            font-weight: 700;
            font-size: 13px;
          }
          
          .footer-info {
            font-size: 11px;
            color: #6b7280;
          }
          
          .footer-right {
            text-align: right;
            font-size: 11px;
            color: #9ca3af;
          }
          
          .footer-right p {
            margin-bottom: 2px;
          }
          
          .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 10px;
            color: #d1d5db;
            letter-spacing: 1px;
          }
          
          @media print {
            body { 
              padding: 0;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .invoice-container {
              border: none;
            }
            .watermark {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="header-left">
              <h1>PRIME <span>SOULS</span></h1>
              <p>Premium Footwear & Lifestyle</p>
            </div>
            <div class="header-right">
              <div class="invoice-badge">Invoice</div>
              <div class="invoice-number">#${String(order.id).padStart(6, '0')}</div>
            </div>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-section">
                <h3>Order Details</h3>
                <p class="highlight">#${String(order.id).padStart(6, '0')}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              <div class="info-section">
                <h3>Customer</h3>
                <p class="highlight">${order.customer?.name || 'Guest'}</p>
                <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
              </div>
              
              <div class="info-section">
                <h3>Shipping Address</h3>
                <p>${order.shipping?.address || 'N/A'}</p>
                <p><strong>Method:</strong> Standard Delivery</p>
              </div>
            </div>
            
            <div class="items-section">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${(order.items || []).map(item => `
                    <tr>
                      <td><span class="product-name">${item.name}</span></td>
                      <td><span class="quantity-badge">× ${item.quantity}</span></td>
                      <td>${formatCurrency(item.price)}</td>
                      <td>${formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="totals-section">
                <div class="total-row subtotal">
                  <span>Subtotal (${order.items?.length || 0} items)</span>
                  <span>${formatCurrency(order.total)}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="total-row">
                  <span>Tax (included)</span>
                  <span>-</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total Amount</span>
                  <span>${formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-left">
              <div class="thank-you">✓ Thank You!</div>
              <div class="footer-info">
                <p>For any questions, contact us at support@primesouls.vn</p>
              </div>
            </div>
            <div class="footer-right">
              <p>Printed on: ${new Date().toLocaleString('vi-VN')}</p>
              <p>Prime Souls © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
        
        <div class="watermark">PRIME SOULS - AUTHENTIC INVOICE</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus;
    const matchesSearch = orderSearchQuery === '' || 
      order.id.toString().includes(orderSearchQuery) ||
      (order.customer?.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.customer?.phone || '').includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Left Sidebar Navigation */}
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <div className="admin-main-content">
        {/* Header */}
        <AdminHeader 
          activeSection={activeSection}
          showAddForm={showAddForm}
          showAddPromotion={showAddPromotion}
          handleAddProduct={handleAddProduct}
          handleAddPromotion={handleAddPromotion}
        />

        {/* Product Management Section */}
        {activeSection === 'products' && !showAddForm && (
          <>
            {/* Search and Filters */}
        <div className="admin-controls">
          <div className="search-box-admin">
            <FontAwesomeIcon icon={faSearch} className="search-icon-admin" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <FontAwesomeIcon 
                icon={faTimes} 
                className="clear-icon-admin"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button 
              className={`view-mode-btn ${productViewMode === 'list' ? 'active' : ''}`}
              onClick={() => setProductViewMode('list')}
              title="List View"
            >
              <FontAwesomeIcon icon={faList} />
              <span>List</span>
            </button>
            <button 
              className={`view-mode-btn ${productViewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setProductViewMode('grid')}
              title="Grid View"
            >
              <FontAwesomeIcon icon={faThLarge} />
              <span>Grid</span>
            </button>
          </div>

          <div className="admin-filters">
            <button 
              className={`filter-btn-admin ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Products
            </button>
            <button 
              className={`filter-btn-admin ${selectedCategory === 'sneakers' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('sneakers')}
            >
              Sneakers
            </button>
            <button 
              className={`filter-btn-admin ${selectedCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('accessories')}
            >
              Accessories
            </button>
          </div>
        </div>

        {/* Products Stats */}
        <div className="admin-products-stats">
          <div className="admin-stat-card">
            <FontAwesomeIcon icon={faBox} />
            <div>
              <p className="admin-stat-value">{products.length}</p>
              <p className="admin-stat-label">Total Products</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <FontAwesomeIcon icon={faBoxes} />
            <div>
              <p className="admin-stat-value">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
              <p className="admin-stat-label">Total Stock</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <FontAwesomeIcon icon={faDollarSign} />
            <div>
              <p className="admin-stat-value">${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}</p>
              <p className="admin-stat-label">Inventory Value</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className={`admin-products-list ${productViewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {filteredProducts.length === 0 ? (
            <div className="admin-no-products">
              <FontAwesomeIcon icon={faBox} className="admin-no-products-icon" />
              <h2>No products found</h2>
              <p>Try adjusting your filters or add a new product</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product.id} className={`admin-product-card ${productViewMode}`}>
                  {/* Product Header */}
                  <div className="admin-product-card-header">
                    <div className="admin-product-main-info">
                      <img src={product.image} alt={product.name} className="admin-product-thumbnail" />
                      <div className="admin-product-info">
                        <h3 className="admin-product-name">{product.name}</h3>
                        <p className="admin-product-category">
                          <FontAwesomeIcon icon={faTag} /> {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="admin-product-meta">
                      <div className="admin-product-price">${product.price.toFixed(2)}</div>
                      <div 
                        className="admin-product-stock"
                        style={{ backgroundColor: stockStatus.color + '20', color: stockStatus.color }}
                      >
                        {product.stock} units • {stockStatus.text}
                      </div>
                    </div>
                  </div>

                  {/* Product Footer */}
                  <div className="admin-product-card-footer">
                    <div className="admin-product-actions">
                      <button 
                        className="admin-action-btn secondary"
                        onClick={() => toggleProductDetails(product.id)}
                      >
                        {expandedProduct === product.id ? 'Hide Details' : 'View Details'}
                        <FontAwesomeIcon icon={expandedProduct === product.id ? faChevronUp : faChevronDown} />
                      </button>
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => handleEditProduct(product)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                      </button>
                      <button 
                        className="admin-action-btn danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedProduct === product.id && (
                    <div className="admin-product-details-expanded">
                      <div className="admin-details-section">
                        <h4>Description</h4>
                        <p>{product.description}</p>
                      </div>
                      <div className="admin-details-section">
                        <h4>Created Date</h4>
                        <p>{new Date(product.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                      <div className="admin-details-section">
                        <h4>Featured</h4>
                        <p>{product.featured ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        </>
        )}

        {/* Add/Edit Product Form */}
        {activeSection === 'products' && showAddForm && (
          <div className="admin-form-container">
            <div className="admin-form-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="admin-close-btn" onClick={handleCancelForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-product-form-main">
              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faBox} /> Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faDollarSign} /> Price</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faDollarSign} /> Original Price (optional)</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="For sale items"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faTag} /> Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Running">Running</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Training">Training</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faTag} /> Tag</label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  >
                    <option value="">No tag</option>
                    <option value="new">New Arrival</option>
                    <option value="sale">Sale</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faBoxes} /> Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faTag} /> Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Nike, Adidas, etc."
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faTag} /> Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  placeholder="Leather, Mesh, etc."
                />
              </div>

              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faImage} /> Main Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-file-input"
                />
                {formData.imagePreview && (
                  <div className="admin-image-preview">
                    <img src={formData.imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faImage} /> Additional Images (Max 10)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImagesChange}
                  className="admin-file-input"
                />
                
                {/* Hiển thị ảnh cũ (khi edit) */}
                {formData.existingImages.length > 0 && (
                  <div className="admin-multiple-images-preview">
                    <p style={{fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem'}}>Existing Images:</p>
                    <div className="admin-images-grid">
                      {formData.existingImages.map((img, index) => (
                        <div key={`existing-${index}`} className="admin-image-item">
                          <img 
                            src={img.startsWith('http') ? img : `http://localhost:3000${img}`} 
                            alt={`Existing ${index + 1}`} 
                          />
                          <button 
                            type="button" 
                            className="admin-remove-image-btn"
                            onClick={() => handleRemoveExistingImage(index)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hiển thị ảnh mới upload */}
                {formData.imagePreviews.length > 0 && (
                  <div className="admin-multiple-images-preview">
                    <p style={{fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem'}}>New Images:</p>
                    <div className="admin-images-grid">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="admin-image-item">
                          <img src={preview} alt={`New ${index + 1}`} />
                          <button 
                            type="button" 
                            className="admin-remove-image-btn"
                            onClick={() => handleRemoveNewImage(index)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isHotDeal}
                    onChange={(e) => setFormData({...formData, isHotDeal: e.target.checked})}
                  />
                  <span>Hot Deal (Featured on homepage)</span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={handleCancelForm}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="admin-btn-save">
                  <FontAwesomeIcon icon={faSave} /> {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <Dashboard 
            products={products}
            orders={orders}
            users={users}
            promotions={promotions}
          />
        )}

        {/* Order Management Section */}
        {activeSection === 'orders' && (
          <>
            {/* Order Stats */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <FontAwesomeIcon icon={faShoppingCart} className="admin-stat-icon" />
                <div className="admin-stat-content">
                  <h3>Total Orders</h3>
                  <p className="admin-stat-value">{orders.length}</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <FontAwesomeIcon icon={faClock} className="admin-stat-icon" style={{color: '#FF9800'}} />
                <div className="admin-stat-content">
                  <h3>Pending</h3>
                  <p className="admin-stat-value">{orders.filter(o => o.status === 'pending').length}</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <FontAwesomeIcon icon={faTruck} className="admin-stat-icon" style={{color: '#2196F3'}} />
                <div className="admin-stat-content">
                  <h3>Shipping</h3>
                  <p className="admin-stat-value">{orders.filter(o => o.status === 'shipping').length}</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <FontAwesomeIcon icon={faCheck} className="admin-stat-icon" style={{color: '#4CAF50'}} />
                <div className="admin-stat-content">
                  <h3>Completed</h3>
                  <p className="admin-stat-value">{orders.filter(o => o.status === 'completed').length}</p>
                </div>
              </div>
            </div>

            {/* Order Search and Filters */}
            <div className="admin-controls">
              {/* Search Box */}
              <div className="search-box-admin">
                <FontAwesomeIcon icon={faSearch} className="search-icon-admin" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, Email, Phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                />
                {orderSearchQuery && (
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="clear-icon-admin"
                    onClick={() => setOrderSearchQuery('')}
                  />
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button 
                  className={`view-mode-btn ${orderViewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setOrderViewMode('list')}
                  title="List View"
                >
                  <FontAwesomeIcon icon={faList} />
                  <span>List</span>
                </button>
                <button 
                  className={`view-mode-btn ${orderViewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setOrderViewMode('grid')}
                  title="Grid View"
                >
                  <FontAwesomeIcon icon={faThLarge} />
                  <span>Grid</span>
                </button>
              </div>

              <div className="admin-filters">
              <button 
                className={`filter-btn-admin ${selectedOrderStatus === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedOrderStatus('all')}
              >
                All Orders
              </button>
              <button 
                className={`filter-btn-admin ${selectedOrderStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setSelectedOrderStatus('pending')}
              >
                <FontAwesomeIcon icon={faClock} /> Pending
              </button>
              <button 
                className={`filter-btn-admin ${selectedOrderStatus === 'shipping' ? 'active' : ''}`}
                onClick={() => setSelectedOrderStatus('shipping')}
              >
                <FontAwesomeIcon icon={faTruck} /> Shipping
              </button>
              <button 
                className={`filter-btn-admin ${selectedOrderStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setSelectedOrderStatus('completed')}
              >
                <FontAwesomeIcon icon={faCheck} /> Completed
              </button>
              <button 
                className={`filter-btn-admin ${selectedOrderStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setSelectedOrderStatus('cancelled')}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancelled
              </button>
              </div>
            </div>

            {/* Orders List */}
            <div className={`admin-products-list ${orderViewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {filteredOrders.length === 0 ? (
                <div className="admin-no-products">
                  <FontAwesomeIcon icon={faShoppingCart} className="admin-no-products-icon" />
                  <h2>No orders found</h2>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const status = getOrderStatus(order.status);
                  const orderDate = new Date(order.date);
                  
                  // Format tiền VND
                  const formatCurrency = (amount) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
                  };
                  
                  return (
                    <div key={order.id} className={`admin-product-card ${orderViewMode}`}>
                      {/* Order Card Header */}
                      <div className="admin-product-card-header">
                        <div className="admin-product-main-info">
                          <div className="admin-order-icon">
                            <FontAwesomeIcon icon={faShoppingCart} />
                          </div>
                          <div className="admin-product-info">
                            <h3 className="admin-product-name">Order #{order.id}</h3>
                            <p className="admin-product-category">
                              <FontAwesomeIcon icon={faUsers} /> {order.customer?.name || 'Guest'}
                            </p>
                            <p className="admin-order-email">
                              <FontAwesomeIcon icon={faEnvelope} /> {order.customer?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="admin-product-meta">
                          <div className="admin-product-price">{formatCurrency(order.total)}</div>
                          <div 
                            className="admin-product-stock"
                            style={{ backgroundColor: status.color + '20', color: status.color }}
                          >
                            {status.text}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="admin-order-details">
                        <div className="admin-order-detail-item">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>{orderDate.toLocaleDateString('vi-VN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        <div className="admin-order-detail-item">
                          <FontAwesomeIcon icon={faBox} />
                          <span>{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {expandedOrder === order.id && (
                        <div className="admin-order-expanded">
                          <div className="admin-order-section">
                            <h4><FontAwesomeIcon icon={faBox} /> Order Items</h4>
                            <div className="admin-order-items-list">
                              {(order.items || []).map((item, index) => (
                                <div key={index} className="admin-order-item">
                                  <div className="admin-order-item-info">
                                    <span className="admin-order-item-name">{item.name}</span>
                                    <span className="admin-order-item-qty">Qty: {item.quantity}</span>
                                  </div>
                                  <span className="admin-order-item-price">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="admin-order-total">
                                <span>Total:</span>
                                <span>{formatCurrency(order.total)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="admin-order-section">
                            <h4><FontAwesomeIcon icon={faUsers} /> Customer Info</h4>
                            <p className="admin-order-address">
                              <strong>Name:</strong> {order.customer?.name || 'Guest'}<br/>
                              <strong>Email:</strong> {order.customer?.email || 'N/A'}<br/>
                              <strong>Phone:</strong> {order.customer?.phone || 'N/A'}
                            </p>
                          </div>
                          <div className="admin-order-section">
                            <h4><FontAwesomeIcon icon={faTruck} /> Shipping Address</h4>
                            <p className="admin-order-address">{order.shipping?.address || 'N/A'}</p>
                          </div>
                          <div className="admin-order-section">
                            <h4><FontAwesomeIcon icon={faEdit} /> Update Status</h4>
                            <div className="admin-order-status-buttons">
                              <button 
                                className={`admin-status-btn ${order.status === 'pending' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                disabled={order.status === 'pending'}
                              >
                                <FontAwesomeIcon icon={faClock} /> Pending
                              </button>
                              <button 
                                className={`admin-status-btn ${order.status === 'shipping' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                                disabled={order.status === 'shipping'}
                              >
                                <FontAwesomeIcon icon={faTruck} /> Shipping
                              </button>
                              <button 
                                className={`admin-status-btn ${order.status === 'completed' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                disabled={order.status === 'completed'}
                              >
                                <FontAwesomeIcon icon={faCheck} /> Completed
                              </button>
                              <button 
                                className={`admin-status-btn danger ${order.status === 'cancelled' ? 'active' : ''}`}
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this order?')) {
                                    handleUpdateOrderStatus(order.id, 'cancelled');
                                  }
                                }}
                                disabled={order.status === 'cancelled'}
                              >
                                <FontAwesomeIcon icon={faTimes} /> Cancelled
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Card Footer */}
                      <div className="admin-product-card-footer">
                        <div className="admin-product-actions">
                          <button 
                            className="admin-action-btn secondary"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                            <FontAwesomeIcon icon={expandedOrder === order.id ? faChevronUp : faChevronDown} />
                          </button>
                          
                          {/* Quick Status Change Buttons */}
                          <div className="admin-quick-status-actions">
                            <button 
                              className={`admin-action-btn status-btn pending ${order.status === 'pending' ? 'active' : ''}`}
                              onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                              disabled={order.status === 'pending'}
                              title="Set Pending"
                            >
                              <FontAwesomeIcon icon={faClock} />
                            </button>
                            <button 
                              className={`admin-action-btn status-btn shipping ${order.status === 'shipping' ? 'active' : ''}`}
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                              disabled={order.status === 'shipping'}
                              title="Set Shipping"
                            >
                              <FontAwesomeIcon icon={faTruck} />
                            </button>
                            <button 
                              className={`admin-action-btn status-btn completed ${order.status === 'completed' ? 'active' : ''}`}
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              disabled={order.status === 'completed'}
                              title="Set Completed"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          </div>

                          <button 
                            className="admin-action-btn info"
                            onClick={() => handlePrintOrder(order)}
                            title="Print Invoice"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                            Print
                          </button>
                          <button 
                            className="admin-action-btn danger"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeSection === 'users' && (
          <UserManagement 
            users={users} 
            setUsers={setUsers} 
            viewMode={userViewMode}
            setViewMode={setUserViewMode}
          />
        )}

        {activeSection === 'analytics' && (
          <Analytics 
            products={products}
            orders={orders}
            users={users}
          />
        )}

        {/* Marketing/Promotions Section */}
        {activeSection === 'marketing' && !showAddPromotion && (
          <>
          {/* View Mode Toggle */}
          <div className="admin-controls" style={{marginBottom: '1.5rem'}}>
            <div className="view-mode-toggle">
              <button 
                className={`view-mode-btn ${promotionViewMode === 'list' ? 'active' : ''}`}
                onClick={() => setPromotionViewMode('list')}
                title="List View"
              >
                <FontAwesomeIcon icon={faList} />
                <span>List</span>
              </button>
              <button 
                className={`view-mode-btn ${promotionViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setPromotionViewMode('grid')}
                title="Grid View"
              >
                <FontAwesomeIcon icon={faThLarge} />
                <span>Grid</span>
              </button>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faBullhorn} className="admin-stat-icon" />
              <div className="admin-stat-content">
                <h3>Total Campaigns</h3>
                <p className="admin-stat-value">{promotions.length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faChartLine} className="admin-stat-icon" style={{color: '#4CAF50'}} />
              <div className="admin-stat-content">
                <h3>Active Campaigns</h3>
                <p className="admin-stat-value">{promotions.filter(p => p.active && new Date(p.endDate) > new Date() && new Date(p.startDate) <= new Date()).length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faCalendarAlt} className="admin-stat-icon" style={{color: '#2196F3'}} />
              <div className="admin-stat-content">
                <h3>Scheduled</h3>
                <p className="admin-stat-value">{promotions.filter(p => new Date(p.startDate) > new Date()).length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faPercent} className="admin-stat-icon" style={{color: '#FF9800'}} />
              <div className="admin-stat-content">
                <h3>Total Usage</h3>
                <p className="admin-stat-value">{promotions.reduce((sum, p) => sum + p.usedCount, 0)}</p>
              </div>
            </div>
          </div>

          <div className={`admin-products-list ${promotionViewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {promotions.map(promotion => {
              const status = getPromotionStatus(promotion);
              const usagePercent = promotion.usageLimit ? (promotion.usedCount / promotion.usageLimit * 100).toFixed(1) : 0;
              
              return (
                <div key={promotion.id} className={`admin-product-card ${promotionViewMode}`}>
                  {/* Promotion Card Header */}
                  <div className="admin-product-card-header">
                    <div className="admin-product-main-info">
                      <div className="admin-promotion-icon">
                        <FontAwesomeIcon icon={faBullhorn} />
                      </div>
                      <div className="admin-product-info">
                        <h3 className="admin-product-name">{promotion.code}</h3>
                        <p className="admin-product-category">
                          <FontAwesomeIcon icon={faTag} /> {promotion.description}
                        </p>
                      </div>
                    </div>
                    <div className="admin-product-meta">
                      <div className="admin-product-price">
                        {promotion.discountType === 'percentage' 
                          ? `${promotion.discountValue}% OFF` 
                          : `$${promotion.discountValue} OFF`}
                      </div>
                      <div 
                        className="admin-product-stock"
                        style={{ backgroundColor: status.color + '20', color: status.color }}
                      >
                        {status.text}
                      </div>
                    </div>
                  </div>

                  {/* Promotion Details */}
                  <div className="admin-promotion-details">
                    <div className="admin-promo-detail-item">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>{new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-promo-detail-item">
                      <FontAwesomeIcon icon={faDollarSign} />
                      <span>Min Purchase: ${promotion.minPurchase}</span>
                    </div>
                    {promotion.usageLimit && (
                      <div className="admin-promo-detail-item">
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Usage: {promotion.usedCount}/{promotion.usageLimit} ({usagePercent}%)</span>
                      </div>
                    )}
                    {!promotion.usageLimit && (
                      <div className="admin-promo-detail-item">
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Usage: {promotion.usedCount} (Unlimited)</span>
                      </div>
                    )}
                  </div>

                  {promotion.usageLimit && (
                    <div className="admin-promotion-progress">
                      <div className="admin-progress-bar">
                        <div 
                          className="admin-progress-fill" 
                          style={{width: `${Math.min(usagePercent, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Promotion Card Footer */}
                  <div className="admin-product-card-footer">
                    <div className="admin-product-actions">
                      <button 
                        className="admin-action-btn secondary" 
                        onClick={() => handleTogglePromotionStatus(promotion.id)}
                        title={promotion.active ? "Deactivate" : "Activate"}
                      >
                        <FontAwesomeIcon icon={promotion.active ? faChevronDown : faChevronUp} />
                        {promotion.active ? "Disable" : "Enable"}
                      </button>
                      <button 
                        className="admin-action-btn primary" 
                        onClick={() => handleEditPromotion(promotion)}
                        title="Edit promotion"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                      </button>
                      <button 
                        className="admin-action-btn danger" 
                        onClick={() => handleDeletePromotion(promotion.id)}
                        title="Delete promotion"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}

        {/* Add/Edit Promotion Form */}
        {activeSection === 'marketing' && showAddPromotion && (
          <div className="admin-form-container">
            <div className="admin-form-header">
              <h2>{editingPromotion ? 'Edit Campaign' : 'Create New Campaign'}</h2>
              <button className="admin-close-btn" onClick={handleCancelPromotionForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handlePromotionSubmit} className="admin-product-form-main">
              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faTag} /> Promotion Code</label>
                <input
                  type="text"
                  value={promotionFormData.code}
                  onChange={(e) => setPromotionFormData({...promotionFormData, code: e.target.value.toUpperCase()})}
                  placeholder="Enter code (e.g., SUMMER2025)"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faBullhorn} /> Description</label>
                <textarea
                  value={promotionFormData.description}
                  onChange={(e) => setPromotionFormData({...promotionFormData, description: e.target.value})}
                  placeholder="Describe this promotion"
                  rows="3"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faPercent} /> Discount Type</label>
                  <select
                    value={promotionFormData.discountType}
                    onChange={(e) => setPromotionFormData({...promotionFormData, discountType: e.target.value})}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faDollarSign} /> Discount Value</label>
                  <input
                    type="number"
                    value={promotionFormData.discountValue}
                    onChange={(e) => setPromotionFormData({...promotionFormData, discountValue: e.target.value})}
                    placeholder={promotionFormData.discountType === 'percentage' ? '10' : '20'}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Start Date</label>
                  <input
                    type="date"
                    value={promotionFormData.startDate}
                    onChange={(e) => setPromotionFormData({...promotionFormData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> End Date</label>
                  <input
                    type="date"
                    value={promotionFormData.endDate}
                    onChange={(e) => setPromotionFormData({...promotionFormData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faDollarSign} /> Minimum Purchase ($)</label>
                  <input
                    type="number"
                    value={promotionFormData.minPurchase}
                    onChange={(e) => setPromotionFormData({...promotionFormData, minPurchase: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label><FontAwesomeIcon icon={faChartLine} /> Usage Limit</label>
                  <input
                    type="number"
                    value={promotionFormData.usageLimit}
                    onChange={(e) => setPromotionFormData({...promotionFormData, usageLimit: e.target.value})}
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={promotionFormData.active}
                    onChange={(e) => setPromotionFormData({...promotionFormData, active: e.target.checked})}
                  />
                  <span>Active (Promotion will be immediately available)</span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={handleCancelPromotionForm}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button type="submit" className="admin-btn-save">
                  <FontAwesomeIcon icon={faSave} /> {editingPromotion ? 'Update' : 'Create'} Campaign
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
}

export default Admin;
