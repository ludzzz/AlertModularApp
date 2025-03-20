import { ModuleDefinition } from '../../types';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

// This is the main export of the module
const ToolsAndJobsModule: ModuleDefinition = {
  id: 'toolsandjobs',
  name: 'Tools & Jobs',
  description: 'Manage tools, scheduled jobs, and automation tasks',
  menuItems: [
    {
      id: 'toolsandjobs-dashboard',
      label: 'Dashboard',
      path: '/toolsandjobs',
      icon: '🛠️'
    },
    {
      id: 'toolsandjobs-alerts',
      label: 'Alerts',
      path: '/toolsandjobs/alerts',
      icon: '🔔'
    },
    {
      id: 'toolsandjobs-settings',
      label: 'Settings',
      path: '/toolsandjobs/settings',
      icon: '⚙️'
    }
  ],
  component: DashboardPage,
  alertsEnabled: true
};

export default ToolsAndJobsModule;

// Export the routes for this module
export const routes = [
  {
    path: '/toolsandjobs',
    component: DashboardPage
  },
  {
    path: '/toolsandjobs/alerts',
    component: AlertsPage
  },
  {
    path: '/toolsandjobs/settings',
    component: SettingsPage
  }
];