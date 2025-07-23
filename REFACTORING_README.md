# E-Commerce Admin Frontend - Refactored Structure

## Overview

This project has been refactored to eliminate code duplication and improve maintainability by introducing:

1. **Generic CRUD Service** - Centralized API operations
2. **Custom Hook** - Reusable state management for CRUD operations
3. **Component Architecture** - Breaking down large components into smaller, focused pieces
4. **Consistent Error Handling** - Unified toast notifications

## New Structure

### Services

- `services/crudService.js` - Generic CRUD operations with consistent error handling
- Pre-configured instances for categories, products, users, orders, and inventory

### Hooks

- `hooks/useCrud.js` - Custom hook for managing CRUD state and operations

### Common Components

- `components/common/PageHeader.jsx` - Reusable page header with title and action buttons
- `components/common/SearchBar.jsx` - Reusable search input with icon
- `components/common/ConfirmDialog.jsx` - Reusable confirmation dialog

### Feature-Specific Components

#### Categories

- `components/categories/CategoryForm.jsx` - Form for creating/editing categories
- `components/categories/CategoryTable.jsx` - Table for displaying categories

#### Products

- `components/products/ProductForm.jsx` - Form for creating/editing products
- `components/products/ProductTable.jsx` - Table for displaying products

#### Users

- `components/users/UserForm.jsx` - Form for creating/editing users
- `components/users/UserTable.jsx` - Table for displaying users

## Benefits

### 1. Code Reusability

- Single CRUD service handles all API operations
- Common components reduce duplication
- Consistent patterns across all pages

### 2. Maintainability

- Changes to CRUD logic only need to be made in one place
- Consistent error handling and loading states
- Smaller, focused components are easier to debug

### 3. Consistency

- Unified toast notifications
- Consistent UI patterns
- Standardized component props

### 4. Developer Experience

- Less boilerplate code
- Easier to add new entities
- Clear separation of concerns

## Usage Example

### Adding a New Entity

1. Create a service instance:

```javascript
export const newEntityService = new CrudService("/new-entity", "New Entity");
```

2. Create form and table components following the existing patterns

3. Use the hook in your page component:

```javascript
const {
  data: entities,
  loading,
  createItem,
  updateItem,
  deleteItem,
} = useCrud(newEntityService);
```

### Key Features of the CRUD Service

- **Automatic Error Handling**: Toast notifications for success/error states
- **Consistent Response Format**: `{ data, error }` pattern
- **Search Support**: Built-in search functionality
- **Loading States**: Automatic loading state management

### Custom Hook Features

- **Auto-fetch**: Automatically loads data on mount
- **Optimistic Updates**: Refetches data after successful operations
- **Search Debouncing**: Built-in debounced search
- **Error State Management**: Centralized error handling

## Migration Notes

The refactoring maintains the same functionality while improving the codebase structure. All existing features continue to work as expected, but with better performance and maintainability.

## Next Steps

Consider extending this pattern to:

1. Orders management (with status updates)
2. Inventory management (with stock adjustments)
3. Dashboard statistics
4. User authentication flows
