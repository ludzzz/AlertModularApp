import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TabBar from '../components/TabBar';
import { CoreContextProvider, useCoreContext } from '../core/CoreContext';
import { ModuleDefinition } from '../types';

// Mock module to test with
const mockModule: ModuleDefinition = {
  id: 'test-module',
  name: 'Test Module',
  description: 'Test module for TabBar testing',
  menuItems: [],
  component: () => <div>Test</div>,
  alertsEnabled: true
};

// Wrapper component to set up the mock module in context
const TabBarTestWrapper = ({ onTabChange }: { onTabChange: (moduleId: string) => void }) => {
  const { registerModule, modules } = useCoreContext();
  
  React.useEffect(() => {
    // Only register if not already registered
    if (!modules.some(m => m.id === mockModule.id)) {
      registerModule(mockModule);
    }
  }, [registerModule, modules]);
  
  return <TabBar onTabChange={onTabChange} />;
};

describe('TabBar Component', () => {
  const mockTabChange = jest.fn();
  
  it('renders modules with toggle switches', () => {
    render(
      <CoreContextProvider>
        <TabBarTestWrapper onTabChange={mockTabChange} />
      </CoreContextProvider>
    );
    
    // Check if the module name is displayed
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    
    // Check if the toggle switch exists
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeInTheDocument();
    expect(toggleSwitch).toBeChecked();
  });
  
  it('handles tab change when clicked', () => {
    render(
      <CoreContextProvider>
        <TabBarTestWrapper onTabChange={mockTabChange} />
      </CoreContextProvider>
    );
    
    // Click on the tab
    const tab = screen.getByText('Test Module').closest('div[role="button"]') || 
                screen.getByText('Test Module').parentElement?.parentElement;
    fireEvent.click(tab!);
    
    // Verify the callback was called with the correct module ID
    expect(mockTabChange).toHaveBeenCalledWith('test-module');
  });
  
  it('toggles alerts when switch is clicked', () => {
    render(
      <CoreContextProvider>
        <TabBarTestWrapper onTabChange={mockTabChange} />
      </CoreContextProvider>
    );
    
    // Get the toggle switch input
    const toggleSwitchInput = screen.getByRole('checkbox');
    expect(toggleSwitchInput).toBeChecked();
    
    // Click the toggle switch input directly
    fireEvent.click(toggleSwitchInput);
    
    // Verify the switch state has changed
    expect(toggleSwitchInput).not.toBeChecked();
  });
  
  it('toggles alerts when switch slider is clicked', () => {
    render(
      <CoreContextProvider>
        <TabBarTestWrapper onTabChange={mockTabChange} />
      </CoreContextProvider>
    );
    
    // Get the toggle switch input and slider
    const toggleSwitchInput = screen.getByRole('checkbox');
    expect(toggleSwitchInput).toBeChecked();
    
    // The slider is a span that's a sibling of the input
    const toggleSlider = toggleSwitchInput.nextElementSibling;
    expect(toggleSlider).not.toBeNull();
    
    // Click the toggle slider
    fireEvent.click(toggleSlider!);
    
    // Verify the switch state has changed
    expect(toggleSwitchInput).not.toBeChecked();
  });
});