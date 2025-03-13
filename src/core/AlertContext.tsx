import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertManagerContextType, AlertSeverity } from '../types';
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
  
  // Add some sample alerts for demonstration purposes, but only in non-test environments
  useEffect(() => {
    // Check if running in test environment
    const isTestEnv = process.env.NODE_ENV === 'test';
    
    // Only add sample alerts if not in test env and no alerts exist yet
    if (!isTestEnv && alerts.length === 0 && window.location.pathname !== '/test') {
      // Create the sample alerts only once when the app first loads
      const sampleAlerts = [
        {
          moduleId: 'network',
          title: 'Network scan completed',
          message: 'Routine network scan completed successfully. No issues found.',
          severity: AlertSeverity.INFO,
        },
        {
          moduleId: 'network',
          title: 'High bandwidth usage detected',
          message: 'Current bandwidth usage is at 145 Mbps, which is above normal levels.',
          severity: AlertSeverity.WARNING,
        },
        {
          moduleId: 'server',
          title: 'High CPU usage',
          message: 'Server DB-01 is experiencing high CPU usage (92%).',
          severity: AlertSeverity.ERROR,
        },
        {
          moduleId: 'server',
          title: 'Server offline',
          message: 'Web server WEB-03 is not responding to ping requests. Immediate attention required.',
          severity: AlertSeverity.CRITICAL,
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
  }, [alerts.length]);

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