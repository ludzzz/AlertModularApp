import React from 'react';
import { render, act } from '@testing-library/react';
import { CoreContextProvider, CoreModuleDefinition } from '../core/CoreContext';
import { BrowserRouter } from 'react-router-dom';

describe('CoreContext', () => {
  test('provider renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <CoreContextProvider>
          <div>Test content</div>
        </CoreContextProvider>
      </BrowserRouter>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('CoreModuleDefinition has correct properties', () => {
    expect(CoreModuleDefinition).toHaveProperty('id', 'core');
    expect(CoreModuleDefinition).toHaveProperty('name', 'Dashboard');
    expect(CoreModuleDefinition).toHaveProperty('description', 'Core dashboard module');
    expect(CoreModuleDefinition).toHaveProperty('menuItems');
    expect(CoreModuleDefinition.menuItems).toHaveLength(2); // Now we have 2 menu items
    
    // Test dashboard menu item
    const dashboardItem = CoreModuleDefinition.menuItems.find(item => item.id === 'core-dashboard');
    expect(dashboardItem).toBeDefined();
    expect(dashboardItem).toHaveProperty('path', '/');
    
    // Test settings menu item
    const settingsItem = CoreModuleDefinition.menuItems.find(item => item.id === 'core-settings');
    expect(settingsItem).toBeDefined();
    expect(settingsItem).toHaveProperty('path', '/settings');
    
    expect(CoreModuleDefinition).toHaveProperty('component');
    expect(CoreModuleDefinition).toHaveProperty('alertsEnabled', true);
  });
});