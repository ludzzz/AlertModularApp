import React, { useState } from 'react';
import styled from 'styled-components';
import { useCoreContext } from '../../core/CoreContext';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #2196F3;
  }
  
  &:focus + span {
    box-shadow: 0 0 1px #2196F3;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ServerSettings: React.FC = () => {
  const { modules, toggleModuleAlerts } = useCoreContext();
  const serverModule = modules.find(m => m.id === 'server');
  
  const [settings, setSettings] = useState({
    monitoringInterval: 1,
    alertThreshold: 'medium',
    autoRestart: false,
    enableNotifications: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };
  
  const handleToggleAlerts = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleModuleAlerts('server', e.target.checked);
  };
  
  return (
    <Container>
      <Header>Server Settings</Header>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Enable Server Alerts</Label>
          <Checkbox>
            <ToggleSwitch>
              <ToggleInput 
                type="checkbox" 
                checked={serverModule?.alertsEnabled ?? true} 
                onChange={handleToggleAlerts} 
              />
              <ToggleSlider />
            </ToggleSwitch>
            <span>{serverModule?.alertsEnabled ? 'Alerts Enabled' : 'Alerts Disabled'}</span>
          </Checkbox>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="monitoringInterval">Monitoring Interval (minutes)</Label>
          <Input 
            type="number" 
            id="monitoringInterval" 
            name="monitoringInterval" 
            value={settings.monitoringInterval}
            onChange={handleChange}
            min={1}
            max={60}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="alertThreshold">Alert Threshold</Label>
          <Select 
            id="alertThreshold" 
            name="alertThreshold" 
            value={settings.alertThreshold}
            onChange={handleChange}
          >
            <option value="low">Low (Report all issues)</option>
            <option value="medium">Medium (Default)</option>
            <option value="high">High (Report only critical issues)</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Checkbox>
            <input 
              type="checkbox" 
              id="autoRestart" 
              name="autoRestart" 
              checked={settings.autoRestart}
              onChange={handleChange}
            />
            <Label htmlFor="autoRestart" style={{ margin: 0 }}>
              Automatically restart servers that are unresponsive
            </Label>
          </Checkbox>
        </FormGroup>
        
        <FormGroup>
          <Checkbox>
            <input 
              type="checkbox" 
              id="enableNotifications" 
              name="enableNotifications" 
              checked={settings.enableNotifications}
              onChange={handleChange}
            />
            <Label htmlFor="enableNotifications" style={{ margin: 0 }}>
              Enable desktop notifications for server alerts
            </Label>
          </Checkbox>
        </FormGroup>
        
        <Button type="submit">Save Settings</Button>
      </Form>
    </Container>
  );
};

export default ServerSettings;