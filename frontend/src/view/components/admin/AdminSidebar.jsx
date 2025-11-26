import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox,
  faShoppingCart,
  faUsers,
  faTachometerAlt,
  faChartLine,
  faBullhorn,
  faCog
} from '@fortawesome/free-solid-svg-icons';

function AdminSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
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
    </aside>
  );
}

export default AdminSidebar;
