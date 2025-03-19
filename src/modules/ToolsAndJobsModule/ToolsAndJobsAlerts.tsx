import React, { useState } from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../../core/AlertContext';
import { useConnectorAlerts } from '../../hooks/useConnectorAlerts';
import { 
  Alert, 
  AlertSeverity, 
  AlertCategory, 
  AlertStatus,
  NagiosAlert
} from '../../types';

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

const AlertItem = styled.div<{ severity: AlertSeverity; status: AlertStatus }>`
  padding: 15px;
  border-radius: 8px;
  background-color: ${({ status }) => {
    switch (status) {
      case AlertStatus.ACKNOWLEDGED:
        return '#f8f9fa';
      case AlertStatus.RESOLVED:
        return '#f0fff4';
      case AlertStatus.SILENCED:
        return '#f8f4ff';
      default:
        return 'white';
    }
  }};
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
  opacity: ${({ status }) => status === AlertStatus.RESOLVED || status === AlertStatus.SILENCED ? 0.7 : 1};
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

const CategoryBadge = styled.span<{ category: AlertCategory }>`
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 10px;
  background-color: ${({ category }) => {
    switch (category) {
      case AlertCategory.NETWORK:
        return '#e0f7fa';
      case AlertCategory.PERFORMANCE:
        return '#fff8e1';
      case AlertCategory.SECURITY:
        return '#ffebee';
      case AlertCategory.SYSTEM:
        return '#e8f5e9';
      case AlertCategory.APPLICATION:
        return '#e8eaf6';
      case AlertCategory.DATABASE:
        return '#f3e5f5';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ category }) => {
    switch (category) {
      case AlertCategory.NETWORK:
        return '#006064';
      case AlertCategory.PERFORMANCE:
        return '#ff6f00';
      case AlertCategory.SECURITY:
        return '#b71c1c';
      case AlertCategory.SYSTEM:
        return '#1b5e20';
      case AlertCategory.APPLICATION:
        return '#1a237e';
      case AlertCategory.DATABASE:
        return '#4a148c';
      default:
        return '#212121';
    }
  }};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const Tag = styled.span`
  padding: 2px 6px;
  border-radius: 12px;
  background-color: #f0f0f0;
  font-size: 0.7rem;
`;

const SourceBadge = styled.span`
  padding: 2px 6px;
  border-radius: 12px;
  background-color: #e0f2f1;
  color: #00695c;
  font-size: 0.7rem;
  margin-left: 5px;
`;

const EntityInfo = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
  padding: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const StatusBadge = styled.span<{ status: AlertStatus }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  background-color: ${({ status }) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return '#e3f2fd';
      case AlertStatus.ACKNOWLEDGED:
        return '#e8eaf6';
      case AlertStatus.RESOLVED:
        return '#e0f2f1';
      case AlertStatus.SILENCED:
        return '#f3e5f5';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return '#0d47a1';
      case AlertStatus.ACKNOWLEDGED:
        return '#1a237e';
      case AlertStatus.RESOLVED:
        return '#004d40';
      case AlertStatus.SILENCED:
        return '#4a148c';
      default:
        return '#212121';
    }
  }};
`;

const AddAlertForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ToolsAndJobsAlerts: React.FC = () => {
  const { 
    alerts, 
    addAlert, 
    addThirdPartyAlert, 
    acknowledgeAlert, 
    resolveAlert,
    silenceAlert,
    removeAlert 
  } = useAlertContext();
  
  // Use our custom hook to fetch connector alerts
  const { 
    isLoading, 
    error, 
    refreshAlerts 
  } = useConnectorAlerts({
    moduleId: 'toolsandjobs',
    teamId: 'operations-team',
    refreshInterval: 30000 // 30 seconds
  });
  
  const toolsAndJobsAlerts = alerts.filter(alert => alert.moduleId === 'toolsandjobs');
  
  // State for demo form
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [alertType, setAlertType] = useState<'internal' | 'nagios'>('internal');
  
  // Form state for internal alert
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>(AlertSeverity.INFO);
  const [category, setCategory] = useState<AlertCategory>(AlertCategory.SYSTEM);
  
  // Form state for Nagios alert
  const [hostName, setHostName] = useState('job-server');
  const [serviceDescription, setServiceDescription] = useState('Scheduled Jobs');
  const [state, setState] = useState<'OK' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'>('WARNING');
  const [output, setOutput] = useState('');
  const [longOutput, setLongOutput] = useState('');
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  const handleAddInternalAlert = () => {
    addAlert({
      moduleId: 'toolsandjobs',
      title,
      message,
      severity,
      category,
      source: 'internal',
      tags: ['manual', `severity:${severity}`, `category:${category}`]
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setSeverity(AlertSeverity.INFO);
    setCategory(AlertCategory.SYSTEM);
    setShowDemoForm(false);
  };
  
  const handleAddNagiosAlert = () => {
    const nagiosAlert: NagiosAlert = {
      source: 'nagios',
      host_name: hostName,
      service_description: serviceDescription,
      state,
      output,
      long_output: longOutput,
      timestamp: Math.floor(Date.now() / 1000), // Current time in seconds
      attempt: Math.floor(Math.random() * 3) + 1
    };
    
    addThirdPartyAlert(nagiosAlert, 'toolsandjobs');
    
    // Reset form
    setHostName('job-server');
    setServiceDescription('Scheduled Jobs');
    setState('WARNING');
    setOutput('');
    setLongOutput('');
    setShowDemoForm(false);
  };
  
  return (
    <Container>
      <Header>Tools & Jobs Alerts</Header>
      
      <ButtonGroup>
        <Button onClick={() => setShowDemoForm(!showDemoForm)}>
          {showDemoForm ? 'Hide Demo Form' : 'Add Test Alert'}
        </Button>
        <Button onClick={refreshAlerts}>
          Refresh Alerts
        </Button>
      </ButtonGroup>
      
      {showDemoForm && (
        <AddAlertForm>
          <FormHeader>Add Test Alert</FormHeader>
          
          <FormGroup>
            <Label>Alert Type</Label>
            <Select 
              value={alertType} 
              onChange={(e) => setAlertType(e.target.value as 'internal' | 'nagios')}
            >
              <option value="internal">Internal Alert</option>
              <option value="nagios">Nagios Alert</option>
            </Select>
          </FormGroup>
          
          {alertType === 'internal' ? (
            <>
              <FormGroup>
                <Label>Title</Label>
                <Input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Alert title"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Message</Label>
                <Input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Alert message"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Severity</Label>
                <Select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                >
                  <option value={AlertSeverity.INFO}>Info</option>
                  <option value={AlertSeverity.WARNING}>Warning</option>
                  <option value={AlertSeverity.ERROR}>Error</option>
                  <option value={AlertSeverity.CRITICAL}>Critical</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Category</Label>
                <Select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as AlertCategory)}
                >
                  <option value={AlertCategory.SYSTEM}>System</option>
                  <option value={AlertCategory.PERFORMANCE}>Performance</option>
                  <option value={AlertCategory.APPLICATION}>Application</option>
                  <option value={AlertCategory.SECURITY}>Security</option>
                </Select>
              </FormGroup>
              
              <Button onClick={handleAddInternalAlert}>Add Internal Alert</Button>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>Host Name</Label>
                <Input 
                  type="text" 
                  value={hostName} 
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g., job-server"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Service Description</Label>
                <Input 
                  type="text" 
                  value={serviceDescription} 
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="e.g., Scheduled Jobs"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>State</Label>
                <Select 
                  value={state} 
                  onChange={(e) => setState(e.target.value as 'OK' | 'WARNING' | 'CRITICAL' | 'UNKNOWN')}
                >
                  <option value="OK">OK</option>
                  <option value="WARNING">Warning</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="UNKNOWN">Unknown</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Output</Label>
                <Input 
                  type="text" 
                  value={output} 
                  onChange={(e) => setOutput(e.target.value)}
                  placeholder="Alert output message"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Long Output (Optional)</Label>
                <Input 
                  type="text" 
                  value={longOutput} 
                  onChange={(e) => setLongOutput(e.target.value)}
                  placeholder="Detailed alert information"
                />
              </FormGroup>
              
              <Button onClick={handleAddNagiosAlert}>Add Nagios Alert</Button>
            </>
          )}
        </AddAlertForm>
      )}
      
      <AlertsList>
        {toolsAndJobsAlerts.length > 0 ? (
          toolsAndJobsAlerts.map((alert: Alert) => (
            <AlertItem key={alert.id} severity={alert.severity} status={alert.status}>
              <AlertHeader>
                <div>
                  <AlertTitle>
                    {alert.title}
                    <SourceBadge>{alert.source}</SourceBadge>
                    <CategoryBadge category={alert.category}>{alert.category}</CategoryBadge>
                  </AlertTitle>
                </div>
                <SeverityBadge severity={alert.severity}>
                  {alert.severity.toUpperCase()}
                </SeverityBadge>
              </AlertHeader>
              <AlertMessage>{alert.message}</AlertMessage>
              
              {alert.entity && (
                <EntityInfo>
                  Entity: {alert.entity.name} ({alert.entity.type}, ID: {alert.entity.id})
                </EntityInfo>
              )}
              
              {alert.tags && alert.tags.length > 0 && (
                <Tags>
                  {alert.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </Tags>
              )}
              
              <AlertMeta>
                <AlertTime>Time: {formatDate(alert.timestamp)}</AlertTime>
                <StatusBadge status={alert.status}>{alert.status}</StatusBadge>
              </AlertMeta>
              
              <ActionButtons>
                {alert.status === AlertStatus.ACTIVE && (
                  <Button onClick={() => acknowledgeAlert(alert.id)}>
                    Acknowledge
                  </Button>
                )}
                
                {(alert.status === AlertStatus.ACTIVE || alert.status === AlertStatus.ACKNOWLEDGED) && (
                  <Button onClick={() => resolveAlert(alert.id)}>
                    Resolve
                  </Button>
                )}
                
                {alert.status !== AlertStatus.SILENCED && (
                  <Button onClick={() => silenceAlert(alert.id, 60000)}>
                    Silence (1m)
                  </Button>
                )}
                
                <Button onClick={() => removeAlert(alert.id)}>
                  Remove
                </Button>
              </ActionButtons>
            </AlertItem>
          ))
        ) : (
          <EmptyState>
            <h3>No tools & jobs alerts</h3>
            <p>There are currently no alerts for the tools & jobs module.</p>
          </EmptyState>
        )}
      </AlertsList>
    </Container>
  );
};

export default ToolsAndJobsAlerts;