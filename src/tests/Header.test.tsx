import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';
import { AlertContextProvider } from '../core/AlertContext';
import { CoreContextProvider } from '../core/CoreContext';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <CoreContextProvider>
          <AlertContextProvider>
            <Header />
          </AlertContextProvider>
        </CoreContextProvider>
      </BrowserRouter>
    );
  };

  test('renders the header with title', () => {
    renderWithProviders();
    expect(screen.getByText('Alert Modular System')).toBeInTheDocument();
  });

  test('displays alert indicator with count 0 when no alerts', () => {
    renderWithProviders();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('toggles alert panel when clicking the indicator', () => {
    renderWithProviders();
    const alertIndicator = screen.getByText('Show Alerts');
    
    fireEvent.click(alertIndicator);
    expect(screen.getByText('Hide Alerts')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Hide Alerts'));
    expect(screen.getByText('Show Alerts')).toBeInTheDocument();
  });
});