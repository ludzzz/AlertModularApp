import React from 'react';
import { ModuleDefinition, AlertSeverity } from '../../types';
import { useAlertContext } from '../../core/AlertContext';

// Mock Network Dashboard component
const MockNetworkDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();
  
  const triggerAlert = (severity: AlertSeverity) => {
    addAlert({
      moduleId: 'network',
      title: `Test ${severity} Alert`,
      message: `This is a test ${severity} alert`,
      severity: severity,
    });
  };
  
  return (
    <div>
      <h2>Network Dashboard</h2>
      <button data-testid="info-alert-btn" onClick={() => triggerAlert(AlertSeverity.INFO)}>
        Trigger INFO Alert
      </button>
      <button data-testid="warning-alert-btn" onClick={() => triggerAlert(AlertSeverity.WARNING)}>
        Trigger WARNING Alert
      </button>
      <button data-testid="error-alert-btn" onClick={() => triggerAlert(AlertSeverity.ERROR)}>
        Trigger ERROR Alert
      </button>
      <button data-testid="critical-alert-btn" onClick={() => triggerAlert(AlertSeverity.CRITICAL)}>
        Trigger CRITICAL Alert
      </button>
    </div>
  );
};

// Mock Network Settings component
const MockNetworkSettings: React.FC = () => {
  return <div>Network Settings</div>;
};

// Mock Network Alerts component
const MockNetworkAlerts: React.FC = () => {
  return <div>Network Alerts</div>;
};

// Mock Network Module
const mockNetworkModule: ModuleDefinition = {
  id: 'network',
  name: 'Network Monitoring',
  description: 'Monitor network devices and connections',
  menuItems: [
    {
      id: 'network-dashboard',
      label: 'Dashboard',
      path: '/network',
      icon: '📊'
    },
    {
      id: 'network-alerts',
      label: 'Alerts',
      path: '/network/alerts',
      icon: '🔔'
    },
    {
      id: 'network-settings',
      label: 'Settings',
      path: '/network/settings',
      icon: '⚙️'
    }
  ],
  component: MockNetworkDashboard,
  alertsEnabled: true
};

export default mockNetworkModule;

export const routes = [
  {
    path: '/network',
    component: MockNetworkDashboard
  },
  {
    path: '/network/alerts',
    component: MockNetworkAlerts
  },
  {
    path: '/network/settings',
    component: MockNetworkSettings
  }
];