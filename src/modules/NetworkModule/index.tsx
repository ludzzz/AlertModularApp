import { ModuleDefinition } from '../../types';
import NetworkDashboard from './NetworkDashboard';
import NetworkSettings from './NetworkSettings';
import NetworkAlerts from './NetworkAlerts';

// This is the main export of the module
const NetworkModule: ModuleDefinition = {
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
  component: NetworkDashboard,
  alertsEnabled: true
};

export default NetworkModule;

// Export the routes for this module
export const routes = [
  {
    path: '/network',
    component: NetworkDashboard
  },
  {
    path: '/network/alerts',
    component: NetworkAlerts
  },
  {
    path: '/network/settings',
    component: NetworkSettings
  }
];