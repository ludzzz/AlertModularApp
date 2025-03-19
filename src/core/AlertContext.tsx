import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Alert, 
  AlertManagerContextType, 
  AlertSeverity, 
  AlertCategory, 
  AlertStatus,
  ThirdPartyAlert
} from '../types';
import { useCoreContext } from './CoreContext';
import { convertAlert } from '../utils/alertConverters';

// Create the alert context with default values
const AlertContext = createContext<AlertManagerContextType>({
  alerts: [],
  addAlert: () => '',
  addThirdPartyAlert: () => '',
  removeAlert: () => {},
  acknowledgeAlert: () => {},
  resolveAlert: () => {},
  silenceAlert: () => {},
  updateAlert: () => {},
  getAlertsByModule: () => [],
  getAlertsByCategory: () => [],
  getAlertsByStatus: () => [],
  getAlertsBySeverity: () => [],
  getAlertsByEntity: () => [],
  getAlertsByTag: () => [],
  getAlertsBySource: () => [],
  getFilteredAlerts: () => [],
  clearAllAlerts: () => {},
  panelExpanded: false,
  togglePanel: () => {},
});

// Custom hook for using the AlertContext
export const useAlertContext = () => useContext(AlertContext);

interface AlertContextProviderProps {
  children: ReactNode;
}

// Provider component
export const AlertContextProvider: React.FC<AlertContextProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [panelExpanded, setPanelExpanded] = useState<boolean>(false);
  const [sampleAlertsLoaded, setSampleAlertsLoaded] = useState<boolean>(false);
  const { modules } = useCoreContext();
  
  // Add some sample alerts for demonstration purposes, but only in non-test environments
  useEffect(() => {
    // Check if running in test environment
    const isTestEnv = process.env.NODE_ENV === 'test';
    
    // Only add sample alerts if not in test env, no alerts exist yet, and we haven't loaded sample alerts before
    if (!isTestEnv && alerts.length === 0 && !sampleAlertsLoaded && window.location.pathname !== '/test') {
      // Create the sample alerts only once when the app first loads
      setSampleAlertsLoaded(true);
      const sampleAlerts = [
        {
          moduleId: 'network',
          title: 'Network scan completed',
          message: 'Routine network scan completed successfully. No issues found.',
          severity: AlertSeverity.INFO,
          category: AlertCategory.NETWORK,
          status: AlertStatus.ACTIVE,
          source: 'internal',
        },
        {
          moduleId: 'network',
          title: 'High bandwidth usage detected',
          message: 'Current bandwidth usage is at 145 Mbps, which is above normal levels.',
          severity: AlertSeverity.WARNING,
          category: AlertCategory.PERFORMANCE,
          status: AlertStatus.ACTIVE,
          source: 'internal',
          entity: {
            id: 'router-01',
            type: 'network-device',
            name: 'Main Router'
          },
          tags: ['bandwidth', 'threshold-exceeded']
        },
        {
          moduleId: 'server',
          title: 'High CPU usage',
          message: 'Server DB-01 is experiencing high CPU usage (92%).',
          severity: AlertSeverity.ERROR,
          category: AlertCategory.PERFORMANCE,
          status: AlertStatus.ACTIVE,
          source: 'internal',
          entity: {
            id: 'db-01',
            type: 'server',
            name: 'Database Server 01'
          },
          tags: ['cpu', 'performance']
        },
        {
          moduleId: 'server',
          title: 'Server offline',
          message: 'Web server WEB-03 is not responding to ping requests. Immediate attention required.',
          severity: AlertSeverity.CRITICAL,
          category: AlertCategory.SYSTEM,
          status: AlertStatus.ACTIVE,
          source: 'internal',
          entity: {
            id: 'web-03',
            type: 'server',
            name: 'Web Server 03'
          },
          tags: ['connectivity', 'offline']
        }
      ];
      
      // Add all alerts at once to avoid multiple state updates
      setAlerts(sampleAlerts.map(alert => ({
        ...alert,
        id: uuidv4(),
        timestamp: new Date(),
        acknowledged: false
      })));
    }
  }, [alerts.length, sampleAlertsLoaded]);

  // Add a new alert with enhanced format
  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'acknowledged' | 'status'>) => {
    const id = uuidv4();
    const newAlert: Alert = {
      ...alertData,
      id,
      timestamp: new Date(),
      acknowledged: false,
      status: AlertStatus.ACTIVE,
      category: alertData.category || AlertCategory.SYSTEM,
      source: alertData.source || 'internal',
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    return id;
  };

  // Add a third-party alert by converting it to our internal format
  const addThirdPartyAlert = (thirdPartyAlert: ThirdPartyAlert, moduleId: string) => {
    try {
      const convertedAlert = convertAlert(thirdPartyAlert, { targetModuleId: moduleId });
      
      setAlerts((prevAlerts) => [...prevAlerts, convertedAlert]);
      return convertedAlert.id;
    } catch (error) {
      console.error('Failed to convert third-party alert:', error);
      
      // Add a fallback alert about the conversion failure
      return addAlert({
        moduleId: 'core',
        title: 'Alert conversion failed',
        message: `Failed to convert alert from source: ${thirdPartyAlert.source}. Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        severity: AlertSeverity.ERROR,
        category: AlertCategory.SYSTEM,
        source: 'internal',
        metadata: { originalAlert: thirdPartyAlert }
      });
    }
  };

  // Remove an alert by ID
  const removeAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
  };

  // Acknowledge an alert by ID
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { 
          ...alert, 
          acknowledged: true,
          status: AlertStatus.ACKNOWLEDGED
        } : alert
      )
    );
  };

  // Resolve an alert by ID
  const resolveAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { 
          ...alert, 
          status: AlertStatus.RESOLVED
        } : alert
      )
    );
  };

  // Silence an alert by ID
  const silenceAlert = (alertId: string, duration?: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => {
        if (alert.id === alertId) {
          const silencedAlert = { 
            ...alert, 
            status: AlertStatus.SILENCED
          };
          
          // If duration is provided, set a timeout to un-silence the alert
          if (duration) {
            setTimeout(() => {
              setAlerts((currentAlerts) =>
                currentAlerts.map((currentAlert) =>
                  currentAlert.id === alertId && currentAlert.status === AlertStatus.SILENCED
                    ? { ...currentAlert, status: AlertStatus.ACTIVE }
                    : currentAlert
                )
              );
            }, duration);
          }
          
          return silencedAlert;
        }
        return alert;
      })
    );
  };

  // Update an alert with new information
  const updateAlert = (alertId: string, updateData: Partial<Omit<Alert, 'id'>>) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, ...updateData } : alert
      )
    );
  };

  // Get alerts by module ID
  const getAlertsByModule = (moduleId: string) => {
    return alerts.filter((alert) => alert.moduleId === moduleId);
  };

  // Get alerts by category
  const getAlertsByCategory = (category: AlertCategory) => {
    return alerts.filter((alert) => alert.category === category);
  };

  // Get alerts by status
  const getAlertsByStatus = (status: AlertStatus) => {
    return alerts.filter((alert) => alert.status === status);
  };

  // Get alerts by severity
  const getAlertsBySeverity = (severity: AlertSeverity) => {
    return alerts.filter((alert) => alert.severity === severity);
  };

  // Get alerts by entity
  const getAlertsByEntity = (entityId: string) => {
    return alerts.filter((alert) => alert.entity?.id === entityId);
  };

  // Get alerts by tag
  const getAlertsByTag = (tag: string) => {
    return alerts.filter((alert) => alert.tags?.includes(tag));
  };

  // Get alerts by source
  const getAlertsBySource = (source: string) => {
    return alerts.filter((alert) => alert.source === source);
  };

  // Get filtered alerts based on module settings
  const getFilteredAlerts = () => {
    return alerts.filter((alert) => {
      const module = modules.find((m) => m.id === alert.moduleId);
      return module?.alertsEnabled !== false;
    });
  };

  // Clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
    // We don't reset sampleAlertsLoaded, so sample alerts won't be re-added
  };

  // Toggle panel expansion
  const togglePanel = () => {
    setPanelExpanded((prev) => !prev);
  };

  const value: AlertManagerContextType = {
    alerts,
    addAlert,
    addThirdPartyAlert,
    removeAlert,
    acknowledgeAlert,
    resolveAlert,
    silenceAlert,
    updateAlert,
    getAlertsByModule,
    getAlertsByCategory,
    getAlertsByStatus,
    getAlertsBySeverity,
    getAlertsByEntity,
    getAlertsByTag,
    getAlertsBySource,
    getFilteredAlerts,
    clearAllAlerts,
    panelExpanded,
    togglePanel,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};