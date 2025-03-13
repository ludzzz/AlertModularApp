import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CoreContextType, ModuleDefinition } from '../types';

// Create the core context with default values
const CoreContext = createContext<CoreContextType>({
  modules: [],
  registerModule: () => {},
  unregisterModule: () => {},
  currentModuleId: null,
  setCurrentModuleId: () => {},
  getModuleById: () => undefined,
  toggleModuleAlerts: () => {},
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

  const value: CoreContextType = {
    modules,
    registerModule,
    unregisterModule,
    currentModuleId,
    setCurrentModuleId,
    getModuleById,
    toggleModuleAlerts,
  };

  return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>;
};