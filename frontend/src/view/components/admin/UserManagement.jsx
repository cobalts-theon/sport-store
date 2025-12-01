import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faUserShield,
  faUserCheck,
  faUserClock,
  faSearch,
  faTimes,
  faEdit,
  faTrash,
  faBan,
  faCheckCircle,
  faEnvelope,
  faCalendarAlt,
  faShoppingCart,
  faDollarSign,
  faChevronDown,
  faChevronUp,
  faPlus,
  faSave,
  faLock,
  faUser,
  faPhone,
  faMapMarkerAlt,
  faThLarge,
  faList
} from '@fortawesome/free-solid-svg-icons';

function UserManagement({ users, setUsers, viewMode = 'grid', setViewMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedUser, setExpandedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    status: 'active',
    phone: '',
    address: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'customer',
      status: 'active',
      phone: '',
      address: ''
    });
    setEditingUser(null);
    setShowAddForm(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      address: user.address || ''
    });
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
        : u
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setUsers([...users, newUser]);
    }
    
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  const toggleUserDetails = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getUserStatusColor = (status) => {
    const statusColors = {
      active: '#4CAF50',
      suspended: '#F44336',
      pending: '#FF9800'
    };
    return statusColors[status] || '#666';
  };

  const getRoleIcon = (role) => {
    const roleIcons = {
      admin: faUserShield,
      customer: faUser
    };
    return roleIcons[role] || faUser;
  };

  return (
    <>
      {!showAddForm && (
        <>
          {/* User Stats */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faUsers} className="admin-stat-icon" />
              <div className="admin-stat-content">
                <h3>Total Users</h3>
                <p className="admin-stat-value">{users.length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faUserCheck} className="admin-stat-icon" style={{color: '#4CAF50'}} />
              <div className="admin-stat-content">
                <h3>Active Users</h3>
                <p className="admin-stat-value">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faUserShield} className="admin-stat-icon" style={{color: '#2196F3'}} />
              <div className="admin-stat-content">
                <h3>Administrators</h3>
                <p className="admin-stat-value">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <FontAwesomeIcon icon={faUserClock} className="admin-stat-icon" style={{color: '#FF9800'}} />
              <div className="admin-stat-content">
                <h3>New This Month</h3>
                <p className="admin-stat-value">
                  {users.filter(u => {
                    const joinDate = new Date(u.joinedDate);
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && 
                           joinDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="admin-controls">
            <div className="search-box-admin">
              <FontAwesomeIcon icon={faSearch} className="search-icon-admin" />
              <input
                type="text"
                placeholder="Search users by name or email..."
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

            <button className="add-product-btn" onClick={handleAddUser}>
              <FontAwesomeIcon icon={faPlus} />
              Add User
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="admin-controls" style={{marginTop: '0.5rem'}}>
            <div className="view-mode-toggle">
              <button 
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode && setViewMode('list')}
                title="List View"
              >
                <FontAwesomeIcon icon={faList} />
                <span>List</span>
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode && setViewMode('grid')}
                title="Grid View"
              >
                <FontAwesomeIcon icon={faThLarge} />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <button 
              className={`filter-btn-admin ${selectedRole === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRole('all')}
            >
              All Roles
            </button>
            <button 
              className={`filter-btn-admin ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <FontAwesomeIcon icon={faUserShield} /> Admins
            </button>
            <button 
              className={`filter-btn-admin ${selectedRole === 'customer' ? 'active' : ''}`}
              onClick={() => setSelectedRole('customer')}
            >
              <FontAwesomeIcon icon={faUser} /> Customers
            </button>
            <div style={{width: '20px'}}></div>
            <button 
              className={`filter-btn-admin ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
            >
              All Status
            </button>
            <button 
              className={`filter-btn-admin ${selectedStatus === 'active' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('active')}
            >
              <FontAwesomeIcon icon={faUserCheck} /> Active
            </button>
            <button 
              className={`filter-btn-admin ${selectedStatus === 'suspended' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('suspended')}
            >
              <FontAwesomeIcon icon={faBan} /> Suspended
            </button>
          </div>

          {/* Users List */}
          <div className={`admin-products-list ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {filteredUsers.length === 0 ? (
              <div className="admin-no-products">
                <FontAwesomeIcon icon={faUsers} className="admin-no-products-icon" />
                <h2>No users found</h2>
                <p>Try adjusting your filters or add a new user</p>
              </div>
            ) : (
              filteredUsers.map(user => {
                const statusColor = getUserStatusColor(user.status);
                const roleIcon = getRoleIcon(user.role);
                const joinDate = new Date(user.joinedDate);
                const lastActive = new Date(user.lastActive);
                
                return (
                  <div key={user.id} className={`admin-product-card ${viewMode}`}>
                    {/* User Card Header */}
                    <div className="admin-product-card-header">
                      <div className="admin-product-main-info">
                        <div className="admin-user-icon">
                          <FontAwesomeIcon icon={roleIcon} />
                        </div>
                        <div className="admin-product-info">
                          <h3 className="admin-product-name">{user.name}</h3>
                          <p className="admin-product-category">
                            <FontAwesomeIcon icon={faEnvelope} /> {user.email}
                          </p>
                          <p className="admin-user-role">
                            <FontAwesomeIcon icon={roleIcon} /> {user.role.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="admin-product-meta">
                        <div className="admin-user-stats">
                          <div className="admin-user-stat-item">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span>{user.totalOrders} orders</span>
                          </div>
                          <div className="admin-user-stat-item">
                            <FontAwesomeIcon icon={faDollarSign} />
                            <span>${user.totalSpent.toFixed(2)}</span>
                          </div>
                        </div>
                        <div 
                          className="admin-product-stock"
                          style={{ backgroundColor: statusColor + '20', color: statusColor }}
                        >
                          {user.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* User Details Preview */}
                    <div className="admin-user-details">
                      <div className="admin-user-detail-item">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>Joined: {joinDate.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="admin-user-detail-item">
                        <FontAwesomeIcon icon={faUserClock} />
                        <span>Last Active: {lastActive.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>

                    {/* Expanded User Details */}
                    {expandedUser === user.id && (
                      <div className="admin-user-expanded">
                        <div className="admin-order-section">
                          <h4><FontAwesomeIcon icon={faUser} /> Contact Information</h4>
                          {user.phone && (
                            <p className="admin-user-expanded-info">
                              <FontAwesomeIcon icon={faPhone} /> Phone: {user.phone}
                            </p>
                          )}
                          {user.address && (
                            <p className="admin-user-expanded-info">
                              <FontAwesomeIcon icon={faMapMarkerAlt} /> Address: {user.address}
                            </p>
                          )}
                          {!user.phone && !user.address && (
                            <p className="admin-user-expanded-info">No additional contact information</p>
                          )}
                        </div>
                        <div className="admin-order-section">
                          <h4><FontAwesomeIcon icon={faShoppingCart} /> Purchase History</h4>
                          <p className="admin-user-expanded-info">
                            Total Orders: {user.totalOrders} | Total Spent: ${user.totalSpent.toFixed(2)}
                          </p>
                          {user.totalOrders > 0 && (
                            <p className="admin-user-expanded-info">
                              Average Order Value: ${(user.totalSpent / user.totalOrders).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Card Footer */}
                    <div className="admin-product-card-footer">
                      <div className="admin-product-actions">
                        <button 
                          className="admin-action-btn secondary"
                          onClick={() => toggleUserDetails(user.id)}
                        >
                          {expandedUser === user.id ? 'Hide Details' : 'View Details'}
                          <FontAwesomeIcon icon={expandedUser === user.id ? faChevronUp : faChevronDown} />
                        </button>
                        <button 
                          className="admin-action-btn primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button 
                          className={`admin-action-btn ${user.status === 'active' ? 'danger' : 'secondary'}`}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <FontAwesomeIcon icon={user.status === 'active' ? faBan : faCheckCircle} />
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button 
                          className="admin-action-btn danger"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Add/Edit User Form */}
      {showAddForm && (
        <div className="admin-form-container">
          <div className="admin-form-header">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <button className="admin-close-btn" onClick={handleCancelForm}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="admin-product-form-main">
            <div className="admin-form-group">
              <label><FontAwesomeIcon icon={faUser} /> Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="admin-form-group">
              <label><FontAwesomeIcon icon={faEnvelope} /> Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faUserShield} /> Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faCheckCircle} /> Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label><FontAwesomeIcon icon={faPhone} /> Phone Number (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="admin-form-group">
              <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Address (Optional)</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            {!editingUser && (
              <div className="admin-form-group">
                <label><FontAwesomeIcon icon={faLock} /> Initial Password</label>
                <input
                  type="password"
                  placeholder="Enter initial password"
                  required={!editingUser}
                />
                <small style={{color: '#888', fontSize: '0.75rem', marginTop: '0.3rem'}}>
                  User will be required to change password on first login
                </small>
              </div>
            )}

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-cancel" onClick={handleCancelForm}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button type="submit" className="admin-btn-save">
                <FontAwesomeIcon icon={faSave} /> {editingUser ? 'Update' : 'Add'} User
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default UserManagement;
