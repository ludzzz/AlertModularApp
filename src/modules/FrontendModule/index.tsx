import { ModuleDefinition } from '../../types';
import FrontendDashboard from './FrontendDashboard';
import FrontendSettings from './FrontendSettings';
import FrontendAlerts from './FrontendAlerts';

// This is the main export of the module
const FrontendModule: ModuleDefinition = {
  id: 'frontend',
  name: 'Frontend Services',
  description: 'Monitor and manage frontend services and applications',
  menuItems: [
    {
      id: 'frontend-dashboard',
      label: 'Dashboard',
      path: '/frontend',
      icon: '📊'
    },
    {
      id: 'frontend-alerts',
      label: 'Alerts',
      path: '/frontend/alerts',
      icon: '🔔'
    },
    {
      id: 'frontend-settings',
      label: 'Settings',
      path: '/frontend/settings',
      icon: '⚙️'
    }
  ],
  component: FrontendDashboard,
  alertsEnabled: true
};

export default FrontendModule;

// Export the routes for this module
export const routes = [
  {
    path: '/frontend',
    component: FrontendDashboard
  },
  {
    path: '/frontend/alerts',
    component: FrontendAlerts
  },
  {
    path: '/frontend/settings',
    component: FrontendSettings
  }
];
