import React from 'react';
import { render, act } from '@testing-library/react';
import { AlertContextProvider, useAlertContext } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import { AlertSeverity } from '../types';
import { BrowserRouter } from 'react-router-dom';

// Test component that uses the alert context
const AlertTester = () => {
  const alertContext = useAlertContext();
  
  return (
    <div>
      <div data-testid="alert-count">{alertContext.alerts.length}</div>
      <button 
        data-testid="add-alert" 
        onClick={() => 
          alertContext.addAlert({
            moduleId: 'test',
            title: 'Test Alert',
            message: 'This is a test alert',
            severity: AlertSeverity.INFO,
          })
        }
      >
        Add Alert
      </button>
      <button 
        data-testid="remove-first" 
        onClick={() => {
          if (alertContext.alerts.length > 0) {
            alertContext.removeAlert(alertContext.alerts[0].id);
          }
        }}
      >
        Remove First Alert
      </button>
      <button 
        data-testid="acknowledge-first" 
        onClick={() => {
          if (alertContext.alerts.length > 0) {
            alertContext.acknowledgeAlert(alertContext.alerts[0].id);
          }
        }}
      >
        Acknowledge First Alert
      </button>
      <button 
        data-testid="toggle-panel" 
        onClick={alertContext.togglePanel}
      >
        Toggle Panel
      </button>
      <div data-testid="panel-state">
        {alertContext.panelExpanded ? 'Expanded' : 'Collapsed'}
      </div>
      <button 
        data-testid="clear-all" 
        onClick={alertContext.clearAllAlerts}
      >
        Clear All
      </button>
    </div>
  );
};

describe('AlertContext', () => {
  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <CoreContextProvider>
          <AlertContextProvider>
            <AlertTester />
          </AlertContextProvider>
        </CoreContextProvider>
      </BrowserRouter>
    );
  };

  test('initial state has no alerts', () => {
    const { getByTestId } = renderWithProviders();
    expect(getByTestId('alert-count').textContent).toBe('0');
  });

  test('can add an alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-alert').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('1');
  });

  test('can remove an alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-alert').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('1');
    
    act(() => {
      getByTestId('remove-first').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('0');
  });

  test('can acknowledge an alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-alert').click();
    });
    
    act(() => {
      getByTestId('acknowledge-first').click();
    });
    
    // The alert should still exist, just be acknowledged
    expect(getByTestId('alert-count').textContent).toBe('1');
  });

  test('can toggle panel state', () => {
    const { getByTestId } = renderWithProviders();
    
    // Initial state should be collapsed
    expect(getByTestId('panel-state').textContent).toBe('Collapsed');
    
    act(() => {
      getByTestId('toggle-panel').click();
    });
    
    // Now should be expanded
    expect(getByTestId('panel-state').textContent).toBe('Expanded');
    
    act(() => {
      getByTestId('toggle-panel').click();
    });
    
    // Now should be collapsed again
    expect(getByTestId('panel-state').textContent).toBe('Collapsed');
  });

  test('can clear all alerts', () => {
    const { getByTestId } = renderWithProviders();
    
    // Add multiple alerts
    act(() => {
      getByTestId('add-alert').click();
      getByTestId('add-alert').click();
      getByTestId('add-alert').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('3');
    
    act(() => {
      getByTestId('clear-all').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('0');
  });
});