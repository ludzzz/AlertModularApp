import { ModuleDefinition } from '../../types';
import RiskPnlDashboard from './RiskPnlDashboard';
import RiskPnlSettings from './RiskPnlSettings';
import RiskPnlAlerts from './RiskPnlAlerts';

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
  component: RiskPnlDashboard,
  alertsEnabled: true
};

export default RiskPnlModule;

// Export the routes for this module
export const routes = [
  {
    path: '/riskpnl',
    component: RiskPnlDashboard
  },
  {
    path: '/riskpnl/alerts',
    component: RiskPnlAlerts
  },
  {
    path: '/riskpnl/settings',
    component: RiskPnlSettings
  }
];
