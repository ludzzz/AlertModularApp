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

const Toggle = styled.div`
  display: inline-block;
  position: relative;
  width: 60px;
  height: 28px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #2196f3;
  }
  
  &:checked + span:before {
    transform: translateX(32px);
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
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const FrontendSettings: React.FC = () => {
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [errorTrackingEnabled, setErrorTrackingEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [theme, setTheme] = useState('light');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com/frontend');
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/local storage
    alert('Settings saved successfully!');
  };
  
  return (
    <Container>
      <Header>Frontend Module Settings</Header>
      
      <SettingsCard>
        <SettingsTitle>General Settings</SettingsTitle>
        
        <FormGroup>
          <Label>API Endpoint</Label>
          <Input 
            type="text" 
            value={apiEndpoint} 
            onChange={(e) => setApiEndpoint(e.target.value)}
          />
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
          <Label>Theme</Label>
          <Select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </Select>
        </FormGroup>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Alert Settings</SettingsTitle>
        
        <FormGroup>
          <Label>Features</Label>
          
          <div style={{ marginBottom: '10px' }}>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              Enable Notifications
            </CheckboxLabel>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={errorTrackingEnabled} 
                onChange={() => setErrorTrackingEnabled(!errorTrackingEnabled)}
              />
              Enable Error Tracking
            </CheckboxLabel>
          </div>
          
          <div>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={analyticsEnabled} 
                onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
              />
              Enable Usage Analytics
            </CheckboxLabel>
          </div>
        </FormGroup>
      </SettingsCard>
      
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </Container>
  );
};

export default FrontendSettings;