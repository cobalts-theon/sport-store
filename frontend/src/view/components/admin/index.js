// index.js tập hợp và xuất khẩu tất cả các thành phần quản trị để sử dụng dễ dàng trong các phần khác của ứng dụng
//Liên quan đến frontend/src/view/components/admin/AdminHeader.jsx
//Liên quan đến frontend/src/view/components/admin/AdminSidebar.jsx
export { default as AdminSidebar } from './AdminSidebar';
export { default as AdminHeader } from './AdminHeader';
export { default as SettingsSection } from './SettingsSection';
export { default as PlaceholderSection } from './PlaceholderSection';
export { default as UserManagement } from './UserManagement';
export { default as Dashboard } from './Dashboard';
export { default as Analytics } from './Analytics';
export * from './mockData';
export * from './mockUsers';
export * from './adminUtils';
