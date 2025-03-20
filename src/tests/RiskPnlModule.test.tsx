import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlertContextProvider } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import DashboardPage from '../modules/RiskPnlModule/pages/DashboardPage';
import AlertsPage from '../modules/RiskPnlModule/pages/AlertsPage';
import SettingsPage from '../modules/RiskPnlModule/pages/SettingsPage';

describe('RiskPnl Module', () => {
  describe('DashboardPage', () => {
    it('renders correctly', () => {
      render(
        <CoreContextProvider>
          <AlertContextProvider>
            <DashboardPage />
          </AlertContextProvider>
        </CoreContextProvider>
      );
      
      // Verify dashboard elements are rendered
      expect(screen.getByText('Risk & PnL Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Portfolio PnL Summary')).toBeInTheDocument();
      expect(screen.getByText('Generate Test Alert')).toBeInTheDocument();
    });
  });
  
  describe('AlertsPage', () => {
    it('renders correctly', () => {
      render(
        <CoreContextProvider>
          <AlertContextProvider>
            <AlertsPage />
          </AlertContextProvider>
        </CoreContextProvider>
      );
      
      // Verify alerts elements are rendered
      expect(screen.getByText('Risk & PnL Alerts')).toBeInTheDocument();
      expect(screen.getByText('Add Test Alert')).toBeInTheDocument();
      expect(screen.getByText('Refresh Alerts')).toBeInTheDocument();
      // When no alerts, should show empty state
      expect(screen.getByText('No risk & PnL alerts')).toBeInTheDocument();
    });
  });
  
  describe('SettingsPage', () => {
    it('renders correctly', () => {
      render(
        <CoreContextProvider>
          <AlertContextProvider>
            <SettingsPage />
          </AlertContextProvider>
        </CoreContextProvider>
      );
      
      // Verify settings elements are rendered
      expect(screen.getByText('Risk & PnL Module Settings')).toBeInTheDocument();
      expect(screen.getByText('General Settings')).toBeInTheDocument();
      expect(screen.getByText('Risk Thresholds')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Configurations')).toBeInTheDocument();
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });
});