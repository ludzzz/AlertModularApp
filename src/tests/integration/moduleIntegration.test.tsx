import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { useAlertContext } from '../../core/AlertContext';
import { CoreContextProvider } from '../../core/CoreContext';
import { AlertContextProvider } from '../../core/AlertContext';
import { AlertSeverity } from '../../types';

// Create a simplified test for the alert functionality
describe('Alert Context Integration Tests', () => {
  test('alert system basic functionality', () => {
    // Create a simple test component that uses the context
    const TestComponent = () => {
      const { addAlert, alerts, acknowledgeAlert } = useAlertContext();
      
      return (
        <div>
          <button 
            data-testid="add-info-alert" 
            onClick={() => addAlert({
              moduleId: 'test',
              title: 'Test Info Alert',
              message: 'This is a test info alert',
              severity: AlertSeverity.INFO
            })}
          >
            Add Info Alert
          </button>
          <div data-testid="alert-count">{alerts.length}</div>
          {alerts.map(alert => (
            <div key={alert.id} data-testid={`alert-${alert.id}`}>
              <div data-testid={`alert-title-${alert.id}`}>{alert.title}</div>
              <div data-testid={`alert-message-${alert.id}`}>{alert.message}</div>
              <div data-testid={`alert-severity-${alert.id}`}>{alert.severity}</div>
              <button 
                data-testid={`acknowledge-${alert.id}`}
                onClick={() => acknowledgeAlert(alert.id)}
              >
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      );
    };
    
    // Render the test component with the required providers
    const { getByTestId } = render(
      <CoreContextProvider>
        <AlertContextProvider>
          <TestComponent />
        </AlertContextProvider>
      </CoreContextProvider>
    );
    
    // Initially there should be no alerts
    expect(getByTestId('alert-count').textContent).toBe('0');
    
    // Add an alert
    act(() => {
      getByTestId('add-info-alert').click();
    });
    
    // Now there should be one alert
    expect(getByTestId('alert-count').textContent).toBe('1');
    
    // Find all alert elements in the document
    const alertElements = document.querySelectorAll('[data-testid^="alert-"]');
    expect(alertElements.length).toBeGreaterThan(0);
    
    // Find an element with the title
    const titleElement = document.querySelector('[data-testid^="alert-title-"]');
    expect(titleElement).not.toBeNull();
    expect(titleElement?.textContent).toBe('Test Info Alert');
    
    // Find an element with the message
    const messageElement = document.querySelector('[data-testid^="alert-message-"]');
    expect(messageElement).not.toBeNull();
    expect(messageElement?.textContent).toBe('This is a test info alert');
    
    // Find an element with the severity
    const severityElement = document.querySelector('[data-testid^="alert-severity-"]');
    expect(severityElement).not.toBeNull();
    expect(severityElement?.textContent).toBe(AlertSeverity.INFO);
    
    // Find the acknowledge button
    const acknowledgeButton = document.querySelector('[data-testid^="acknowledge-"]');
    expect(acknowledgeButton).not.toBeNull();
    
    // Acknowledge the alert
    act(() => {
      if (acknowledgeButton) {
        acknowledgeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    
    // Alert should still be there, but acknowledged state would be updated
    expect(getByTestId('alert-count').textContent).toBe('1');
  });
});