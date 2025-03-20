import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../modules/BackendModule/pages/DashboardPage';
import { AlertsPage } from '../modules/BackendModule/pages/AlertsPage';
import { SettingsPage } from '../modules/BackendModule/pages/SettingsPage';
import { AlertContextProvider } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the components
jest.mock('../modules/BackendModule/components/BackendDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="backend-dashboard">Backend Dashboard Component</div>
}));

jest.mock('../modules/BackendModule/components/BackendAlerts', () => ({
  __esModule: true,
  default: () => <div data-testid="backend-alerts">Backend Alerts Component</div>
}));

jest.mock('../modules/BackendModule/components/BackendSettings', () => ({
  __esModule: true,
  default: () => <div data-testid="backend-settings">Backend Settings Component</div>
}));

// Mock the hooks
jest.mock('../core/AlertContext', () => ({
  useAlertContext: () => ({
    alerts: [],
    addAlert: jest.fn(),
    removeAlert: jest.fn(),
    acknowledgeAlert: jest.fn(),
    resolveAlert: jest.fn(),
    silenceAlert: jest.fn()
  }),
  AlertContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-context-provider">{children}</div>
  )
}));

jest.mock('../core/CoreContext', () => ({
  useCoreContext: () => ({
    modules: []
  }),
  CoreContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="core-context-provider">{children}</div>
  )
}));

jest.mock('../hooks/useConnectorAlerts', () => ({
  useConnectorAlerts: () => ({
    refreshAlerts: jest.fn()
  })
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CoreContextProvider>
        <AlertContextProvider>
          {ui}
        </AlertContextProvider>
      </CoreContextProvider>
    </BrowserRouter>
  );
};

describe('Backend Module Pages', () => {
  test('DashboardPage renders the Backend Dashboard component', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByTestId('backend-dashboard')).toBeInTheDocument();
  });

  test('AlertsPage renders the Backend Alerts component', () => {
    renderWithProviders(<AlertsPage />);
    expect(screen.getByTestId('backend-alerts')).toBeInTheDocument();
  });

  test('SettingsPage renders the Backend Settings component', () => {
    renderWithProviders(<SettingsPage />);
    expect(screen.getByTestId('backend-settings')).toBeInTheDocument();
  });
});