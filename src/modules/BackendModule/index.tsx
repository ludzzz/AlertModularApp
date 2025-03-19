import { ModuleDefinition } from '../../types';
import BackendDashboard from './BackendDashboard';
import BackendSettings from './BackendSettings';
import BackendAlerts from './BackendAlerts';

// This is the main export of the module
const BackendModule: ModuleDefinition = {
  id: 'backend',
  name: 'Backend Services',
  description: 'Monitor and manage backend services and infrastructure',
  menuItems: [
    {
      id: 'backend-dashboard',
      label: 'Dashboard',
      path: '/backend',
      icon: '💻'
    },
    {
      id: 'backend-alerts',
      label: 'Alerts',
      path: '/backend/alerts',
      icon: '🔔'
    },
    {
      id: 'backend-settings',
      label: 'Settings',
      path: '/backend/settings',
      icon: '⚙️'
    }
  ],
  component: BackendDashboard,
  alertsEnabled: true
};

export default BackendModule;

// Export the routes for this module
export const routes = [
  {
    path: '/backend',
    component: BackendDashboard
  },
  {
    path: '/backend/alerts',
    component: BackendAlerts
  },
  {
    path: '/backend/settings',
    component: BackendSettings
  }
];
