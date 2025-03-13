import React from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { Alert, AlertSeverity } from '../../types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlertItem = styled.div<{ severity: AlertSeverity }>`
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${({ severity }) => {
    switch (severity) {
      case AlertSeverity.INFO:
        return '#2196f3';
      case AlertSeverity.WARNING:
        return '#ff9800';
      case AlertSeverity.ERROR:
        return '#f44336';
      case AlertSeverity.CRITICAL:
        return '#d50000';
      default:
        return '#9e9e9e';
    }
  }};
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const AlertTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const SeverityBadge = styled.span<{ severity: AlertSeverity }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ severity }) => {
    switch (severity) {
      case AlertSeverity.INFO:
        return '#e3f2fd';
      case AlertSeverity.WARNING:
        return '#fff3e0';
      case AlertSeverity.ERROR:
        return '#ffebee';
      case AlertSeverity.CRITICAL:
        return '#ff8a80';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ severity }) => {
    switch (severity) {
      case AlertSeverity.INFO:
        return '#0d47a1';
      case AlertSeverity.WARNING:
        return '#e65100';
      case AlertSeverity.ERROR:
        return '#b71c1c';
      case AlertSeverity.CRITICAL:
        return '#d50000';
      default:
        return '#616161';
    }
  }};
`;

const AlertMessage = styled.p`
  margin: 0 0 10px 0;
`;

const AlertMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
`;

const AlertTime = styled.span``;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  color: #95a5a6;
`;

const NetworkAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert, removeAlert } = useAlertContext();
  const networkAlerts = alerts.filter(alert => alert.moduleId === 'network');
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <Container>
      <Header>Network Alerts</Header>
      
      <AlertsList>
        {networkAlerts.length > 0 ? (
          networkAlerts.map((alert: Alert) => (
            <AlertItem key={alert.id} severity={alert.severity}>
              <AlertHeader>
                <AlertTitle>{alert.title}</AlertTitle>
                <SeverityBadge severity={alert.severity}>
                  {alert.severity.toUpperCase()}
                </SeverityBadge>
              </AlertHeader>
              <AlertMessage>{alert.message}</AlertMessage>
              <AlertMeta>
                <AlertTime>Time: {formatDate(alert.timestamp)}</AlertTime>
                <span>Status: {alert.acknowledged ? 'Acknowledged' : 'New'}</span>
              </AlertMeta>
              <ActionButtons>
                {!alert.acknowledged && (
                  <Button onClick={() => acknowledgeAlert(alert.id)}>
                    Acknowledge
                  </Button>
                )}
                <Button onClick={() => removeAlert(alert.id)}>
                  Dismiss
                </Button>
              </ActionButtons>
            </AlertItem>
          ))
        ) : (
          <EmptyState>
            <h3>No network alerts</h3>
            <p>There are currently no alerts for the network module.</p>
          </EmptyState>
        )}
      </AlertsList>
    </Container>
  );
};

export default NetworkAlerts;