import React from 'react';
import { render, act } from '@testing-library/react';
import { AlertContextProvider, useAlertContext } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import { 
  AlertSeverity, 
  AlertCategory, 
  AlertStatus,
  PrometheusAlert
} from '../types';
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
            category: AlertCategory.SYSTEM,
            source: 'internal',
            tags: ['test']
          })
        }
      >
        Add Alert
      </button>
      <button 
        data-testid="add-third-party-alert" 
        onClick={() => {
          const prometheusAlert: PrometheusAlert = {
            source: 'prometheus',
            alertname: 'TestPrometheusAlert',
            instance: 'test-instance',
            job: 'test-job',
            severity: 'info',
            summary: 'Test summary',
            description: 'Test description',
            status: 'firing',
            startsAt: new Date().toISOString(),
            labels: {
              environment: 'test'
            }
          };
          
          alertContext.addThirdPartyAlert(prometheusAlert, 'test');
        }}
      >
        Add Third-Party Alert
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
        data-testid="resolve-first" 
        onClick={() => {
          if (alertContext.alerts.length > 0) {
            alertContext.resolveAlert(alertContext.alerts[0].id);
          }
        }}
      >
        Resolve First Alert
      </button>
      <button 
        data-testid="silence-first" 
        onClick={() => {
          if (alertContext.alerts.length > 0) {
            alertContext.silenceAlert(alertContext.alerts[0].id, 1000);
          }
        }}
      >
        Silence First Alert
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
      {alertContext.alerts.length > 0 && (
        <div data-testid="first-alert-status">
          {alertContext.alerts[0].status}
        </div>
      )}
      {alertContext.alerts.length > 0 && (
        <div data-testid="first-alert-source">
          {alertContext.alerts[0].source}
        </div>
      )}
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
    expect(getByTestId('first-alert-status').textContent).toBe(AlertStatus.ACTIVE);
    expect(getByTestId('first-alert-source').textContent).toBe('internal');
  });

  test('can add a third-party alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-third-party-alert').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('1');
    expect(getByTestId('first-alert-source').textContent).toBe('prometheus');
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
    expect(getByTestId('first-alert-status').textContent).toBe(AlertStatus.ACKNOWLEDGED);
  });

  test('can resolve an alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-alert').click();
    });
    
    act(() => {
      getByTestId('resolve-first').click();
    });
    
    // The alert should still exist, just be resolved
    expect(getByTestId('alert-count').textContent).toBe('1');
    expect(getByTestId('first-alert-status').textContent).toBe(AlertStatus.RESOLVED);
  });

  test('can silence an alert', () => {
    const { getByTestId } = renderWithProviders();
    
    act(() => {
      getByTestId('add-alert').click();
    });
    
    act(() => {
      getByTestId('silence-first').click();
    });
    
    // The alert should still exist, just be silenced
    expect(getByTestId('alert-count').textContent).toBe('1');
    expect(getByTestId('first-alert-status').textContent).toBe(AlertStatus.SILENCED);
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

  test('can clear all alerts and they do not come back', () => {
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
    
    // Verify sample alerts don't come back after clearing
    // We need to trigger a re-render to check
    act(() => {
      getByTestId('toggle-panel').click();
      getByTestId('toggle-panel').click();
    });
    
    expect(getByTestId('alert-count').textContent).toBe('0');
  });
});