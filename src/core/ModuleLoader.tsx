import React, { useEffect, useRef, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useCoreContext, CoreModuleDefinition } from './CoreContext';
import ModuleErrorBoundary from '../components/ModuleErrorBoundary';
import { useAlertContext } from './AlertContext';
import { AlertSeverity, AlertCategory } from '../types';
import { ModuleDefinition } from '../types';

// Import core module
import CoreModule from './CoreModule';

// Import available modules
import NetworkModule, { routes as networkRoutes } from '../modules/NetworkModule';
import ServerModule, { routes as serverRoutes } from '../modules/ServerModule';

// Add module loaded tracking to window to persist across StrictMode remounts
declare global {
  interface Window {
    ___loadedModules?: Set<string>;
  }
}

const ModuleLoader: React.FC = () => {
  const { registerModule } = useCoreContext();
  const { addAlert } = useAlertContext();
  const modulesLoadedRef = useRef<Set<string>>(new Set());
  
  // Use a ref to persist loaded state across renders and StrictMode unmounts/remounts
  const loadModule = useCallback((module: ModuleDefinition) => {
    // Skip if already loaded - check window property to persist across StrictMode remounts
    const loadedModulesKey = '___loadedModules';
    if (!window[loadedModulesKey]) {
      window[loadedModulesKey] = new Set<string>();
    }
    
    // Skip if already loaded (using window property for persistence)
    if (window[loadedModulesKey].has(module.id)) {
      return;
    }
    
    try {
      registerModule(module);
      modulesLoadedRef.current.add(module.id);
      window[loadedModulesKey].add(module.id);
      
      // Only add the success alert if it's not the core module
      if (module.id !== 'core') {
        addAlert({
          moduleId: 'core',
          title: 'Module Loaded',
          message: `Successfully loaded module: ${module.name}`,
          severity: AlertSeverity.INFO,
          category: AlertCategory.SYSTEM,
          source: 'internal',
        });
      }
    } catch (error) {
      console.error(`Failed to load ${module.name} module:`, error);
      addAlert({
        moduleId: 'core',
        title: 'Module Load Failed',
        message: `Failed to load module: ${module.name}. Error: ${error instanceof Error ? error.message : String(error)}`,
        severity: AlertSeverity.ERROR,
        category: AlertCategory.SYSTEM,
        source: 'internal',
      });
    }
  }, [registerModule, addAlert]);
  
  useEffect(() => {
    // Register the core module first using the definition from CoreContext
    loadModule(CoreModuleDefinition);
    
    // Register other modules
    loadModule(NetworkModule);
    loadModule(ServerModule);
    
    // No cleanup needed - we want the loaded state to persist
    // across StrictMode unmounts/remounts
  }, [loadModule]);
  
  return (
    <Routes>
      {/* Core routes */}
      <Route path="/" element={
        <ModuleErrorBoundary moduleId="core" moduleName="Dashboard">
          <CoreModule />
        </ModuleErrorBoundary>
      } />
      
      <Route path="/settings" element={
        <ModuleErrorBoundary moduleId="core" moduleName="Settings">
          <CoreModule initialTab="settings" />
        </ModuleErrorBoundary>
      } />
      
      {/* Network module routes */}
      {networkRoutes.map(route => (
        <Route 
          key={route.path} 
          path={route.path} 
          element={
            <ModuleErrorBoundary moduleId="network" moduleName="Network Monitoring">
              <route.component />
            </ModuleErrorBoundary>
          } 
        />
      ))}
      
      {/* Server module routes */}
      {serverRoutes.map(route => (
        <Route 
          key={route.path} 
          path={route.path} 
          element={
            <ModuleErrorBoundary moduleId="server" moduleName="Server Monitoring">
              <route.component />
            </ModuleErrorBoundary>
          } 
        />
      ))}
      
      {/* Fallback route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export default ModuleLoader;