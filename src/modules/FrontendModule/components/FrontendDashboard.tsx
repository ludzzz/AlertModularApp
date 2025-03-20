import React, { useState } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../../core/AlertContext';
import { AlertSeverity, AlertCategory } from '../../../types';

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

const ServiceList = styled.div`
  margin-top: 20px;
`;

const ServiceItem = styled.div<{ status: 'healthy' | 'warning' | 'critical' | 'unknown' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'healthy':
        return '#e8f5e9';
      case 'warning':
        return '#fff3e0';
      case 'critical':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
`;

const ServiceName = styled.span`
  font-weight: 500;
`;

const StatusIndicator = styled.span<{ status: 'healthy' | 'warning' | 'critical' | 'unknown' }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'healthy':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'critical':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  }};
`;

const StatusText = styled.span`
  font-size: 0.9rem;
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

interface FrontendService {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  type: string;
  version: string;
  url: string;
  lastUpdated: Date;
}

const FrontendDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();

  // Mock frontend services data
  const [services] = useState<FrontendService[]>([
    {
      id: 'web-portal',
      name: 'Main Web Portal',
      status: 'healthy',
      type: 'React Application',
      version: '2.5.0',
      url: 'https://portal.example.com',
      lastUpdated: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    },
    {
      id: 'customer-dashboard',
      name: 'Customer Dashboard',
      status: 'warning',
      type: 'Angular Application',
      version: '4.2.1',
      url: 'https://dashboard.example.com',
      lastUpdated: new Date(Date.now() - 12 * 60000) // 12 minutes ago
    },
    {
      id: 'reporting-ui',
      name: 'Reporting UI',
      status: 'healthy',
      type: 'Vue Application',
      version: '1.8.3',
      url: 'https://reports.example.com',
      lastUpdated: new Date(Date.now() - 8 * 60000) // 8 minutes ago
    },
    {
      id: 'admin-console',
      name: 'Admin Console',
      status: 'critical',
      type: 'React Application',
      version: '3.0.0',
      url: 'https://admin.example.com',
      lastUpdated: new Date(Date.now() - 3 * 60000) // 3 minutes ago
    }
  ]);

  // Function to generate a test alert
  const generateTestAlert = () => {
    const service = services[Math.floor(Math.random() * services.length)];
    const isError = Math.random() > 0.6;
    
    addAlert({
      moduleId: 'frontend',
      title: isError ? `${service.name} Error Detected` : `${service.name} Performance Warning`,
      message: isError 
        ? `The ${service.name} service is experiencing errors. Users may be affected.` 
        : `Slow response times detected in ${service.name}. Average time: 2.5s`,
      severity: isError ? AlertSeverity.ERROR : AlertSeverity.WARNING,
      category: isError ? AlertCategory.APPLICATION : AlertCategory.PERFORMANCE,
      source: 'frontend-monitor',
      entity: {
        id: service.id,
        type: 'frontend-service',
        name: service.name
      },
      tags: ['frontend', service.type.toLowerCase(), isError ? 'error' : 'performance']
    });
  };

  return (
    <Container>
      <Header>Frontend Services Dashboard</Header>
      
      <DashboardGrid>
        <Card>
          <CardTitle>Service Status</CardTitle>
          <ServiceList>
            {services.map(service => (
              <ServiceItem key={service.id} status={service.status}>
                <ServiceName>{service.name}</ServiceName>
                <StatusText>
                  <StatusIndicator status={service.status} />
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </StatusText>
              </ServiceItem>
            ))}
          </ServiceList>
        </Card>
        
        <Card>
          <CardTitle>Service Information</CardTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px' }}>Service</th>
                <th style={{ textAlign: 'left', padding: '8px 4px' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px 4px' }}>Version</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td style={{ padding: '8px 4px' }}>{service.name}</td>
                  <td style={{ padding: '8px 4px' }}>{service.type}</td>
                  <td style={{ padding: '8px 4px' }}>{service.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </DashboardGrid>
      
      <ButtonsContainer>
        <Button onClick={generateTestAlert}>Generate Test Alert</Button>
      </ButtonsContainer>
    </Container>
  );
};

export default FrontendDashboard;