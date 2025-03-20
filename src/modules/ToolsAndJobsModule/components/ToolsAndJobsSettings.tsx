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

// Select component is defined but not currently used
// Keeping it for future implementation
/*const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;*/

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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? '#2196f3' : 'inherit'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2196f3;
  }
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

// TimeInput component is defined but not currently used
// Keeping it for future implementation
/*const TimeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;*/

// TimeInputField component is defined but not currently used
// Keeping it for future implementation
/*const TimeInputField = styled.input`
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;*/

const ToolsAndJobsSettings: React.FC = () => {
  // Settings tabs
  const [activeTab, setActiveTab] = useState<'jobs' | 'tools'>('jobs');
  
  // Jobs settings state
  const [enabledJobScheduler, setEnabledJobScheduler] = useState(true);
  const [maxConcurrentJobs, setMaxConcurrentJobs] = useState('5');
  const [jobRetryAttempts, setJobRetryAttempts] = useState('3');
  const [jobTimeout, setJobTimeout] = useState('3600'); // seconds
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(false);
  const [storeJobHistory, setStoreJobHistory] = useState('30'); // days
  
  // Tools settings state
  const [toolsRefreshInterval, setToolsRefreshInterval] = useState('60'); // seconds
  const [backupPath, setBackupPath] = useState('/var/backup');
  const [logAnalyzerEnabled, setLogAnalyzerEnabled] = useState(true);
  const [logRetention, setLogRetention] = useState('90'); // days
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/local storage
    alert('Settings saved successfully!');
  };
  
  return (
    <Container>
      <Header>Tools & Jobs Settings</Header>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'jobs'} 
          onClick={() => setActiveTab('jobs')}
        >
          Jobs Settings
        </TabButton>
        <TabButton 
          active={activeTab === 'tools'} 
          onClick={() => setActiveTab('tools')}
        >
          Tools Settings
        </TabButton>
      </TabContainer>
      
      {activeTab === 'jobs' ? (
        <>
          <SettingsCard>
            <SettingsTitle>Job Scheduler Settings</SettingsTitle>
            
            <FormGroup>
              <CheckboxLabel>
                <Checkbox 
                  type="checkbox" 
                  checked={enabledJobScheduler} 
                  onChange={() => setEnabledJobScheduler(!enabledJobScheduler)}
                />
                Enable Job Scheduler
              </CheckboxLabel>
            </FormGroup>
            
            <FormGroup>
              <Label>Maximum Concurrent Jobs</Label>
              <Input 
                type="number" 
                value={maxConcurrentJobs} 
                onChange={(e) => setMaxConcurrentJobs(e.target.value)}
                min="1"
                max="20"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Job Retry Attempts</Label>
              <Input 
                type="number" 
                value={jobRetryAttempts} 
                onChange={(e) => setJobRetryAttempts(e.target.value)}
                min="0"
                max="10"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Default Job Timeout (seconds)</Label>
              <Input 
                type="number" 
                value={jobTimeout} 
                onChange={(e) => setJobTimeout(e.target.value)}
                min="60"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Job History Retention (days)</Label>
              <Input 
                type="number" 
                value={storeJobHistory} 
                onChange={(e) => setStoreJobHistory(e.target.value)}
                min="1"
                max="365"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Notifications</Label>
              
              <div style={{ marginBottom: '10px' }}>
                <CheckboxLabel>
                  <Checkbox 
                    type="checkbox" 
                    checked={notifyOnFailure} 
                    onChange={() => setNotifyOnFailure(!notifyOnFailure)}
                  />
                  Notify on Job Failure
                </CheckboxLabel>
              </div>
              
              <div>
                <CheckboxLabel>
                  <Checkbox 
                    type="checkbox" 
                    checked={notifyOnSuccess} 
                    onChange={() => setNotifyOnSuccess(!notifyOnSuccess)}
                  />
                  Notify on Job Success
                </CheckboxLabel>
              </div>
            </FormGroup>
          </SettingsCard>
          
          <SettingsCard>
            <SettingsTitle>Scheduled Jobs</SettingsTitle>
            
            <Table>
              <thead>
                <tr>
                  <TableHeader>Job Name</TableHeader>
                  <TableHeader>Schedule</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>Daily Database Backup</TableCell>
                  <TableCell>0 0 * * *</TableCell>
                  <TableCell>Backup</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Log Rotation</TableCell>
                  <TableCell>0 */6 * * *</TableCell>
                  <TableCell>Maintenance</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Weekly Analytics Report</TableCell>
                  <TableCell>0 9 * * 1</TableCell>
                  <TableCell>Report</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Database Cleanup</TableCell>
                  <TableCell>0 1 * * 0</TableCell>
                  <TableCell>Cleanup</TableCell>
                  <TableCell>Disabled</TableCell>
                  <TableCell>
                    <ActionButton>Edit</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Enable</ActionButton>
                  </TableCell>
                </tr>
              </tbody>
            </Table>
            
            <Button>Add New Job</Button>
          </SettingsCard>
        </>
      ) : (
        <>
          <SettingsCard>
            <SettingsTitle>Tools Settings</SettingsTitle>
            
            <FormGroup>
              <Label>Data Refresh Interval (seconds)</Label>
              <Input 
                type="number" 
                value={toolsRefreshInterval} 
                onChange={(e) => setToolsRefreshInterval(e.target.value)}
                min="15"
                max="3600"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Backup Directory Path</Label>
              <Input 
                type="text" 
                value={backupPath} 
                onChange={(e) => setBackupPath(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Log Retention Period (days)</Label>
              <Input 
                type="number" 
                value={logRetention} 
                onChange={(e) => setLogRetention(e.target.value)}
                min="1"
                max="365"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Features</Label>
              
              <div style={{ marginBottom: '10px' }}>
                <CheckboxLabel>
                  <Checkbox 
                    type="checkbox" 
                    checked={logAnalyzerEnabled} 
                    onChange={() => setLogAnalyzerEnabled(!logAnalyzerEnabled)}
                  />
                  Enable Log Analyzer
                </CheckboxLabel>
              </div>
              
              <div>
                <CheckboxLabel>
                  <Checkbox 
                    type="checkbox" 
                    checked={monitoringEnabled} 
                    onChange={() => setMonitoringEnabled(!monitoringEnabled)}
                  />
                  Enable Tools Monitoring
                </CheckboxLabel>
              </div>
            </FormGroup>
          </SettingsCard>
          
          <SettingsCard>
            <SettingsTitle>Available Tools</SettingsTitle>
            
            <Table>
              <thead>
                <tr>
                  <TableHeader>Tool Name</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>Database Admin</TableCell>
                  <TableCell>Administration</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Log Analyzer</TableCell>
                  <TableCell>Analysis</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Backup & Restore</TableCell>
                  <TableCell>Administration</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>System Monitor</TableCell>
                  <TableCell>Monitoring</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>Job Scheduler</TableCell>
                  <TableCell>Automation</TableCell>
                  <TableCell>Enabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Disable</ActionButton>
                  </TableCell>
                </tr>
                <tr>
                  <TableCell>API Tester</TableCell>
                  <TableCell>Monitoring</TableCell>
                  <TableCell>Disabled</TableCell>
                  <TableCell>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton style={{ marginLeft: '5px' }}>Enable</ActionButton>
                  </TableCell>
                </tr>
              </tbody>
            </Table>
          </SettingsCard>
        </>
      )}
      
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </Container>
  );
};

export default ToolsAndJobsSettings;