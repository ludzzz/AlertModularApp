import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { AlertSeverity, AlertCategory } from '../../types';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MetricTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1rem;
  color: #666;
`;

const MetricValue = styled.div<{ status?: 'normal' | 'warning' | 'critical' }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ status }) => {
    switch (status) {
      case 'warning':
        return '#ff9800';
      case 'critical':
        return '#f44336';
      default:
        return '#333';
    }
  }};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ServerDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    activeServers: 8,
    alertsToday: 12
  });
  
  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(10, Math.min(95, prev.cpuUsage + (Math.random() > 0.5 ? 3 : -3))),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() > 0.5 ? 2 : -2))),
        diskUsage: Math.max(50, Math.min(95, prev.diskUsage + (Math.random() > 0.7 ? 1 : -0.5))),
        activeServers: prev.activeServers,
        alertsToday: prev.alertsToday + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateInfoAlert = () => {
    addAlert({
      moduleId: 'server',
      title: 'Server backup completed',
      message: 'Weekly backup process completed successfully for all servers.',
      severity: AlertSeverity.INFO,
      category: AlertCategory.SYSTEM,
      source: 'internal',
    });
  };
  
  const generateWarningAlert = () => {
    addAlert({
      moduleId: 'server',
      title: 'High memory usage',
      message: `Server APP-01 memory usage is at ${metrics.memoryUsage}%, which is approaching critical levels.`,
      severity: AlertSeverity.WARNING,
      category: AlertCategory.PERFORMANCE,
      source: 'internal',
      entity: {
        id: 'APP-01',
        type: 'server',
        name: 'Application Server 01'
      },
      tags: ['memory', 'performance']
    });
  };
  
  const generateErrorAlert = () => {
    addAlert({
      moduleId: 'server',
      title: 'Disk space low',
      message: `Server DB-02 disk usage is at ${metrics.diskUsage}%. Please clean up unnecessary files.`,
      severity: AlertSeverity.ERROR,
      category: AlertCategory.SYSTEM,
      source: 'internal',
      entity: {
        id: 'DB-02',
        type: 'database',
        name: 'Database Server 02'
      },
      tags: ['disk', 'storage']
    });
  };
  
  const generateCriticalAlert = () => {
    addAlert({
      moduleId: 'server',
      title: 'Server unresponsive',
      message: 'Server WEB-03 is not responding to health checks. Immediate attention required.',
      severity: AlertSeverity.CRITICAL,
      category: AlertCategory.SYSTEM,
      source: 'internal',
      entity: {
        id: 'WEB-03',
        type: 'webserver',
        name: 'Web Server 03'
      },
      tags: ['connectivity', 'unresponsive']
    });
  };
  
  return (
    <DashboardContainer>
      <Header>Server Dashboard</Header>
      
      <MetricsGrid>
        <MetricCard>
          <MetricTitle>CPU Usage (Average)</MetricTitle>
          <MetricValue status={metrics.cpuUsage > 80 ? 'critical' : metrics.cpuUsage > 70 ? 'warning' : 'normal'}>
            {metrics.cpuUsage}%
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Memory Usage (Average)</MetricTitle>
          <MetricValue status={metrics.memoryUsage > 80 ? 'critical' : metrics.memoryUsage > 70 ? 'warning' : 'normal'}>
            {metrics.memoryUsage}%
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Disk Usage (Average)</MetricTitle>
          <MetricValue status={metrics.diskUsage > 85 ? 'critical' : metrics.diskUsage > 75 ? 'warning' : 'normal'}>
            {metrics.diskUsage}%
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Active Servers</MetricTitle>
          <MetricValue>
            {metrics.activeServers}/10
          </MetricValue>
        </MetricCard>
      </MetricsGrid>
      
      <ButtonContainer>
        <Button onClick={generateInfoAlert}>Generate Info Alert</Button>
        <Button onClick={generateWarningAlert}>Generate Warning Alert</Button>
        <Button onClick={generateErrorAlert}>Generate Error Alert</Button>
        <Button onClick={generateCriticalAlert}>Generate Critical Alert</Button>
      </ButtonContainer>
    </DashboardContainer>
  );
};

export default ServerDashboard;