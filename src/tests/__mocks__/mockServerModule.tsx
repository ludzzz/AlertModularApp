import React from 'react';
import { ModuleDefinition, AlertSeverity } from '../../types';
import { useAlertContext } from '../../core/AlertContext';

// Mock Server Dashboard component
const MockServerDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();
  
  const triggerAlert = (severity: AlertSeverity) => {
    addAlert({
      moduleId: 'server',
      title: `Test Server ${severity} Alert`,
      message: `This is a test server ${severity} alert`,
      severity: severity,
    });
  };
  
  return (
    <div>
      <h2>Server Dashboard</h2>
      <button data-testid="server-info-btn" onClick={() => triggerAlert(AlertSeverity.INFO)}>
        Trigger Server INFO Alert
      </button>
      <button data-testid="server-warning-btn" onClick={() => triggerAlert(AlertSeverity.WARNING)}>
        Trigger Server WARNING Alert
      </button>
      <button data-testid="server-error-btn" onClick={() => triggerAlert(AlertSeverity.ERROR)}>
        Trigger Server ERROR Alert
      </button>
      <button data-testid="server-critical-btn" onClick={() => triggerAlert(AlertSeverity.CRITICAL)}>
        Trigger Server CRITICAL Alert
      </button>
    </div>
  );
};

// Mock Server List component
const MockServerList: React.FC = () => {
  return <div>Server List</div>;
};

// Mock Server Settings component
const MockServerSettings: React.FC = () => {
  return <div>Server Settings</div>;
};

// Mock Server Module
const mockServerModule: ModuleDefinition = {
  id: 'server',
  name: 'Server Monitoring',
  description: 'Monitor server health and performance',
  menuItems: [
    {
      id: 'server-dashboard',
      label: 'Dashboard',
      path: '/server',
      icon: '📊'
    },
    {
      id: 'server-list',
      label: 'Server List',
      path: '/server/list',
      icon: '🖥️'
    },
    {
      id: 'server-settings',
      label: 'Settings',
      path: '/server/settings',
      icon: '⚙️'
    }
  ],
  component: MockServerDashboard,
  alertsEnabled: true
};

export default mockServerModule;

export const routes = [
  {
    path: '/server',
    component: MockServerDashboard
  },
  {
    path: '/server/list',
    component: MockServerList
  },
  {
    path: '/server/settings',
    component: MockServerSettings
  }
];