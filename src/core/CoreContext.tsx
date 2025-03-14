import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CoreContextType, ModuleDefinition, Connector } from '../types';
import CoreModule from './CoreModule';

// Define the core module definition outside of ModuleLoader
export const CoreModuleDefinition: ModuleDefinition = {
  id: 'core',
  name: 'Dashboard',
  description: 'Core dashboard module',
  menuItems: [
    {
      id: 'core-dashboard',
      label: 'Dashboard',
      path: '/',
      icon: '📊'
    },
    {
      id: 'core-settings',
      label: 'Settings',
      path: '/settings',
      icon: '⚙️'
    }
  ],
  component: CoreModule,
  alertsEnabled: true
};

// Create the core context with default values
const CoreContext = createContext<CoreContextType>({
  modules: [],
  registerModule: () => {},
  unregisterModule: () => {},
  currentModuleId: null,
  setCurrentModuleId: () => {},
  getModuleById: () => undefined,
  toggleModuleAlerts: () => {},
  // Connector-related properties
  connectors: [],
  registerConnector: () => {},
  unregisterConnector: () => {},
  getConnectorsByType: () => [],
  toggleConnector: () => {},
});

// Custom hook for using the CoreContext
export const useCoreContext = () => useContext(CoreContext);

interface CoreContextProviderProps {
  children: ReactNode;
}

// Provider component
export const CoreContextProvider: React.FC<CoreContextProviderProps> = ({ children }) => {
  const [modules, setModules] = useState<ModuleDefinition[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // Register a new module
  const registerModule = (module: ModuleDefinition) => {
    setModules((prevModules) => {
      // Check if module with this ID already exists
      if (prevModules.some((m) => m.id === module.id)) {
        console.warn(`Module with ID ${module.id} is already registered. Skipping.`);
        return prevModules;
      }
      return [...prevModules, module];
    });
  };

  // Unregister a module by ID
  const unregisterModule = (moduleId: string) => {
    setModules((prevModules) => prevModules.filter((module) => module.id !== moduleId));
  };

  // Get a module by ID
  const getModuleById = (id: string) => {
    return modules.find((module) => module.id === id);
  };

  // Toggle alerts for a specific module
  const toggleModuleAlerts = (moduleId: string, enabled: boolean) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId ? { ...module, alertsEnabled: enabled } : module
      )
    );
  };

  // Set current module to first module when modules change and no current module is set
  useEffect(() => {
    if (modules.length > 0 && currentModuleId === null) {
      setCurrentModuleId(modules[0].id);
    }
  }, [modules, currentModuleId]);

  // Add connector state
  const [connectors, setConnectors] = useState<Connector[]>([]);

  // Register a connector
  const registerConnector = (connector: Connector) => {
    setConnectors(prevConnectors => {
      if (prevConnectors.some(c => c.id === connector.id)) {
        return prevConnectors;
      }
      return [...prevConnectors, connector];
    });
  };

  // Unregister a connector
  const unregisterConnector = (connectorId: string) => {
    setConnectors(prevConnectors => prevConnectors.filter(c => c.id !== connectorId));
  };

  // Get connectors by type
  const getConnectorsByType = (type: string) => {
    return connectors.filter(c => c.type === type);
  };

  // Toggle connector enabled state
  const toggleConnector = (connectorId: string, enabled: boolean) => {
    setConnectors(prevConnectors => 
      prevConnectors.map(c => c.id === connectorId ? { ...c, enabled } : c)
    );
  };

  const value: CoreContextType = {
    modules,
    registerModule,
    unregisterModule,
    currentModuleId,
    setCurrentModuleId,
    getModuleById,
    toggleModuleAlerts,
    // Connector-related properties
    connectors,
    registerConnector,
    unregisterConnector,
    getConnectorsByType,
    toggleConnector,
  };

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};