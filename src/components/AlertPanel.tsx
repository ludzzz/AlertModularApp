import React from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../core/AlertContext';
import { AlertSeverity } from '../types';

const PanelContainer = styled.div<{ expanded: boolean }>`
  position: fixed;
  top: 70px;
  right: ${({ expanded }) => (expanded ? '0' : '-420px')};
  width: ${({ expanded }) => (expanded ? '400px' : '80px')};
  height: calc(100vh - 70px);
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const AlertList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const AlertItem = styled.div<{ severity: AlertSeverity; acknowledged: boolean }>`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: ${({ severity, acknowledged }) => {
    if (acknowledged) return '#f8f9fa';
    
    switch (severity) {
      case AlertSeverity.INFO:
        return '#e3f2fd';
      case AlertSeverity.WARNING:
        return '#fff3e0';
      case AlertSeverity.ERROR:
        return '#ffebee';
      case AlertSeverity.CRITICAL:
        return '#ff9e80';
      default:
        return '#f5f5f5';
    }
  }};
  border-left: 4px solid ${({ severity, acknowledged }) => {
    if (acknowledged) return '#bdbdbd';
    
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
  opacity: ${({ acknowledged }) => (acknowledged ? 0.7 : 1)};
`;

const AlertTitle = styled.h4`
  margin: 0 0 5px 0;
  display: flex;
  justify-content: space-between;
`;

const AlertMessage = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const AlertMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
  color: #666;
`;

const AlertModule = styled.span``;

const AlertTime = styled.span``;

const MinimizedPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
`;

const MinimizedCount = styled.div<{ hasAlerts: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ hasAlerts }) => (hasAlerts ? '#e74c3c' : '#95a5a6')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: #95a5a6;
`;

const AlertPanel: React.FC = () => {
  const { panelExpanded, togglePanel, acknowledgeAlert, removeAlert, getFilteredAlerts } = useAlertContext();
  
  const filteredAlerts = getFilteredAlerts();
  const activeAlerts = filteredAlerts.filter(alert => !alert.acknowledged);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };
  
  if (!panelExpanded) {
    return (
      <PanelContainer expanded={false}>
        <MinimizedPanel>
          <MinimizedCount hasAlerts={activeAlerts.length > 0}>
            {activeAlerts.length}
          </MinimizedCount>
          <ActionButton onClick={togglePanel}>
            Show
          </ActionButton>
        </MinimizedPanel>
      </PanelContainer>
    );
  }
  
  return (
    <PanelContainer expanded={true}>
      <PanelHeader>
        <PanelTitle>Alerts ({activeAlerts.length})</PanelTitle>
        <ActionButton onClick={togglePanel}>Hide</ActionButton>
      </PanelHeader>
      
      <AlertList>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertItem 
              key={alert.id} 
              severity={alert.severity}
              acknowledged={alert.acknowledged}
              >
              <AlertTitle>
                {alert.title}
                <span>
                  <ActionButton onClick={(e) => {
                    e.stopPropagation();
                    acknowledgeAlert(alert.id);
                  }}>
                    {alert.acknowledged ? 'Acked' : 'Ack'}
                  </ActionButton>
                  {' '}
                  <ActionButton onClick={(e) => {
                    e.stopPropagation();
                    removeAlert(alert.id);
                  }}>
                    Dismiss
                  </ActionButton>
                </span>
              </AlertTitle>
              <AlertMessage>{alert.message}</AlertMessage>
              <AlertMeta>
                <AlertModule>Module: {alert.moduleId}</AlertModule>
                <AlertTime>{formatDate(alert.timestamp)}</AlertTime>
              </AlertMeta>
            </AlertItem>
          ))
        ) : (
          <EmptyState>
            <p>No alerts to display</p>
          </EmptyState>
        )}
      </AlertList>
    </PanelContainer>
  );
};

export default AlertPanel;