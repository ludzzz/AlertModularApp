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

export enum AlertCategory {
  SYSTEM = 'system',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  APPLICATION = 'application',
  NETWORK = 'network',
  DATABASE = 'database',
  CUSTOM = 'custom',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SILENCED = 'silenced',
}

export interface Alert {
  id: string;
  moduleId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  status: AlertStatus;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  sourceId?: string;
  entity?: {
    id: string;
    type: string;
    name: string;
  };
  tags?: string[];
  metadata?: Record<string, any>;
  relatedAlerts?: string[];
}

// Base interface for third-party alerts
export interface ThirdPartyAlertBase {
  source: string;
  sourceId?: string;
}

// Sample third-party alert formats
export interface PrometheusAlert extends ThirdPartyAlertBase {
  source: 'prometheus';
  alertname: string;
  instance: string;
  job: string;
  severity: string;
  summary: string;
  description: string;
  status: 'firing' | 'resolved';
  startsAt: string;
  endsAt?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface NagiosAlert extends ThirdPartyAlertBase {
  source: 'nagios';
  host_name: string;
  service_description?: string;
  state: 'OK' | 'WARNING' | 'CRITICAL' | 'UNKNOWN';
  output: string;
  long_output?: string;
  timestamp: number;
  attempt?: number;
  notification_type?: string;
}

export interface ElasticsearchAlert extends ThirdPartyAlertBase {
  source: 'elasticsearch';
  id: string;
  name: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  message: string;
  details: Record<string, any>;
  index?: string;
  cluster?: string;
}

export interface CloudwatchAlert extends ThirdPartyAlertBase {
  source: 'cloudwatch';
  alarmName: string;
  state: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
  reason: string;
  timestamp: string;
  region: string;
  accountId: string;
  resources: string[];
  namespace?: string;
  metricName?: string;
  dimensions?: Record<string, string>;
}

export type ThirdPartyAlert = 
  | PrometheusAlert 
  | NagiosAlert 
  | ElasticsearchAlert 
  | CloudwatchAlert;

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
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged' | 'status'>) => string;
  addThirdPartyAlert: (alert: ThirdPartyAlert, moduleId: string) => string;
  removeAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  silenceAlert: (alertId: string, duration?: number) => void;
  updateAlert: (alertId: string, updateData: Partial<Omit<Alert, 'id'>>) => void;
  getAlertsByModule: (moduleId: string) => Alert[];
  getAlertsByCategory: (category: AlertCategory) => Alert[];
  getAlertsByStatus: (status: AlertStatus) => Alert[];
  getAlertsBySeverity: (severity: AlertSeverity) => Alert[];
  getAlertsByEntity: (entityId: string) => Alert[];
  getAlertsByTag: (tag: string) => Alert[];
  getAlertsBySource: (source: string) => Alert[];
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