// Mock products data
export const mockProducts = [
  {
    id: 1,
    name: 'Air Max 97 Silver Bullet',
    price: 299.99,
    category: 'sneakers',
    stock: 45,
    description: 'Classic running shoe with visible Air Max unit',
    image: '/src/assets/image/1.png',
    featured: true,
    createdAt: '2025-10-15'
  },
  {
    id: 2,
    name: 'Jordan 1 Retro High',
    price: 249.99,
    category: 'sneakers',
    stock: 30,
    description: 'Iconic basketball shoe with premium leather',
    image: '/src/assets/image/2.png',
    featured: true,
    createdAt: '2025-10-20'
  },
  {
    id: 3,
    name: 'Nike Dunk Low',
    price: 199.99,
    category: 'sneakers',
    stock: 60,
    description: 'Versatile streetwear classic',
    image: '/src/assets/image/3.jpg',
    featured: false,
    createdAt: '2025-11-01'
  },
  {
    id: 4,
    name: 'Yeezy Boost 350',
    price: 349.99,
    category: 'sneakers',
    stock: 15,
    description: 'Premium comfort and style',
    image: '/src/assets/image/4.jpg',
    featured: true,
    createdAt: '2025-11-10'
  }
];

// Mock promotions data
export const mockPromotions = [
  {
    id: 1,
    code: 'SUMMER2025',
    description: 'Summer Sale - 20% off all products',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    minPurchase: 100,
    usageLimit: 1000,
    usedCount: 234,
    active: true,
    createdAt: '2025-05-15'
  },
  {
    id: 2,
    code: 'NEWUSER10',
    description: 'New User Discount',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    minPurchase: 50,
    usageLimit: 500,
    usedCount: 89,
    active: true,
    createdAt: '2025-01-01'
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: 'Free Shipping on orders over $200',
    discountType: 'fixed',
    discountValue: 15,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    minPurchase: 200,
    usageLimit: null,
    usedCount: 567,
    active: true,
    createdAt: '2024-12-20'
  },
  {
    id: 4,
    code: 'EXPIRED50',
    description: 'Expired Campaign',
    discountType: 'percentage',
    discountValue: 50,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    minPurchase: 100,
    usageLimit: 100,
    usedCount: 98,
    active: false,
    createdAt: '2024-10-25'
  }
];

// Mock orders data
export const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { name: 'Air Max 97 Silver Bullet', quantity: 1, price: 299.99 },
      { name: 'Nike Dunk Low', quantity: 2, price: 199.99 }
    ],
    total: 699.97,
    status: 'pending',
    orderDate: '2025-11-25T10:30:00',
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { name: 'Jordan 1 Retro High', quantity: 1, price: 249.99 }
    ],
    total: 249.99,
    status: 'processing',
    orderDate: '2025-11-24T14:20:00',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    items: [
      { name: 'Yeezy Boost 350', quantity: 1, price: 349.99 },
      { name: 'Air Max 97 Silver Bullet', quantity: 1, price: 299.99 }
    ],
    total: 649.98,
    status: 'shipped',
    orderDate: '2025-11-23T09:15:00',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    items: [
      { name: 'Nike Dunk Low', quantity: 3, price: 199.99 }
    ],
    total: 599.97,
    status: 'delivered',
    orderDate: '2025-11-20T16:45:00',
    shippingAddress: '321 Elm St, Houston, TX 77001'
  },
  {
    id: 'ORD-005',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    items: [
      { name: 'Jordan 1 Retro High', quantity: 2, price: 249.99 }
    ],
    total: 499.98,
    status: 'cancelled',
    orderDate: '2025-11-22T11:30:00',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001'
  }
];
