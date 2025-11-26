# Admin Components

This directory contains modular components for the Admin Panel to improve code organization and maintainability.

## Files Structure

### Components
- **AdminSidebar.jsx** - Left navigation sidebar with menu items
- **AdminHeader.jsx** - Top header with section title, subtitle, and action buttons
- **SettingsSection.jsx** - Settings page with configuration cards
- **PlaceholderSection.jsx** - Reusable placeholder component for coming soon sections

### Data & Utilities
- **mockData.js** - Mock data for products, promotions, and orders
- **adminUtils.js** - Utility functions (status helpers, formatters, etc.)
- **index.js** - Central export file for clean imports

## Usage

Import components in your admin page:

```jsx
import { 
  AdminSidebar, 
  AdminHeader, 
  SettingsSection, 
  PlaceholderSection,
  mockProducts, 
  mockPromotions, 
  mockOrders,
  getStockStatus, 
  getPromotionStatus, 
  getOrderStatus 
} from '../components/admin';
```

## Benefits

- **Reduced code length**: Main admin file reduced from 1452 to ~1098 lines (~24% reduction)
- **Better maintainability**: Each component is isolated and easier to update
- **Reusability**: Components can be reused across different admin sections
- **Cleaner imports**: Single import statement for all admin-related modules
- **Separation of concerns**: Data, utilities, and UI are properly separated
