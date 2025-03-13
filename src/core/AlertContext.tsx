import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertManagerContextType } from '../types';
import { useCoreContext } from './CoreContext';

// Create the alert context with default values
const AlertContext = createContext<AlertManagerContextType>({
  alerts: [],
  addAlert: () => '',
  removeAlert: () => {},
  acknowledgeAlert: () => {},
  getAlertsByModule: () => [],
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

  // Add a new alert
  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const id = uuidv4();
    const newAlert: Alert = {
      ...alertData,
      id,
      timestamp: new Date(),
      acknowledged: false,
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    return id;
  };

  // Remove an alert by ID
  const removeAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
  };

  // Acknowledge an alert by ID
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Get alerts by module ID
  const getAlertsByModule = (moduleId: string) => {
    return alerts.filter((alert) => alert.moduleId === moduleId);
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
  };

  // Toggle panel expansion
  const togglePanel = () => {
    setPanelExpanded((prev) => !prev);
  };

  const value: AlertManagerContextType = {
    alerts,
    addAlert,
    removeAlert,
    acknowledgeAlert,
    getAlertsByModule,
    getFilteredAlerts,
    clearAllAlerts,
    panelExpanded,
    togglePanel,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};