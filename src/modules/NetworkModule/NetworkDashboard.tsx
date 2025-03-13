import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { AlertSeverity } from '../../types';

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

const NetworkDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();
  const [metrics, setMetrics] = useState({
    bandwidth: 120,
    latency: 25,
    packetLoss: 0.5,
    connections: 423
  });
  
  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        bandwidth: Math.max(80, Math.min(150, prev.bandwidth + (Math.random() > 0.5 ? 5 : -5))),
        latency: Math.max(15, Math.min(100, prev.latency + (Math.random() > 0.5 ? 2 : -2))),
        packetLoss: Math.max(0, Math.min(5, prev.packetLoss + (Math.random() > 0.7 ? 0.2 : -0.1))),
        connections: Math.max(300, Math.min(600, prev.connections + (Math.random() > 0.5 ? 10 : -10)))
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateInfoAlert = () => {
    addAlert({
      moduleId: 'network',
      title: 'Network scan completed',
      message: 'Routine network scan completed successfully. No issues found.',
      severity: AlertSeverity.INFO,
    });
  };
  
  const generateWarningAlert = () => {
    addAlert({
      moduleId: 'network',
      title: 'High bandwidth usage detected',
      message: `Current bandwidth usage is at ${metrics.bandwidth} Mbps, which is above normal levels.`,
      severity: AlertSeverity.WARNING,
    });
  };
  
  const generateErrorAlert = () => {
    addAlert({
      moduleId: 'network',
      title: 'High latency detected',
      message: `Network latency is at ${metrics.latency} ms, which may affect application performance.`,
      severity: AlertSeverity.ERROR,
    });
  };
  
  const generateCriticalAlert = () => {
    addAlert({
      moduleId: 'network',
      title: 'Network device offline',
      message: 'Core router is not responding to ping requests. Immediate attention required.',
      severity: AlertSeverity.CRITICAL,
    });
  };
  
  return (
    <DashboardContainer>
      <Header>Network Dashboard</Header>
      
      <MetricsGrid>
        <MetricCard>
          <MetricTitle>Bandwidth Usage</MetricTitle>
          <MetricValue status={metrics.bandwidth > 140 ? 'warning' : 'normal'}>
            {metrics.bandwidth} Mbps
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Latency</MetricTitle>
          <MetricValue status={metrics.latency > 50 ? 'critical' : metrics.latency > 30 ? 'warning' : 'normal'}>
            {metrics.latency} ms
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Packet Loss</MetricTitle>
          <MetricValue status={metrics.packetLoss > 2 ? 'critical' : metrics.packetLoss > 1 ? 'warning' : 'normal'}>
            {metrics.packetLoss.toFixed(1)}%
          </MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Active Connections</MetricTitle>
          <MetricValue>
            {metrics.connections}
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

export default NetworkDashboard;