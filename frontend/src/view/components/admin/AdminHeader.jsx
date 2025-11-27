// AdminHeader.jsx dùng để hiển thị tiêu đề và các hành động dựa trên phần quản trị đang hoạt động
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function AdminHeader({  //khai báo props để nhận dữ liệu từ component cha là admin.jsx
  activeSection, 
  showAddForm, 
  showAddPromotion, 
  handleAddProduct, 
  handleAddPromotion 
}) {
  const getTitleAndSubtitle = () => {
    const sections = {  //Định nghĩa tiêu đề và phụ đề cho từng phần quản trị và lưu vào object sections
      dashboard: { title: 'Dashboard', subtitle: 'Analytics and overview' },
      products: { title: 'Product Management', subtitle: 'Manage your inventory and products' },
      orders: { title: 'Order Management', subtitle: 'View and manage customer orders' },
      users: { title: 'User Management', subtitle: 'Manage user accounts and permissions' },
      analytics: { title: 'Analytics', subtitle: 'Detailed analytics and reports' },
      marketing: { title: 'Marketing & Promotions', subtitle: 'Manage campaigns, discounts, and promotions' },
      settings: { title: 'Settings', subtitle: 'Configure your admin preferences' }
    };
    return sections[activeSection] || { title: '', subtitle: '' };
  };

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <div className="admin-header">
      <div>
        <h1 className="admin-title">{title}</h1>
        <p className="admin-subtitle">{subtitle}</p>
      </div>
      {activeSection === 'products' && !showAddForm && (
        <button className="add-product-btn" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} />
          Add Product
        </button>
      )}
      {activeSection === 'marketing' && !showAddPromotion && (
        <button className="admin-action-btn" onClick={handleAddPromotion}>
          <FontAwesomeIcon icon={faPlus} /> Create Campaign
        </button>
      )}
    </div>
  );
}

export default AdminHeader;
