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

// Mock NetworkModule
jest.mock('../modules/NetworkModule', () => ({
  __esModule: true,
  default: {
    id: 'network',
    name: 'Network Monitoring',
    menuItems: [],
    component: () => null,
    alertsEnabled: true
  },
  routes: []
}));

// Mock ServerModule
jest.mock('../modules/ServerModule', () => ({
  __esModule: true,
  default: {
    id: 'server',
    name: 'Server Monitoring',
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
    
    // Check that register was called 3 times (for core and 2 modules)
    expect(mockRegisterModule).toHaveBeenCalledTimes(3);
    
    // Check that alerts were added only for non-core modules (2 times)
    expect(mockAddAlert).toHaveBeenCalledTimes(2);
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