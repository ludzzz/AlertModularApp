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

const MetricValue = styled.div<{ isNegative?: boolean }>`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 10px 0;
  color: ${props => props.isNegative ? '#f44336' : '#4caf50'};
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const MetricChange = styled.span<{ isPositive: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.isPositive ? '#4caf50' : '#f44336'};
  margin-left: 8px;
`;

const ThresholdBar = styled.div`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ percent: number; color: string }>`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: ${props => props.color};
  border-radius: 4px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const TableCell = styled.td<{ isNegative?: boolean }>`
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  color: ${props => props.isNegative ? '#f44336' : 'inherit'};
  font-weight: ${props => props.isNegative !== undefined ? 'bold' : 'normal'};
`;

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  previousValue: number;
  unit: string;
}

interface PnLItem {
  id: string;
  portfolio: string;
  dailyPnL: number;
  mtdPnL: number;
  ytdPnL: number;
  riskExposure: number;
}

const RiskPnlDashboard: React.FC = () => {
  const { addAlert } = useAlertContext();

  // Mock risk metrics data
  const [riskMetrics] = useState<RiskMetric[]>([
    {
      id: 'var',
      name: 'Value at Risk (VaR)',
      value: 1250000,
      threshold: 1500000,
      previousValue: 1175000,
      unit: 'USD'
    },
    {
      id: 'credit-exposure',
      name: 'Credit Exposure',
      value: 3800000,
      threshold: 5000000,
      previousValue: 3500000,
      unit: 'USD'
    },
    {
      id: 'market-risk',
      name: 'Market Risk',
      value: 875000,
      threshold: 1000000,
      previousValue: 920000,
      unit: 'USD'
    },
    {
      id: 'liquidity-ratio',
      name: 'Liquidity Coverage Ratio',
      value: 125,
      threshold: 100,
      previousValue: 118,
      unit: '%'
    }
  ]);
  
  // Mock PnL data
  const [pnlData] = useState<PnLItem[]>([
    {
      id: 'portfolio-a',
      portfolio: 'Global Equities',
      dailyPnL: 125000,
      mtdPnL: 450000,
      ytdPnL: 1250000,
      riskExposure: 0.75
    },
    {
      id: 'portfolio-b',
      portfolio: 'Fixed Income',
      dailyPnL: -32000,
      mtdPnL: 180000,
      ytdPnL: -320000,
      riskExposure: 0.45
    },
    {
      id: 'portfolio-c',
      portfolio: 'Commodities',
      dailyPnL: 78000,
      mtdPnL: -150000,
      ytdPnL: 650000,
      riskExposure: 0.92
    },
    {
      id: 'portfolio-d',
      portfolio: 'FX & Derivatives',
      dailyPnL: -45000,
      mtdPnL: 90000,
      ytdPnL: 875000,
      riskExposure: 0.88
    }
  ]);

  // Function to generate a test alert
  const generateTestAlert = () => {
    const isRiskAlert = Math.random() > 0.5;
    
    if (isRiskAlert) {
      // Generate risk alert
      const metric = riskMetrics[Math.floor(Math.random() * riskMetrics.length)];
      const isThresholdAlert = Math.random() > 0.3;
      
      addAlert({
        moduleId: 'riskpnl',
        title: isThresholdAlert 
          ? `${metric.name} Threshold Exceeded` 
          : `${metric.name} Rapid Change Detected`,
        message: isThresholdAlert
          ? `${metric.name} has exceeded the threshold of ${metric.threshold.toLocaleString()} ${metric.unit}. Current value: ${metric.value.toLocaleString()} ${metric.unit}.`
          : `${metric.name} has changed by ${Math.floor(Math.random() * 15 + 5)}% in the last hour.`,
        severity: isThresholdAlert ? AlertSeverity.ERROR : AlertSeverity.WARNING,
        category: AlertCategory.SYSTEM,
        source: 'risk-engine',
        entity: {
          id: metric.id,
          type: 'risk-metric',
          name: metric.name
        },
        tags: ['risk', 'metric', isThresholdAlert ? 'threshold-breach' : 'rapid-change']
      });
    } else {
      // Generate PnL alert
      const portfolio = pnlData[Math.floor(Math.random() * pnlData.length)];
      const isNegativeAlert = Math.random() > 0.4;
      
      addAlert({
        moduleId: 'riskpnl',
        title: isNegativeAlert 
          ? `${portfolio.portfolio} Significant Loss` 
          : `${portfolio.portfolio} Profit Milestone`,
        message: isNegativeAlert
          ? `${portfolio.portfolio} portfolio has recorded a significant loss of ${Math.abs(portfolio.dailyPnL).toLocaleString()} USD today.`
          : `${portfolio.portfolio} portfolio has reached a profit milestone of ${portfolio.ytdPnL.toLocaleString()} USD YTD.`,
        severity: isNegativeAlert ? AlertSeverity.ERROR : AlertSeverity.INFO,
        category: AlertCategory.SYSTEM,
        source: 'pnl-calculator',
        entity: {
          id: portfolio.id,
          type: 'portfolio',
          name: portfolio.portfolio
        },
        tags: ['pnl', portfolio.portfolio.toLowerCase().replace(/\s+/g, '-'), isNegativeAlert ? 'loss' : 'profit']
      });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <Container>
      <Header>Risk & PnL Dashboard</Header>
      
      <DashboardGrid>
        {riskMetrics.map(metric => {
          const percentOfThreshold = (metric.value / metric.threshold) * 100;
          const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
          const isPositiveChange = change >= 0;
          const thresholdColor = percentOfThreshold > 90 ? '#f44336' : percentOfThreshold > 75 ? '#ff9800' : '#4caf50';
          
          return (
            <Card key={metric.id}>
              <CardTitle>{metric.name}</CardTitle>
              <MetricValue isNegative={metric.id !== 'liquidity-ratio' && percentOfThreshold > 90}>
                {metric.unit === '%' ? metric.value : formatCurrency(metric.value)}
                <MetricChange isPositive={metric.id === 'liquidity-ratio' ? isPositiveChange : !isPositiveChange}>
                  {isPositiveChange ? '+' : ''}{change.toFixed(1)}%
                </MetricChange>
              </MetricValue>
              <MetricLabel>Threshold: {metric.unit === '%' ? metric.threshold : formatCurrency(metric.threshold)}</MetricLabel>
              <ThresholdBar>
                <ProgressBar 
                  percent={Math.min(percentOfThreshold, 100)} 
                  color={thresholdColor} 
                />
              </ThresholdBar>
            </Card>
          );
        })}
      </DashboardGrid>
      
      <Card>
        <CardTitle>Portfolio PnL Summary</CardTitle>
        <Table>
          <thead>
            <tr>
              <TableHeader>Portfolio</TableHeader>
              <TableHeader>Daily PnL</TableHeader>
              <TableHeader>MTD PnL</TableHeader>
              <TableHeader>YTD PnL</TableHeader>
              <TableHeader>Risk Exposure</TableHeader>
            </tr>
          </thead>
          <tbody>
            {pnlData.map(item => (
              <tr key={item.id}>
                <TableCell>{item.portfolio}</TableCell>
                <TableCell isNegative={item.dailyPnL < 0}>
                  {formatCurrency(item.dailyPnL)}
                </TableCell>
                <TableCell isNegative={item.mtdPnL < 0}>
                  {formatCurrency(item.mtdPnL)}
                </TableCell>
                <TableCell isNegative={item.ytdPnL < 0}>
                  {formatCurrency(item.ytdPnL)}
                </TableCell>
                <TableCell>{(item.riskExposure * 100).toFixed(0)}%</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      
      <ButtonsContainer>
        <Button onClick={generateTestAlert}>Generate Test Alert</Button>
      </ButtonsContainer>
    </Container>
  );
};

export default RiskPnlDashboard;