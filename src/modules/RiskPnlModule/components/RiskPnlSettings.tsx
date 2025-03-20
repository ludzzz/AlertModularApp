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

const RiskPnlSettings: React.FC = () => {
  // Settings state
  const [dataSource, setDataSource] = useState('primary');
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [varThreshold, setVarThreshold] = useState('1500000');
  const [creditExposureThreshold, setCreditExposureThreshold] = useState('5000000');
  const [marketRiskThreshold, setMarketRiskThreshold] = useState('1000000');
  const [liquidityRatioThreshold, setLiquidityRatioThreshold] = useState('100');
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [enableAutoAcknowledge, setEnableAutoAcknowledge] = useState(false);
  const [enableDailyReport, setEnableDailyReport] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/local storage
    alert('Settings saved successfully!');
  };
  
  return (
    <Container>
      <Header>Risk & PnL Module Settings</Header>
      
      <SettingsCard>
        <SettingsTitle>General Settings</SettingsTitle>
        
        <FormGroup>
          <Label>Data Source</Label>
          <Select 
            value={dataSource} 
            onChange={(e) => setDataSource(e.target.value)}
          >
            <option value="primary">Primary Risk Engine</option>
            <option value="secondary">Secondary Risk Engine</option>
            <option value="both">Both (Composite)</option>
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
                checked={enableAlerts} 
                onChange={() => setEnableAlerts(!enableAlerts)}
              />
              Enable Alert Notifications
            </CheckboxLabel>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={enableAutoAcknowledge} 
                onChange={() => setEnableAutoAcknowledge(!enableAutoAcknowledge)}
              />
              Auto-acknowledge Low Severity Alerts
            </CheckboxLabel>
          </div>
          
          <div>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={enableDailyReport} 
                onChange={() => setEnableDailyReport(!enableDailyReport)}
              />
              Enable Daily Risk Summary Report
            </CheckboxLabel>
          </div>
        </FormGroup>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Risk Thresholds</SettingsTitle>
        
        <FormGroup>
          <Label>Alert Thresholds</Label>
          
          <ThresholdInput>
            <InputLabel>Value at Risk (VaR):</InputLabel>
            <Input 
              type="number" 
              value={varThreshold} 
              onChange={(e) => setVarThreshold(e.target.value)}
            />
            <span>USD</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Credit Exposure:</InputLabel>
            <Input 
              type="number" 
              value={creditExposureThreshold} 
              onChange={(e) => setCreditExposureThreshold(e.target.value)}
            />
            <span>USD</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Market Risk:</InputLabel>
            <Input 
              type="number" 
              value={marketRiskThreshold} 
              onChange={(e) => setMarketRiskThreshold(e.target.value)}
            />
            <span>USD</span>
          </ThresholdInput>
          
          <ThresholdInput>
            <InputLabel>Liquidity Ratio:</InputLabel>
            <Input 
              type="number" 
              value={liquidityRatioThreshold} 
              onChange={(e) => setLiquidityRatioThreshold(e.target.value)}
            />
            <span>%</span>
          </ThresholdInput>
        </FormGroup>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Portfolio Configurations</SettingsTitle>
        
        <Table>
          <thead>
            <tr>
              <TableHeader>Portfolio</TableHeader>
              <TableHeader>Risk Weight</TableHeader>
              <TableHeader>Alert Threshold</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>Global Equities</TableCell>
              <TableCell>1.5</TableCell>
              <TableCell>$100,000</TableCell>
              <TableCell>Active</TableCell>
            </tr>
            <tr>
              <TableCell>Fixed Income</TableCell>
              <TableCell>1.0</TableCell>
              <TableCell>$75,000</TableCell>
              <TableCell>Active</TableCell>
            </tr>
            <tr>
              <TableCell>Commodities</TableCell>
              <TableCell>2.0</TableCell>
              <TableCell>$120,000</TableCell>
              <TableCell>Active</TableCell>
            </tr>
            <tr>
              <TableCell>FX & Derivatives</TableCell>
              <TableCell>2.5</TableCell>
              <TableCell>$150,000</TableCell>
              <TableCell>Active</TableCell>
            </tr>
          </tbody>
        </Table>
        
        <Button>Configure Portfolios</Button>
      </SettingsCard>
      
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </Container>
  );
};

export default RiskPnlSettings;