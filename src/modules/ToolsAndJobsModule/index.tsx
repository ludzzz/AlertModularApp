import { ModuleDefinition } from '../../types';
import ToolsAndJobsDashboard from './ToolsAndJobsDashboard';
import ToolsAndJobsSettings from './ToolsAndJobsSettings';
import ToolsAndJobsAlerts from './ToolsAndJobsAlerts';

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
  component: ToolsAndJobsDashboard,
  alertsEnabled: true
};

export default ToolsAndJobsModule;

// Export the routes for this module
export const routes = [
  {
    path: '/toolsandjobs',
    component: ToolsAndJobsDashboard
  },
  {
    path: '/toolsandjobs/alerts',
    component: ToolsAndJobsAlerts
  },
  {
    path: '/toolsandjobs/settings',
    component: ToolsAndJobsSettings
  }
];
