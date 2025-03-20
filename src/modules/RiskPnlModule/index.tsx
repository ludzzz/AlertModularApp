import { ModuleDefinition } from '../../types';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

// This is the main export of the module
const RiskPnlModule: ModuleDefinition = {
  id: 'riskpnl',
  name: 'Risk & PnL',
  description: 'Monitor and manage risk metrics and profit & loss data',
  menuItems: [
    {
      id: 'riskpnl-dashboard',
      label: 'Dashboard',
      path: '/riskpnl',
      icon: '📈'
    },
    {
      id: 'riskpnl-alerts',
      label: 'Alerts',
      path: '/riskpnl/alerts',
      icon: '🔔'
    },
    {
      id: 'riskpnl-settings',
      label: 'Settings',
      path: '/riskpnl/settings',
      icon: '⚙️'
    }
  ],
  component: DashboardPage,
  alertsEnabled: true
};

export default RiskPnlModule;

// Export the routes for this module
export const routes = [
  {
    path: '/riskpnl',
    component: DashboardPage
  },
  {
    path: '/riskpnl/alerts',
    component: AlertsPage
  },
  {
    path: '/riskpnl/settings',
    component: SettingsPage
  }
];