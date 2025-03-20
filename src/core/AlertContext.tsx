import React, { createContext, useState, useContext, ReactNode } from 'react';
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
  const { modules } = useCoreContext();
  
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