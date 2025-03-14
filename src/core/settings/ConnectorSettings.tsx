import React, { useState } from 'react';
import styled from 'styled-components';
import { useCoreContext } from '../CoreContext';
import { Connector } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Styled components for the settings UI
const SettingsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ConnectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const ConnectorItem = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ConnectorInfo = styled.div`
  flex: 1;
`;

const ConnectorName = styled.h4`
  margin: 0 0 5px 0;
`;

const ConnectorType = styled.span`
  background-color: #e3f2fd;
  color: #0d47a1;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 10px;
`;

const ConnectorDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const ConnectorControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #1976d2;
  }
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean }>`
  background-color: ${props => {
    if (props.danger) return '#dc3545';
    if (props.primary) return '#2196f3';
    return '#e9ecef';
  }};
  color: ${props => {
    if (props.danger || props.primary) return 'white';
    return '#212529';
  }};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    background-color: ${props => {
      if (props.danger) return '#c82333';
      if (props.primary) return '#1976d2';
      return '#dee2e6';
    }};
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #2196f3;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const FormContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 20px;
`;

// Component props
interface ConnectorSettingsProps {
  onSave?: (connector: Connector) => void;
}

const ConnectorSettings: React.FC<ConnectorSettingsProps> = ({ onSave }) => {
  const { connectors, registerConnector, unregisterConnector, toggleConnector } = useCoreContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConnector, setEditingConnector] = useState<Connector | null>(null);
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    type: 'opsgenie',
    apiKey: '',
    subdomain: '',
    region: 'us',
    teamId: '',
    enabled: true
  });

  // Initialize the form when editing a connector
  const startEdit = (connector: Connector) => {
    setEditingConnector(connector);
    setFormState({
      name: connector.name,
      type: connector.type,
      apiKey: connector.config.apiKey || '',
      subdomain: connector.config.subdomain || '',
      region: connector.config.region || 'us',
      teamId: connector.teamId || '',
      enabled: connector.enabled
    });
    setShowAddForm(true);
  };

  // Reset the form
  const resetForm = () => {
    setEditingConnector(null);
    setFormState({
      name: '',
      type: 'opsgenie',
      apiKey: '',
      subdomain: '',
      region: 'us',
      teamId: '',
      enabled: true
    });
    setShowAddForm(false);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const connector: Connector = {
      id: editingConnector?.id || uuidv4(),
      name: formState.name,
      type: formState.type,
      enabled: formState.enabled,
      config: {
        apiKey: formState.apiKey,
        subdomain: formState.subdomain,
        region: formState.region
      },
      teamId: formState.teamId || undefined
    };
    
    registerConnector(connector);
    
    if (onSave) {
      onSave(connector);
    }
    
    resetForm();
  };

  // Test connection to the connector (this would be implemented with real API calls)
  const testConnection = (connector: Connector) => {
    alert(`Testing connection to ${connector.name}... This is a placeholder.`);
  };

  // Delete a connector
  const deleteConnector = (id: string) => {
    if (window.confirm('Are you sure you want to delete this connector?')) {
      unregisterConnector(id);
    }
  };

  return (
    <SettingsContainer>
      <SectionTitle>Alert Connectors</SectionTitle>
      
      {connectors.length === 0 ? (
        <EmptyState>
          <p>No connectors configured yet.</p>
          <p>Add a connector to receive alerts from external systems.</p>
        </EmptyState>
      ) : (
        <ConnectorList>
          {connectors.map(connector => (
            <ConnectorItem key={connector.id}>
              <ConnectorInfo>
                <ConnectorName>
                  {connector.name}
                  <ConnectorType>{connector.type}</ConnectorType>
                </ConnectorName>
                <ConnectorDetails>
                  {connector.teamId && <div>Team: {connector.teamId}</div>}
                  <div>Status: {connector.enabled ? 'Enabled' : 'Disabled'}</div>
                </ConnectorDetails>
              </ConnectorInfo>
              <ConnectorControls>
                <ToggleSwitch>
                  <SwitchInput 
                    type="checkbox" 
                    checked={connector.enabled} 
                    onChange={() => toggleConnector(connector.id, !connector.enabled)} 
                  />
                  <SwitchSlider />
                </ToggleSwitch>
                <Button onClick={() => testConnection(connector)}>Test</Button>
                <Button onClick={() => startEdit(connector)}>Edit</Button>
                <Button danger onClick={() => deleteConnector(connector.id)}>Delete</Button>
              </ConnectorControls>
            </ConnectorItem>
          ))}
        </ConnectorList>
      )}
      
      {!showAddForm ? (
        <AddButton onClick={() => setShowAddForm(true)}>
          Add Connector
        </AddButton>
      ) : (
        <FormContainer>
          <h3>{editingConnector ? 'Edit Connector' : 'Add Connector'}</h3>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Connector Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="e.g., Production Opsgenie"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="type">Connector Type</Label>
              <Select
                id="type"
                name="type"
                value={formState.type}
                onChange={handleInputChange}
              >
                <option value="opsgenie">Opsgenie</option>
                <option value="pagerduty" disabled>PagerDuty (Coming Soon)</option>
                <option value="prometheus" disabled>Prometheus (Coming Soon)</option>
                <option value="datadog" disabled>DataDog (Coming Soon)</option>
              </Select>
            </FormGroup>
            
            {formState.type === 'opsgenie' && (
              <>
                <FormGroup>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={formState.apiKey}
                    onChange={handleInputChange}
                    placeholder="Your Opsgenie API Key"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <Input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formState.subdomain}
                    onChange={handleInputChange}
                    placeholder="e.g., your-company"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="region">Region</Label>
                  <Select
                    id="region"
                    name="region"
                    value={formState.region}
                    onChange={handleInputChange}
                  >
                    <option value="us">US</option>
                    <option value="eu">EU</option>
                  </Select>
                </FormGroup>
              </>
            )}
            
            <FormGroup>
              <Label htmlFor="teamId">Team ID (Optional)</Label>
              <Input
                type="text"
                id="teamId"
                name="teamId"
                value={formState.teamId}
                onChange={handleInputChange}
                placeholder="Enter team identifier for filtering alerts"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                <Checkbox
                  type="checkbox"
                  name="enabled"
                  checked={formState.enabled}
                  onChange={handleInputChange}
                />
                Enabled
              </Label>
            </FormGroup>
            
            <FormActions>
              <Button type="button" onClick={resetForm}>Cancel</Button>
              <Button type="submit" primary>
                {editingConnector ? 'Update Connector' : 'Add Connector'}
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      )}
    </SettingsContainer>
  );
};

// Additional styled component for checkbox
const Checkbox = styled.input`
  margin-right: 10px;
`;

export default ConnectorSettings;