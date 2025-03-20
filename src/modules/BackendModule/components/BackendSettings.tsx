import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const SettingsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SettingsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: #1976d2;
  }
`;

const ThresholdInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const InputLabel = styled.span`
  font-weight: normal;
  width: 150px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
`;

const BackendSettings: React.FC = () => {
  // Settings state
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [errorTrackingEnabled, setErrorTrackingEnabled] = useState(true);
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [loggingLevel, setLoggingLevel] = useState('info');
  const [cpuThreshold, setCpuThreshold] = useState('80');
  const [memoryThreshold, setMemoryThreshold] = useState('85');
  const [diskThreshold, setDiskThreshold] = useState('90');
  const [responseTimeThreshold, setResponseTimeThreshold] = useState('300');
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/local storage
    alert('Settings saved successfully!');
  };
  
  return (
    <Container>
      <Header>Backend Module Settings</Header>
      
      <SettingsCard>
        <SettingsTitle>General Settings</SettingsTitle>
        
        <FormGroup>
          <Label>Logging Level</Label>
          <Select 
            value={loggingLevel} 
            onChange={(e) => setLoggingLevel(e.target.value)}
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Data Refresh Interval (seconds)</Label>
          <Select 
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(e.target.value)}
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Features</Label>
          
          <div style={{ marginBottom: '10px' }}>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={monitoringEnabled} 
                onChange={() => setMonitoringEnabled(!monitoringEnabled)}
              />
              Enable System Monitoring
            </CheckboxLabel>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={errorTrackingEnabled} 
                onChange={() => setErrorTrackingEnabled(!errorTrackingEnabled)}
              />
              Enable Error Tracking & Logging
            </CheckboxLabel>
          </div>
          
          <div>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={autoRestartEnabled} 
                onChange={() => setAutoRestartEnabled(!autoRestartEnabled)}
              />
              Enable Auto-restart for Failed Services
            </CheckboxLabel>
          </div>
        </FormGroup>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Alert Thresholds</SettingsTitle>
        
        <FormGroup>
          <ThresholdInput>
            <InputLabel>CPU Usage:</InputLabel>
            <Input 
              type="number" 
              value={cpuThreshold} 
              onChange={(e) => setCpuThreshold(e.target.value)}
            />
            <span>%</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Memory Usage:</InputLabel>
            <Input 
              type="number" 
              value={memoryThreshold} 
              onChange={(e) => setMemoryThreshold(e.target.value)}
            />
            <span>%</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Disk Usage:</InputLabel>
            <Input 
              type="number" 
              value={diskThreshold} 
              onChange={(e) => setDiskThreshold(e.target.value)}
            />
            <span>%</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Response Time:</InputLabel>
            <Input 
              type="number" 
              value={responseTimeThreshold} 
              onChange={(e) => setResponseTimeThreshold(e.target.value)}
            />
            <span>ms</span>
          </ThresholdInput>
        </FormGroup>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Service Configurations</SettingsTitle>
        
        <Table>
          <thead>
            <tr>
              <TableHeader>Service</TableHeader>
              <TableHeader>Health Check</TableHeader>
              <TableHeader>Auto Restart</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>API Gateway</TableCell>
              <TableCell>/health</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Monitored</TableCell>
            </tr>
            <tr>
              <TableCell>Authentication Service</TableCell>
              <TableCell>/status</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Monitored</TableCell>
            </tr>
            <tr>
              <TableCell>Data Processor</TableCell>
              <TableCell>/api/health</TableCell>
              <TableCell>Disabled</TableCell>
              <TableCell>Monitored</TableCell>
            </tr>
            <tr>
              <TableCell>Payment Service</TableCell>
              <TableCell>/health-check</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Maintenance</TableCell>
            </tr>
            <tr>
              <TableCell>Notification Service</TableCell>
              <TableCell>/ping</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Monitored</TableCell>
            </tr>
            <tr>
              <TableCell>Analytics Engine</TableCell>
              <TableCell>/status</TableCell>
              <TableCell>Disabled</TableCell>
              <TableCell>Down</TableCell>
            </tr>
          </tbody>
        </Table>
        
        <Button>Manage Services</Button>
      </SettingsCard>
      
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </Container>
  );
};

export default BackendSettings;