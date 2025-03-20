import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../modules/FrontendModule/pages/DashboardPage';
import { AlertsPage } from '../modules/FrontendModule/pages/AlertsPage';
import { SettingsPage } from '../modules/FrontendModule/pages/SettingsPage';
import { AlertContextProvider } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the components
jest.mock('../modules/FrontendModule/components/FrontendDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="frontend-dashboard">Frontend Dashboard Component</div>
}));

jest.mock('../modules/FrontendModule/components/FrontendAlerts', () => ({
  __esModule: true,
  default: () => <div data-testid="frontend-alerts">Frontend Alerts Component</div>
}));

jest.mock('../modules/FrontendModule/components/FrontendSettings', () => ({
  __esModule: true,
  default: () => <div data-testid="frontend-settings">Frontend Settings Component</div>
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

describe('Frontend Module Pages', () => {
  test('DashboardPage renders the Frontend Dashboard component', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByTestId('frontend-dashboard')).toBeInTheDocument();
  });

  test('AlertsPage renders the Frontend Alerts component', () => {
    renderWithProviders(<AlertsPage />);
    expect(screen.getByTestId('frontend-alerts')).toBeInTheDocument();
  });

  test('SettingsPage renders the Frontend Settings component', () => {
    renderWithProviders(<SettingsPage />);
    expect(screen.getByTestId('frontend-settings')).toBeInTheDocument();
  });
});