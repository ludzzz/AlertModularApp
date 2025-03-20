import { ModuleDefinition } from '../../types';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

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
  component: DashboardPage, // Default component for the module home page
  alertsEnabled: true
};

export default FrontendModule;

// Export the routes for this module
export const routes = [
  {
    path: '/frontend',
    component: DashboardPage
  },
  {
    path: '/frontend/alerts',
    component: AlertsPage
  },
  {
    path: '/frontend/settings',
    component: SettingsPage
  }
];
