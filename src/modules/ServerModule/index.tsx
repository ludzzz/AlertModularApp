import { ModuleDefinition } from '../../types';
import ServerDashboard from './ServerDashboard';
import ServerList from './ServerList';
import ServerSettings from './ServerSettings';

// This is the main export of the module
const ServerModule: ModuleDefinition = {
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
  component: ServerDashboard,
  alertsEnabled: true
};

export default ServerModule;

// Export the routes for this module
export const routes = [
  {
    path: '/server',
    component: ServerDashboard
  },
  {
    path: '/server/list',
    component: ServerList
  },
  {
    path: '/server/settings',
    component: ServerSettings
  }
];