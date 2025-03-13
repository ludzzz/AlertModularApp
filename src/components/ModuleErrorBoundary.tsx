import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px 0;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
`;

const ErrorHeading = styled.h3`
  color: #c62828;
  margin-bottom: 10px;
`;

const ErrorDetails = styled.pre`
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
  font-size: 14px;
  border-radius: 4px;
`;

interface FallbackProps {
  error: Error;
  moduleId: string;
  moduleName: string;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  moduleId, 
  moduleName,
  resetErrorBoundary 
}) => {
  return (
    <ErrorContainer role="alert">
      <ErrorHeading>Error in module: {moduleName} (ID: {moduleId})</ErrorHeading>
      <p>Something went wrong with this module. The error has been isolated and the rest of the application is still functional.</p>
      <ErrorDetails>{error.message}</ErrorDetails>
      <button onClick={resetErrorBoundary}>Try to recover module</button>
    </ErrorContainer>
  );
};

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
  moduleId: string;
  moduleName: string;
  onError?: (error: Error, moduleId: string) => void;
}

const ModuleErrorBoundary: React.FC<ModuleErrorBoundaryProps> = ({
  children,
  moduleId,
  moduleName,
  onError,
}) => {
  const handleError = (error: Error) => {
    console.error(`Error in module ${moduleId} (${moduleName}):`, error);
    if (onError) {
      onError(error, moduleId);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback 
          error={error} 
          moduleId={moduleId} 
          moduleName={moduleName}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ModuleErrorBoundary;