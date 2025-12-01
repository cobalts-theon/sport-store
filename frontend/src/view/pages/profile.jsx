import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FaUser, FaBoxOpen, FaLock, FaSignOutAlt, FaCamera, FaSave, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './pages-style/profile.css';

// Default avatar as inline SVG data URI - no external request needed
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23374151' width='120' height='120'/%3E%3Ccircle cx='60' cy='45' r='25' fill='%239CA3AF'/%3E%3Cellipse cx='60' cy='110' rx='40' ry='35' fill='%239CA3AF'/%3E%3C/svg%3E";

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general'); // general | orders | password
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: ''
    });
    const [orders, setOrders] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    
    // State cho đổi mật khẩu
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    // Ref để tránh gọi API và toast nhiều lần
    const hasFetched = useRef(false);

    // 1. Lấy thông tin user khi load trang
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchProfile();
        }
    }, []);

    // 2. Lấy danh sách đơn hàng khi chuyển sang tab 'orders'
    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
            // Xử lý hiển thị ảnh
            if (res.data.avatar) {
                const imgUrl = res.data.avatar.startsWith('http') ? res.data.avatar : `http://localhost:3000/${res.data.avatar}`;
                setPreviewImg(imgUrl);
            }
        } catch (error) {
            toast.error("Please login to continue!");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const fetchOrders = async () => {
        try {
            // Giả sử user object có id
            if(user.id) {
                const res = await api.get(`/orders/user/${user.id}`);
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    // --- LOGIC CẬP NHẬT THÔNG TIN ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImg(URL.createObjectURL(file)); // Preview ảnh ngay lập tức
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('phone', user.phone);
        formData.append('address', user.address);
        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }

        try {
            const res = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Profile updated successfully!");
            // Cập nhật lại localStorage để các component khác (như Header) cập nhật theo
            localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
            toast.error("Failed to update profile!");
        }
    };

    // --- LOGIC ĐỔI MẬT KHẨU ---
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (passData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters!");
        }
        try {
            await api.put('/users/profile/password', {
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword
            });
            toast.success("Password changed successfully!");
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* --- SIDEBAR --- */}
                <div className="profile-sidebar">
                    {/* Avatar Section */}
                    <div className="sidebar-avatar-section">
                        <div className="avatar-wrapper">
                            <img 
                                src={previewImg || DEFAULT_AVATAR} 
                                alt="Avatar" 
                                className="sidebar-avatar"
                                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                            />
                        </div>
                        <h3 className="sidebar-username">{user.name || 'User'}</h3>
                        <p className="sidebar-email">{user.email}</p>
                    </div>

                    <ul className="sidebar-menu">
                        <li 
                            className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            <FaUser /> <span>My Profile</span>
                        </li>
                        <li 
                            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <FaBoxOpen /> <span>My Orders</span>
                        </li>
                        <li 
                            className={`sidebar-item ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            <FaLock /> <span>Change Password</span>
                        </li>
                        <li className="sidebar-item logout" onClick={handleLogout}>
                            <FaSignOutAlt /> <span>Logout</span>
                        </li>
                    </ul>
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="profile-content">
                    
                    {/* TAB 1: GENERAL INFO */}
                    {activeTab === 'general' && (
                        <div className="animate-fade-in">
                            <div className="content-header">
                                <h2>My Profile</h2>
                                <p>Manage your profile information to secure your account</p>
                            </div>
                            
                            <form onSubmit={handleUpdateProfile}>
                                <div className="avatar-upload">
                                    <img 
                                        src={previewImg || DEFAULT_AVATAR} 
                                        alt="Avatar" 
                                        className="current-avatar"
                                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                                    />
                                    <label>
                                        <FaCamera /> Choose Photo
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" style={{display: 'none'}}/>
                                    </label>
                                </div>

                                <div className="form-row">
                                    <div className="form-group-profile">
                                        <label><FaUser /> Full Name</label>
                                        <input 
                                            type="text" 
                                            value={user.name || ''} 
                                            onChange={e => setUser({...user, name: e.target.value})}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group-profile">
                                        <label><FaEnvelope /> Email</label>
                                        <input 
                                            type="email" 
                                            value={user.email || ''} 
                                            disabled 
                                        />
                                        <small className="field-note">Email cannot be changed</small>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group-profile">
                                        <label><FaPhone /> Phone Number</label>
                                        <input 
                                            type="text" 
                                            value={user.phone || ''} 
                                            onChange={e => setUser({...user, phone: e.target.value})}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="form-group-profile">
                                        <label><FaMapMarkerAlt /> Address</label>
                                        <input 
                                            type="text" 
                                            value={user.address || ''} 
                                            onChange={e => setUser({...user, address: e.target.value})}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-save">
                                    <FaSave /> Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* TAB 2: MY ORDERS */}
                    {activeTab === 'orders' && (
                        <div className="animate-fade-in">
                            <div className="content-header">
                                <h2>My Orders</h2>
                                <p>View your purchase history and order status</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="orders-empty">
                                    <FaBoxOpen className="orders-empty-icon" />
                                    <h3>No Orders Yet</h3>
                                    <p>You haven't placed any orders.</p>
                                    <Link to="/products" className="btn-shop">Shop Now</Link>
                                </div>
                            ) : (
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="order-id-cell">#{order.id}</td>
                                                <td>{new Date(order.created_at || order.createdAt).toLocaleDateString('en-US')}</td>
                                                <td className="order-total">{formatPrice(order.totalAmount)}</td>
                                                <td>
                                                    <span className={`order-status status-${order.status || 'pending'}`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn-view">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* TAB 3: PASSWORD */}
                    {activeTab === 'password' && (
                        <div className="animate-fade-in">
                            <div className="content-header">
                                <h2>Change Password</h2>
                                <p>To keep your account secure, please do not share your password with others</p>
                            </div>

                            <form onSubmit={handleChangePassword} style={{ maxWidth: '450px' }}>
                                <div className="form-group-profile">
                                    <label><FaLock /> Current Password</label>
                                    <div className="password-input-wrapper">
                                        <input 
                                            type={showCurrentPass ? 'text' : 'password'}
                                            value={passData.currentPassword}
                                            onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        >
                                            {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group-profile">
                                    <label><FaLock /> New Password</label>
                                    <div className="password-input-wrapper">
                                        <input 
                                            type={showNewPass ? 'text' : 'password'}
                                            value={passData.newPassword}
                                            onChange={e => setPassData({...passData, newPassword: e.target.value})}
                                            placeholder="Enter new password (min 6 characters)"
                                            required
                                            minLength={6}
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                        >
                                            {showNewPass ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group-profile">
                                    <label><FaLock /> Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input 
                                            type={showConfirmPass ? 'text' : 'password'}
                                            value={passData.confirmPassword}
                                            onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                                            placeholder="Re-enter new password"
                                            required
                                            minLength={6}
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        >
                                            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="btn-save">
                                    <FaLock /> Change Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;