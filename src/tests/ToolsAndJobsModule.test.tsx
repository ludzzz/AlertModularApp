import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlertContextProvider } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import DashboardPage from '../modules/ToolsAndJobsModule/pages/DashboardPage';
import AlertsPage from '../modules/ToolsAndJobsModule/pages/AlertsPage';
import SettingsPage from '../modules/ToolsAndJobsModule/pages/SettingsPage';

describe('ToolsAndJobs Module', () => {
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
      expect(screen.getByText('Tools & Jobs Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Job Stats')).toBeInTheDocument();
      expect(screen.getByText('Available Tools')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Jobs')).toBeInTheDocument();
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
      expect(screen.getByText('Tools & Jobs Alerts')).toBeInTheDocument();
      expect(screen.getByText('Add Test Alert')).toBeInTheDocument();
      expect(screen.getByText('Refresh Alerts')).toBeInTheDocument();
      // When no alerts, should show empty state
      expect(screen.getByText('No tools & jobs alerts')).toBeInTheDocument();
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
      expect(screen.getByText('Tools & Jobs Settings')).toBeInTheDocument();
      expect(screen.getByText('Jobs Settings')).toBeInTheDocument();
      expect(screen.getByText('Tools Settings')).toBeInTheDocument();
      expect(screen.getByText('Job Scheduler Settings')).toBeInTheDocument();
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });
});