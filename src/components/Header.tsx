import React from 'react';
import styled from 'styled-components';
import { useAlertContext } from '../core/AlertContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
`;

const AlertIndicator = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const AlertCount = styled.span<{ hasAlerts: boolean }>`
  background-color: ${({ hasAlerts }) => (hasAlerts ? '#e74c3c' : '#7f8c8d')};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 8px;
`;

const Header: React.FC = () => {
  const { alerts, togglePanel, panelExpanded } = useAlertContext();
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  
  return (
    <HeaderContainer>
      <Logo>Alert Modular System</Logo>
      <Actions>
        <AlertIndicator onClick={togglePanel}>
          <AlertCount hasAlerts={activeAlerts.length > 0}>
            {activeAlerts.length}
          </AlertCount>
          <span>{panelExpanded ? 'Hide Alerts' : 'Show Alerts'}</span>
        </AlertIndicator>
      </Actions>
    </HeaderContainer>
  );
};

export default Header;