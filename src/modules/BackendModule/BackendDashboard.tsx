import React, { useState } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { AlertSeverity, AlertCategory } from '../../types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ isWarning?: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.isWarning ? '#f44336' : 'inherit'};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
`;

const ServiceList = styled.div`
  margin-top: 15px;
`;

const ServiceItem = styled.div<{ status: 'up' | 'down' | 'degraded' | 'maintenance' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'up':
        return '#e8f5e9';
      case 'down':
        return '#ffebee';
      case 'degraded':
        return '#fff3e0';
      case 'maintenance':
        return '#e3f2fd';
      default:
        return '#f5f5f5';
    }
  }};
`;

const ServiceName = styled.span`
  font-weight: 500;
`;

const StatusIndicator = styled.span<{ status: 'up' | 'down' | 'degraded' | 'maintenance' }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'up':
        return '#4caf50';
      case 'down':
        return '#f44336';
      case 'degraded':
        return '#ff9800';
      case 'maintenance':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  }};
`;

const StatusText = styled.span`
  font-size: 0.9rem;
`;

const ProgressContainer = styled.div`
  margin-top: 15px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; color: string }>`
  height: 100%;
  width: ${props => `${props.percent}%`};
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #1976d2;
  }
`;

interface BackendService {
  id: string;
  name: string;
  status: 'up' | 'down' | 'degraded' | 'maintenance';
  type: string;
  cpu: number;
  memory: number;
  responseTime: number;
  lastUpdated: Date;
}

const BackendDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();

  // Mock backend services data
  const [services] = useState<BackendService[]>([
    {
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'up',
      type: 'API Service',
      cpu: 35,
      memory: 42,
      responseTime: 120,
      lastUpdated: new Date(Date.now() - 2 * 60000) // 2 minutes ago
    },
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'up',
      type: 'Microservice',
      cpu: 28,
      memory: 35,
      responseTime: 85,
      lastUpdated: new Date(Date.now() - 3 * 60000) // 3 minutes ago
    },
    {
      id: 'data-processor',
      name: 'Data Processor',
      status: 'degraded',
      type: 'Worker Service',
      cpu: 78,
      memory: 82,
      responseTime: 430,
      lastUpdated: new Date(Date.now() - 1 * 60000) // 1 minute ago
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      status: 'maintenance',
      type: 'Microservice',
      cpu: 5,
      memory: 30,
      responseTime: 0,
      lastUpdated: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      status: 'up',
      type: 'Microservice',
      cpu: 42,
      memory: 45,
      responseTime: 110,
      lastUpdated: new Date(Date.now() - 4 * 60000) // 4 minutes ago
    },
    {
      id: 'analytics-engine',
      name: 'Analytics Engine',
      status: 'down',
      type: 'Processing Service',
      cpu: 0,
      memory: 0,
      responseTime: 0,
      lastUpdated: new Date(Date.now() - 15 * 60000) // 15 minutes ago
    }
  ]);

  // Calculate system stats
  const systemStats = {
    servicesUp: services.filter(s => s.status === 'up').length,
    servicesDegraded: services.filter(s => s.status === 'degraded').length,
    servicesDown: services.filter(s => s.status === 'down').length,
    servicesMaintenance: services.filter(s => s.status === 'maintenance').length,
    avgCpu: Math.round(
      services
        .filter(s => s.status !== 'down' && s.status !== 'maintenance')
        .reduce((acc, s) => acc + s.cpu, 0) / 
      services.filter(s => s.status !== 'down' && s.status !== 'maintenance').length
    ),
    avgMemory: Math.round(
      services
        .filter(s => s.status !== 'down' && s.status !== 'maintenance')
        .reduce((acc, s) => acc + s.memory, 0) / 
      services.filter(s => s.status !== 'down' && s.status !== 'maintenance').length
    ),
    avgResponseTime: Math.round(
      services
        .filter(s => s.status !== 'down' && s.status !== 'maintenance')
        .reduce((acc, s) => acc + s.responseTime, 0) / 
      services.filter(s => s.status !== 'down' && s.status !== 'maintenance').length
    )
  };

  // Function to generate a test alert
  const generateTestAlert = () => {
    const service = services[Math.floor(Math.random() * services.length)];
    
    // Choose alert type based on service status
    let alertType: 'status' | 'performance' | 'error' = 'performance';
    if (service.status === 'down') {
      alertType = 'status';
    } else if (service.status === 'degraded') {
      alertType = Math.random() > 0.5 ? 'performance' : 'error';
    } else if (service.cpu > 70 || service.memory > 80) {
      alertType = 'performance';
    } else {
      alertType = Math.random() > 0.7 ? 'error' : 'performance';
    }
    
    switch (alertType) {
      case 'status':
        addAlert({
          moduleId: 'backend',
          title: `${service.name} Service Down`,
          message: `The ${service.name} service is currently unreachable. Engineers have been notified.`,
          severity: AlertSeverity.CRITICAL,
          category: AlertCategory.SYSTEM,
          source: 'backend-monitor',
          entity: {
            id: service.id,
            type: 'backend-service',
            name: service.name
          },
          tags: ['backend', 'service-down', service.type.toLowerCase().replace(/\s+/g, '-')]
        });
        break;
      
      case 'performance':
        const isHighCpu = service.cpu > 70;
        const isHighMemory = service.memory > 80;
        // isHighLatency is currently unused, but kept for future use
        // const isHighLatency = service.responseTime > 300;
        
        let performanceIssue = isHighCpu ? 'CPU' : isHighMemory ? 'Memory' : 'Response time';
        let performanceValue = isHighCpu ? `${service.cpu}%` : isHighMemory ? `${service.memory}%` : `${service.responseTime}ms`;
        
        addAlert({
          moduleId: 'backend',
          title: `${service.name} ${performanceIssue} Alert`,
          message: `${service.name} is experiencing high ${performanceIssue.toLowerCase()}: ${performanceValue}`,
          severity: isHighCpu || isHighMemory ? AlertSeverity.WARNING : AlertSeverity.INFO,
          category: AlertCategory.PERFORMANCE,
          source: 'backend-monitor',
          entity: {
            id: service.id,
            type: 'backend-service',
            name: service.name
          },
          tags: ['backend', 'performance', performanceIssue.toLowerCase()]
        });
        break;
      
      case 'error':
        addAlert({
          moduleId: 'backend',
          title: `${service.name} Error Detected`,
          message: `Error rate increased in ${service.name}. Current error rate: ${Math.floor(Math.random() * 5 + 2)}%.`,
          severity: AlertSeverity.ERROR,
          category: AlertCategory.APPLICATION,
          source: 'backend-monitor',
          entity: {
            id: service.id,
            type: 'backend-service',
            name: service.name
          },
          tags: ['backend', 'error', service.type.toLowerCase().replace(/\s+/g, '-')]
        });
        break;
    }
  };

  const formatDuration = (ms: number): string => {
    if (ms === 0) return 'N/A';
    return `${ms}ms`;
  };

  const getStatusText = (status: 'up' | 'down' | 'degraded' | 'maintenance'): string => {
    switch (status) {
      case 'up': return 'Online';
      case 'down': return 'Offline';
      case 'degraded': return 'Degraded';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  return (
    <Container>
      <Header>Backend Services Dashboard</Header>
      
      <DashboardGrid>
        <Card>
          <CardTitle>System Status</CardTitle>
          <StatGrid>
            <StatItem>
              <StatValue>{systemStats.servicesUp}</StatValue>
              <StatLabel>Services Online</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue isWarning={systemStats.servicesDown > 0}>{systemStats.servicesDown}</StatValue>
              <StatLabel>Services Offline</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue isWarning={systemStats.servicesDegraded > 0}>{systemStats.servicesDegraded}</StatValue>
              <StatLabel>Services Degraded</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{systemStats.servicesMaintenance}</StatValue>
              <StatLabel>In Maintenance</StatLabel>
            </StatItem>
          </StatGrid>
          <ProgressContainer>
            <ProgressLabel>
              <span>System Health</span>
              <span>{Math.round((systemStats.servicesUp / services.length) * 100)}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                percent={(systemStats.servicesUp / services.length) * 100} 
                color={systemStats.servicesDown > 0 ? '#f44336' : systemStats.servicesDegraded > 0 ? '#ff9800' : '#4caf50'}
              />
            </ProgressBar>
          </ProgressContainer>
        </Card>
        
        <Card>
          <CardTitle>Performance</CardTitle>
          <ProgressContainer>
            <ProgressLabel>
              <span>Avg CPU Usage</span>
              <span>{systemStats.avgCpu}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                percent={systemStats.avgCpu} 
                color={systemStats.avgCpu > 80 ? '#f44336' : systemStats.avgCpu > 60 ? '#ff9800' : '#4caf50'}
              />
            </ProgressBar>
          </ProgressContainer>
          <ProgressContainer>
            <ProgressLabel>
              <span>Avg Memory Usage</span>
              <span>{systemStats.avgMemory}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                percent={systemStats.avgMemory} 
                color={systemStats.avgMemory > 80 ? '#f44336' : systemStats.avgMemory > 60 ? '#ff9800' : '#4caf50'}
              />
            </ProgressBar>
          </ProgressContainer>
          <ProgressContainer>
            <ProgressLabel>
              <span>Avg Response Time</span>
              <span>{formatDuration(systemStats.avgResponseTime)}</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                percent={Math.min((systemStats.avgResponseTime / 500) * 100, 100)} 
                color={systemStats.avgResponseTime > 300 ? '#f44336' : systemStats.avgResponseTime > 200 ? '#ff9800' : '#4caf50'}
              />
            </ProgressBar>
          </ProgressContainer>
        </Card>
      </DashboardGrid>
      
      <Card>
        <CardTitle>Backend Services</CardTitle>
        <ServiceList>
          {services.map(service => (
            <ServiceItem key={service.id} status={service.status}>
              <ServiceName>{service.name}</ServiceName>
              <div>
                <StatusText>
                  <StatusIndicator status={service.status} />
                  {getStatusText(service.status)}
                </StatusText>
                {service.status !== 'down' && service.status !== 'maintenance' && (
                  <span style={{ marginLeft: '15px', fontSize: '0.9rem' }}>
                    {formatDuration(service.responseTime)}
                  </span>
                )}
              </div>
            </ServiceItem>
          ))}
        </ServiceList>
      </Card>
      
      <ButtonsContainer>
        <Button onClick={generateTestAlert}>Generate Test Alert</Button>
      </ButtonsContainer>
    </Container>
  );
};

export default BackendDashboard;