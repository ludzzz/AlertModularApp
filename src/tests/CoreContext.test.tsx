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
    expect(CoreModuleDefinition.menuItems).toHaveLength(1);
    expect(CoreModuleDefinition.menuItems[0]).toHaveProperty('id', 'core-dashboard');
    expect(CoreModuleDefinition.menuItems[0]).toHaveProperty('path', '/');
    expect(CoreModuleDefinition).toHaveProperty('component');
    expect(CoreModuleDefinition).toHaveProperty('alertsEnabled', true);
  });
});