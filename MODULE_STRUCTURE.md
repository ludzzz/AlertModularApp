# Module Structure Guide

This document outlines the standard module structure to be followed for all modules in the AlertModular application.

## Directory Structure

Each module should follow this standard directory structure:

```
ModuleName/
├── index.tsx                 # Module definition, menu items, and routes
├── pages/                    # Page components (one per menu item)
│   ├── DashboardPage.tsx     # Main dashboard page
│   ├── AlertsPage.tsx        # Alerts page
│   ├── SettingsPage.tsx      # Settings page
│   └── ... (other pages)
└── components/               # Feature-specific components
    ├── ModuleNameDashboard.tsx  # Dashboard implementation
    ├── ModuleNameAlerts.tsx     # Alerts implementation
    ├── ModuleNameSettings.tsx   # Settings implementation
    └── ... (other components)
```

## Module Implementation Steps

1. **Create Module Directory Structure**
   ```bash
   mkdir -p src/modules/ModuleName/pages src/modules/ModuleName/components
   ```

2. **Implement Components**
   Create your feature-specific components in the `components/` directory. These handle the actual functionality.

3. **Create Page Components**
   In the `pages/` directory, create simple components that import and render the corresponding implementation components:

   ```tsx
   // DashboardPage.tsx
   import React from 'react';
   import ModuleNameDashboard from '../components/ModuleNameDashboard';

   export const DashboardPage: React.FC = () => {
     return <ModuleNameDashboard />;
   };
   ```

4. **Define Module and Routes**
   In `index.tsx`, define the module and its routes:

   ```tsx
   import { ModuleDefinition } from '../../types';
   import { DashboardPage } from './pages/DashboardPage';
   import { AlertsPage } from './pages/AlertsPage';
   import { SettingsPage } from './pages/SettingsPage';

   const ModuleName: ModuleDefinition = {
     id: 'modulename',
     name: 'Module Name',
     description: 'Description of the module',
     menuItems: [
       {
         id: 'modulename-dashboard',
         label: 'Dashboard',
         path: '/modulename',
         icon: '📊'
       },
       // ... other menu items
     ],
     component: DashboardPage, // Default component for the module home page
     alertsEnabled: true
   };

   export default ModuleName;

   // Export the routes for this module
   export const routes = [
     {
       path: '/modulename',
       component: DashboardPage
     },
     // ... other routes
   ];
   ```

5. **Create Tests**
   For each module, create a corresponding test file in the `tests/` directory:

   ```tsx
   // ModuleName.test.tsx
   import React from 'react';
   import { render, screen } from '@testing-library/react';
   import { DashboardPage } from '../modules/ModuleName/pages/DashboardPage';
   // ... imports for other pages and providers

   // Mock the components
   jest.mock('../modules/ModuleName/components/ModuleNameDashboard', () => ({
     __esModule: true,
     default: () => <div data-testid="modulename-dashboard">ModuleName Dashboard Component</div>
   }));
   // ... mocks for other components

   // Test each page component
   describe('ModuleName Module Pages', () => {
     test('DashboardPage renders the ModuleName Dashboard component', () => {
       renderWithProviders(<DashboardPage />);
       expect(screen.getByTestId('modulename-dashboard')).toBeInTheDocument();
     });
     // ... tests for other pages
   });
   ```

## Benefits of This Structure

- **Clear Separation of Concerns**: Each component has a specific responsibility
- **Scalability**: Easy to add new menu items and pages
- **Maintainability**: Simpler components are easier to understand and maintain
- **Testability**: Components can be tested in isolation
- **Consistency**: Standard pattern across all modules

## Examples

See the implemented Backend and Frontend modules as reference examples.