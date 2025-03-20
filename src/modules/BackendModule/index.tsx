import { ModuleDefinition } from '../../types';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

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
  component: DashboardPage, // Default component for module home page
  alertsEnabled: true
};

export default BackendModule;

// Export the routes for this module
export const routes = [
  {
    path: '/backend',
    component: DashboardPage
  },
  {
    path: '/backend/alerts',
    component: AlertsPage
  },
  {
    path: '/backend/settings',
    component: SettingsPage
  }
];
