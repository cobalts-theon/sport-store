// AdminSidebar.jsx dùng để hiển thị thanh điều hướng bên cho trang quản trị
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox,
  faShoppingCart,
  faUsers,
  faTachometerAlt,
  faChartLine,
  faBullhorn,
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

// Default avatar
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23374151' width='40' height='40' rx='20'/%3E%3Ccircle cx='20' cy='15' r='8' fill='%239CA3AF'/%3E%3Cellipse cx='20' cy='38' rx='14' ry='12' fill='%239CA3AF'/%3E%3C/svg%3E";

function AdminSidebar({ activeSection, setActiveSection }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const getAvatarUrl = () => {
    if (!user?.avatar) return DEFAULT_AVATAR;
    return user.avatar.startsWith('http') 
      ? user.avatar 
      : `http://localhost:3000/${user.avatar}`;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  const menuItems = [ // Định nghĩa các mục menu với id, icon và nhãn tương ứng voi giá trị activeSection
    { id: 'products', icon: faBox, label: 'Product Management' }, 
    { id: 'orders', icon: faShoppingCart, label: 'Order Management' },
    { id: 'users', icon: faUsers, label: 'User Management' },
    { id: 'dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { id: 'analytics', icon: faChartLine, label: 'Analytics' },
    { id: 'marketing', icon: faBullhorn, label: 'Marketing/Promotions' },
    { id: 'settings', icon: faCog, label: 'Settings' }
  ];

  return (
    <aside className="admin-sidebar-nav">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      
      <nav className="admin-nav-menu">
        {menuItems.map(item => (
          <button 
            key={item.id}
            className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Admin User Profile at Bottom */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-profile">
          <img 
            src={getAvatarUrl()} 
            alt="Admin Avatar" 
            className="admin-user-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
          />
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name ||'Admin'}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
