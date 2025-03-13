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

const Tab = styled.div<{ active: boolean }>`
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

const AlertToggle = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 10px;
  color: #666;
`;

const ToggleInput = styled.input`
  margin-right: 5px;
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
                <ToggleInput 
                  type="checkbox" 
                  checked={module.alertsEnabled}
                  onChange={(e) => handleToggleAlerts(e, module.id)} 
                />
                Alerts
              </AlertToggle>
            )}
          </TabContent>
        </Tab>
      ))}
    </TabContainer>
  );
};

export default TabBar;