import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCoreContext } from './CoreContext';
import { useAlertContext } from './AlertContext';
import { Alert, AlertSeverity } from '../types';
import ConnectorSettings from '../core/settings/ConnectorSettings';

const CoreModuleContainer = styled.div`
  padding: 20px;
`;

const ModuleTitle = styled.h2`
  margin-bottom: 20px;
`;

const AlertSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const AlertSummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModuleName = styled.h3`
  margin-bottom: 10px;
`;

const AlertStats = styled.div`
  display: flex;
  gap: 10px;
`;

const AlertCount = styled.div<{ severity: AlertSeverity | 'total' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: ${({ severity }) => {
    switch (severity) {
      case AlertSeverity.INFO:
        return '#e3f2fd';
      case AlertSeverity.WARNING:
        return '#fff3e0';
      case AlertSeverity.ERROR:
        return '#ffebee';
      case AlertSeverity.CRITICAL:
        return '#ff9e80';
      case 'total':
        return '#f5f5f5';
      default:
        return '#f5f5f5';
    }
  }};
  flex: 1;
`;

const CountNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CountLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const AllAlertsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AlertTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr<{ severity?: AlertSeverity; acknowledged?: boolean }>`
  border-bottom: 1px solid #eee;
  background-color: ${({ severity, acknowledged }) => {
    if (acknowledged) return '#f8f9fa';
    
    switch (severity) {
      case AlertSeverity.INFO:
        return '#e3f2fd30';
      case AlertSeverity.WARNING:
        return '#fff3e030';
      case AlertSeverity.ERROR:
        return '#ffebee30';
      case AlertSeverity.CRITICAL:
        return '#ff9e8030';
      default:
        return 'transparent';
    }
  }};
`;

const TableCell = styled.td`
  padding: 12px 10px;
`;

const TableHeaderCell = styled.th`
  padding: 12px 10px;
  text-align: left;
`;

const SeverityIndicator = styled.div<{ severity: AlertSeverity }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ severity }) => {
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
  margin-right: 8px;
  display: inline-block;
`;

// Add styles for the tab navigation


const TabContent = styled.div`
  margin-top: 20px;
`;

// Define the interface for component props
interface CoreModuleProps {
  initialTab?: 'dashboard' | 'settings';
}

const CoreModule: React.FC<CoreModuleProps> = ({ initialTab = 'dashboard' }) => {
  const { modules, registerConnector } = useCoreContext();
  const { alerts, acknowledgeAlert } = useAlertContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>(initialTab);
  
  // Set the active tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Group alerts by module
  const alertsByModule = modules.reduce((acc, module) => {
    acc[module.id] = alerts.filter(alert => alert.moduleId === module.id);
    return acc;
  }, {} as Record<string, Alert[]>);
  
  // Count alerts by severity for each module
  const alertCountsBySeverity = modules.reduce((acc, module) => {
    const moduleAlerts = alertsByModule[module.id] || [];
    
    acc[module.id] = {
      total: moduleAlerts.length,
      [AlertSeverity.INFO]: moduleAlerts.filter(alert => alert.severity === AlertSeverity.INFO).length,
      [AlertSeverity.WARNING]: moduleAlerts.filter(alert => alert.severity === AlertSeverity.WARNING).length,
      [AlertSeverity.ERROR]: moduleAlerts.filter(alert => alert.severity === AlertSeverity.ERROR).length,
      [AlertSeverity.CRITICAL]: moduleAlerts.filter(alert => alert.severity === AlertSeverity.CRITICAL).length,
    };
    
    return acc;
  }, {} as Record<string, Record<string, number>>);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  // Handle connector save
  const handleSaveConnector = (connector: any) => {
    registerConnector(connector);
  };
  
  return (
    <CoreModuleContainer>
      <ModuleTitle>
        {activeTab === 'dashboard' ? 'Alert Dashboard' : 'Settings'}
      </ModuleTitle>
      
      {/* <TabContainer>
        <TabButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </TabButton>
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </TabButton>
      </TabContainer> */}
      
      <TabContent>
        {activeTab === 'dashboard' ? (
          <>
            <AlertSummaryContainer>
              {modules.map(module => (
                <AlertSummaryCard key={module.id}>
                  <ModuleName>{module.name}</ModuleName>
                  <AlertStats>
                    <AlertCount severity="total">
                      <CountNumber>{alertCountsBySeverity[module.id]?.total || 0}</CountNumber>
                      <CountLabel>Total</CountLabel>
                    </AlertCount>
                    <AlertCount severity={AlertSeverity.CRITICAL}>
                      <CountNumber>{alertCountsBySeverity[module.id]?.[AlertSeverity.CRITICAL] || 0}</CountNumber>
                      <CountLabel>Critical</CountLabel>
                    </AlertCount>
                    <AlertCount severity={AlertSeverity.ERROR}>
                      <CountNumber>{alertCountsBySeverity[module.id]?.[AlertSeverity.ERROR] || 0}</CountNumber>
                      <CountLabel>Error</CountLabel>
                    </AlertCount>
                  </AlertStats>
                </AlertSummaryCard>
              ))}
            </AlertSummaryContainer>
            
            <AllAlertsContainer>
              <h3>All Alerts</h3>
              <AlertTable>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Severity</TableHeaderCell>
                    <TableHeaderCell>Module</TableHeaderCell>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Message</TableHeaderCell>
                    <TableHeaderCell>Time</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {alerts.length > 0 ? (
                    alerts.map(alert => (
                      <TableRow key={alert.id} severity={alert.severity} acknowledged={alert.acknowledged}>
                        <TableCell>
                          <SeverityIndicator severity={alert.severity} />
                          {alert.severity}
                        </TableCell>
                        <TableCell>{alert.moduleId}</TableCell>
                        <TableCell>{alert.title}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>{formatDate(alert.timestamp)}</TableCell>
                        <TableCell>
                          {alert.acknowledged ? (
                            'Acknowledged'
                          ) : (
                            <button onClick={() => acknowledgeAlert(alert.id)}>
                              Acknowledge
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                        No alerts to display
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
              </AlertTable>
            </AllAlertsContainer>
          </>
        ) : (
          <ConnectorSettings onSave={handleSaveConnector} />
        )}
      </TabContent>
    </CoreModuleContainer>
  );
};

export default CoreModule;