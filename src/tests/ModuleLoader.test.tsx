import React from 'react';
import { render, act } from '@testing-library/react';
import { AlertContextProvider } from '../core/AlertContext';
import ModuleLoader from '../core/ModuleLoader';

// Mock core and module registration
const mockRegisterModule = jest.fn();
const mockAddAlert = jest.fn();

// Mock CoreContext
jest.mock('../core/CoreContext', () => ({
  useCoreContext: () => ({
    registerModule: mockRegisterModule
  }),
  CoreModuleDefinition: {
    id: 'core',
    name: 'Dashboard',
    description: 'Core dashboard module',
    menuItems: [
      {
        id: 'core-dashboard',
        label: 'Dashboard',
        path: '/',
        icon: '📊'
      }
    ],
    component: () => null,
    alertsEnabled: true
  }
}));

// Mock AlertContext
jest.mock('../core/AlertContext', () => ({
  AlertContextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAlertContext: () => ({
    addAlert: mockAddAlert
  })
}));

// Mock the new modules
jest.mock('../modules/FrontendModule', () => ({
  __esModule: true,
  default: {
    id: 'frontend',
    name: 'Frontend Services',
    menuItems: [],
    component: () => null,
    alertsEnabled: true
  },
  routes: []
}));

jest.mock('../modules/RiskPnlModule', () => ({
  __esModule: true,
  default: {
    id: 'riskpnl',
    name: 'Risk & PnL',
    menuItems: [],
    component: () => null,
    alertsEnabled: true
  },
  routes: []
}));

jest.mock('../modules/BackendModule', () => ({
  __esModule: true,
  default: {
    id: 'backend',
    name: 'Backend Services',
    menuItems: [],
    component: () => null, // Mock the DashboardPage component
    alertsEnabled: true
  },
  routes: [
    { path: '/backend', component: () => null },
    { path: '/backend/alerts', component: () => null },
    { path: '/backend/settings', component: () => null }
  ]
}));

jest.mock('../modules/ToolsAndJobsModule', () => ({
  __esModule: true,
  default: {
    id: 'toolsandjobs',
    name: 'Tools & Jobs',
    menuItems: [],
    component: () => null,
    alertsEnabled: true
  },
  routes: []
}));

jest.mock('../modules/ResearchDataModule', () => ({
  __esModule: true,
  default: {
    id: 'research-data',
    name: 'Research & Data',
    menuItems: [],
    component: () => null,
    alertsEnabled: true
  },
  routes: []
}));

// Mock CoreModule
jest.mock('../core/CoreModule', () => () => <div>CoreModule</div>);

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: () => <div>Route</div>
}));

describe('ModuleLoader', () => {
  beforeEach(() => {
    mockRegisterModule.mockClear();
    mockAddAlert.mockClear();
    // Reset the loaded modules tracking
    window.___loadedModules = undefined;
  });

  test('registers modules only once on mount', () => {
    render(<ModuleLoader />);
    
    // Check that register was called 6 times (for core and 5 modules)
    expect(mockRegisterModule).toHaveBeenCalledTimes(6);
    
    // Check that alerts were added only for non-core modules (5 times)
    expect(mockAddAlert).toHaveBeenCalledTimes(5);
  });

  test('does not re-register modules on re-render', () => {
    const { rerender } = render(<ModuleLoader />);
    
    // Clear mock calls after initial render
    mockRegisterModule.mockClear();
    mockAddAlert.mockClear();
    
    // Re-render the component
    rerender(<ModuleLoader />);
    
    // No new registrations should happen
    expect(mockRegisterModule).not.toHaveBeenCalled();
    expect(mockAddAlert).not.toHaveBeenCalled();
  });

  test('handles module registration errors', () => {
    // Clear any window.__loadedModules from previous tests
    window.___loadedModules = undefined;
    
    // Make registerModule throw an error for one module
    mockRegisterModule.mockImplementationOnce(() => {
      throw new Error('Registration failed');
    });
    
    render(<ModuleLoader />);
    
    // Should still try to register modules
    expect(mockRegisterModule).toHaveBeenCalled();
    
    // Should add error alert
    expect(mockAddAlert).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Module Load Failed',
      severity: expect.anything(), // AlertSeverity.ERROR
    }));
  });
});