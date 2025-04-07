import { ModuleDefinition } from '../../types';
import ResearchDataDashboard from './ResearchDataDashboard';
import ResearchDataSettings from './ResearchDataSettings';
import ResearchDataAlerts from './ResearchDataAlerts';

// This is the main export of the module
const ResearchDataModule: ModuleDefinition = {
  id: 'research-data',
  name: 'Research & Data',
  description: 'Monitor and manage research and data services',
  menuItems: [
    {
      id: 'research-data-dashboard',
      label: 'Dashboard',
      path: '/research-data',
      icon: '📊'
    },
    {
      id: 'research-data-alerts',
      label: 'Alerts',
      path: '/research-data/alerts',
      icon: '🔔'
    },
    {
      id: 'research-data-settings',
      label: 'Settings',
      path: '/research-data/settings',
      icon: '⚙️'
    }
  ],
  component: ResearchDataDashboard, // Default component for the module home page
  alertsEnabled: true
};

export default ResearchDataModule;

// Export the routes for this module
export const routes = [
  {
    path: '/research-data',
    component: ResearchDataDashboard
  },
  {
    path: '/research-data/alerts',
    component: ResearchDataAlerts
  },
  {
    path: '/research-data/settings',
    component: ResearchDataSettings
  }
];