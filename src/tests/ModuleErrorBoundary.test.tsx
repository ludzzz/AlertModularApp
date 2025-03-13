import React from 'react';
import { render, screen } from '@testing-library/react';
import ModuleErrorBoundary from '../components/ModuleErrorBoundary';

// Component that will throw an error
const ErrorComponent = () => {
  throw new Error('Test error');
  return <div>This should not render</div>;
};

// We need to silence console.error during these tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ModuleErrorBoundary', () => {
  test('renders children when no error occurs', () => {
    render(
      <ModuleErrorBoundary moduleId="test" moduleName="Test Module">
        <div>Test Content</div>
      </ModuleErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders error message when error occurs', () => {
    render(
      <ModuleErrorBoundary moduleId="error-module" moduleName="Error Module">
        <ErrorComponent />
      </ModuleErrorBoundary>
    );
    
    expect(screen.getByText(/Error in module: Error Module/)).toBeInTheDocument();
    expect(screen.getByText(/ID: error-module/)).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('calls onError when error occurs', () => {
    const mockOnError = jest.fn();
    
    render(
      <ModuleErrorBoundary 
        moduleId="error-module" 
        moduleName="Error Module"
        onError={mockOnError}
      >
        <ErrorComponent />
      </ModuleErrorBoundary>
    );
    
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), 'error-module');
  });
});