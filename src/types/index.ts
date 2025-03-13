// Module Interface Types
export interface ModuleMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description?: string;
  menuItems: ModuleMenuItem[];
  component: React.ComponentType;
  alertsEnabled: boolean;
}

// Alert System Types
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface Alert {
  id: string;
  moduleId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

// Core Application Context Types
export interface CoreContextType {
  modules: ModuleDefinition[];
  registerModule: (module: ModuleDefinition) => void;
  unregisterModule: (moduleId: string) => void;
  currentModuleId: string | null;
  setCurrentModuleId: (id: string | null) => void;
  getModuleById: (id: string) => ModuleDefinition | undefined;
  toggleModuleAlerts: (moduleId: string, enabled: boolean) => void;
}

// Alert Manager Context Types
export interface AlertManagerContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => string;
  removeAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  getAlertsByModule: (moduleId: string) => Alert[];
  getFilteredAlerts: () => Alert[];
  clearAllAlerts: () => void;
  panelExpanded: boolean;
  togglePanel: () => void;
}

// Routes for modules
export interface ModuleRoute {
  path: string;
  component: React.ComponentType;
}