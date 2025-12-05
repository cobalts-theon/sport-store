// Template HTML hóa đơn - Reused từ admin print style

const getStatusColor = (status) => {
    switch(status) {
        case 'completed': return '#22c55e';
        case 'shipping': return '#3b82f6';
        case 'pending': return '#f59e0b';
        case 'cancelled': return '#ef4444';
        default: return '#6b7280';
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const generateInvoiceHTML = (order, orderItems) => {
    const statusColor = getStatusColor(order.status);
    
    // Tính subtotal từ items
    const calculatedSubtotal = orderItems.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
    }, 0);

    return `
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
          
          .success-banner {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            text-align: center;
          }
          
          .success-banner h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          
          .success-banner p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .tracking-section {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 16px 20px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
          }
          
          .tracking-section p {
            font-size: 12px;
            color: #3b82f6;
            margin-bottom: 4px;
          }
          
          .tracking-section .tracking-number {
            font-size: 18px;
            font-weight: 700;
            color: #1d4ed8;
            letter-spacing: 2px;
          }
          
          .discount-row {
            color: #22c55e;
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
            <div class="success-banner">
              <h2>Order Completed!</h2>
              <p>Thank you for shopping at Prime Souls</p>
            </div>
            
            <div class="info-grid">
              <div class="info-section">
                <h3>Order Details</h3>
                <p class="highlight">#${String(order.id).padStart(6, '0')}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 600;">✓ Completed</span></p>
              </div>
              
              <div class="info-section">
                <h3>Customer</h3>
                <p class="highlight">${order.fullName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
              </div>
              
              <div class="info-section">
                <h3>Shipping Address</h3>
                <p>${order.address}</p>
                ${order.trackingNumber ? `
                <p style="margin-top: 8px;"><strong>Tracking:</strong></p>
                <p style="color: #3b82f6; font-weight: 600;">${order.trackingNumber}</p>
                ` : '<p><strong>Method:</strong> Standard Delivery</p>'}
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
                  ${orderItems.map(item => `
                    <tr>
                      <td><span class="product-name">${item.Product?.name || 'Product'}</span></td>
                      <td><span class="quantity-badge">× ${item.quantity}</span></td>
                      <td>${formatCurrency(item.price)}</td>
                      <td>${formatCurrency(Number(item.price) * item.quantity)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="totals-section">
                <div class="total-row subtotal">
                  <span>Subtotal (${orderItems.length} items)</span>
                  <span>${formatCurrency(order.subtotal || calculatedSubtotal)}</span>
                </div>
                <div class="total-row">
                  <span>Shipping Fee</span>
                  <span>${Number(order.shippingFee) > 0 ? formatCurrency(order.shippingFee) : 'Free'}</span>
                </div>
                ${Number(order.discount) > 0 ? `
                <div class="total-row discount-row">
                  <span>Discount ${order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-${formatCurrency(order.discount)}</span>
                </div>
                ` : ''}
                <div class="total-row grand-total">
                  <span>Total Amount</span>
                  <span>${formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
              
              ${order.trackingNumber ? `
              <div class="tracking-section">
                <p>Your Tracking Number</p>
                <div class="tracking-number">${order.trackingNumber}</div>
              </div>
              ` : ''}
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
              <p>Generated on: ${new Date().toLocaleString('vi-VN')}</p>
              <p>Prime Souls © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
        
        <div class="watermark">PRIME SOULS - AUTHENTIC INVOICE</div>
      </body>
      </html>
    `;
};

export default generateInvoiceHTML;
