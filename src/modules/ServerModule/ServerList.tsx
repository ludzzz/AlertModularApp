import React, { useState } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { AlertSeverity } from '../../types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const ServerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
`;

const TableCell = styled.td`
  padding: 15px;
`;

const StatusIndicator = styled.span<{ status: 'online' | 'offline' | 'warning' }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'online':
        return '#2ecc71';
      case 'warning':
        return '#f39c12';
      case 'offline':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

interface ServerData {
  id: string;
  name: string;
  ip: string;
  type: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  cpu: number;
  memory: number;
  disk: number;
}

const servers: ServerData[] = [
  {
    id: 'srv-001',
    name: 'WEB-01',
    ip: '192.168.1.10',
    type: 'Web Server',
    status: 'online',
    uptime: '45 days',
    cpu: 32,
    memory: 58,
    disk: 73
  },
  {
    id: 'srv-002',
    name: 'WEB-02',
    ip: '192.168.1.11',
    type: 'Web Server',
    status: 'online',
    uptime: '12 days',
    cpu: 45,
    memory: 62,
    disk: 68
  },
  {
    id: 'srv-003',
    name: 'DB-01',
    ip: '192.168.1.20',
    type: 'Database Server',
    status: 'warning',
    uptime: '30 days',
    cpu: 78,
    memory: 82,
    disk: 85
  },
  {
    id: 'srv-004',
    name: 'DB-02',
    ip: '192.168.1.21',
    type: 'Database Server',
    status: 'online',
    uptime: '60 days',
    cpu: 42,
    memory: 55,
    disk: 62
  },
  {
    id: 'srv-005',
    name: 'APP-01',
    ip: '192.168.1.30',
    type: 'Application Server',
    status: 'offline',
    uptime: '0 days',
    cpu: 0,
    memory: 0,
    disk: 72
  },
  {
    id: 'srv-006',
    name: 'APP-02',
    ip: '192.168.1.31',
    type: 'Application Server',
    status: 'online',
    uptime: '8 days',
    cpu: 35,
    memory: 48,
    disk: 55
  },
  {
    id: 'srv-007',
    name: 'CACHE-01',
    ip: '192.168.1.40',
    type: 'Cache Server',
    status: 'online',
    uptime: '15 days',
    cpu: 28,
    memory: 72,
    disk: 45
  },
  {
    id: 'srv-008',
    name: 'BACKUP-01',
    ip: '192.168.1.50',
    type: 'Backup Server',
    status: 'online',
    uptime: '21 days',
    cpu: 15,
    memory: 38,
    disk: 88
  }
];

const ServerList: React.FC = () => {
  const { addAlert } = useAlertContext();
  const [serverList, setServerList] = useState<ServerData[]>(servers);
  
  const handleRestartServer = (server: ServerData) => {
    addAlert({
      moduleId: 'server',
      title: `Server restart initiated: ${server.name}`,
      message: `A restart has been initiated for server ${server.name} (${server.ip}).`,
      severity: AlertSeverity.INFO,
    });
  };
  
  const handleShutdownServer = (server: ServerData) => {
    addAlert({
      moduleId: 'server',
      title: `Server shutdown initiated: ${server.name}`,
      message: `A shutdown has been initiated for server ${server.name} (${server.ip}).`,
      severity: AlertSeverity.WARNING,
    });
    
    // Update server status
    setServerList(prev => 
      prev.map(s => 
        s.id === server.id 
          ? { ...s, status: 'offline', uptime: '0 days', cpu: 0, memory: 0 } 
          : s
      )
    );
  };
  
  return (
    <Container>
      <Header>Server List</Header>
      
      <ServerTable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Server Name</TableHeaderCell>
            <TableHeaderCell>IP Address</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Uptime</TableHeaderCell>
            <TableHeaderCell>CPU</TableHeaderCell>
            <TableHeaderCell>Memory</TableHeaderCell>
            <TableHeaderCell>Disk</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {serverList.map(server => (
            <TableRow key={server.id}>
              <TableCell>{server.name}</TableCell>
              <TableCell>{server.ip}</TableCell>
              <TableCell>{server.type}</TableCell>
              <TableCell>
                <StatusIndicator status={server.status} />
                {server.status === 'online' ? 'Online' : 
                 server.status === 'warning' ? 'Warning' : 'Offline'}
              </TableCell>
              <TableCell>{server.uptime}</TableCell>
              <TableCell>{server.cpu}%</TableCell>
              <TableCell>{server.memory}%</TableCell>
              <TableCell>{server.disk}%</TableCell>
              <TableCell>
                <ActionButton 
                  disabled={server.status === 'offline'} 
                  onClick={() => handleRestartServer(server)}
                >
                  Restart
                </ActionButton>
                <ActionButton 
                  disabled={server.status === 'offline'} 
                  onClick={() => handleShutdownServer(server)}
                >
                  Shutdown
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </ServerTable>
    </Container>
  );
};

export default ServerList;