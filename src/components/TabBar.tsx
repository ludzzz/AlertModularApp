import React from 'react';
import styled from 'styled-components';
import { useCoreContext } from '../core/CoreContext';
import { ModuleDefinition } from '../types';

const TabContainer = styled.div`
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  overflow-x: auto;
  height: 50px;
`;

const Tab = styled.div.attrs({ role: 'button' })<{ active: boolean }>`
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-right: 1px solid #ddd;
  background-color: ${({ active }) => (active ? '#fff' : 'transparent')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  position: relative;
  
  &:hover {
    background-color: ${({ active }) => (active ? '#fff' : '#f1f3f5')};
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ active }) => (active ? '#3498db' : 'transparent')};
  }
`;

const TabContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AlertToggle = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 10px;
  color: #666;
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  margin-right: 5px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  &:checked + span {
    background-color: #4CAF50;
  }

  &:checked + span:before {
    transform: translateX(16px);
  }
  
  &:focus + span {
    box-shadow: 0 0 1px #4CAF50;
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
  transition: 0.3s;
  border-radius: 20px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

interface TabBarProps {
  onTabChange: (moduleId: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ onTabChange }) => {
  const { modules, currentModuleId, toggleModuleAlerts } = useCoreContext();
  
  const handleClick = (moduleId: string) => {
    onTabChange(moduleId);
  };
  
  const handleToggleAlerts = (event: React.ChangeEvent<HTMLInputElement>, moduleId: string) => {
    event.stopPropagation();
    toggleModuleAlerts(moduleId, event.target.checked);
  };
  
  return (
    <TabContainer>
      {modules.map((module: ModuleDefinition) => (
        <Tab 
          key={module.id} 
          active={currentModuleId === module.id}
          onClick={() => handleClick(module.id)}
        >
          <TabContent>
            <span>{module.name}</span>
            {module.id !== 'core' && (
              <AlertToggle onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch onClick={(e) => e.stopPropagation()}>
                  <SwitchInput 
                    type="checkbox" 
                    checked={module.alertsEnabled}
                    onChange={(e) => handleToggleAlerts(e, module.id)} 
                  />
                  <SwitchSlider onClick={(e) => {
                    e.stopPropagation();
                    // Manual toggle since the click is on the slider, not the input
                    toggleModuleAlerts(module.id, !module.alertsEnabled);
                  }} />
                </ToggleSwitch>
                <span onClick={(e) => e.stopPropagation()}>Alerts</span>
              </AlertToggle>
            )}
          </TabContent>
        </Tab>
      ))}
    </TabContainer>
  );
};

export default TabBar;