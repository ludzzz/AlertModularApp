import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCoreContext } from '../core/CoreContext';
import { ModuleMenuItem } from '../types';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #34495e;
  color: white;
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 20px 0;
`;

const SidebarTitle = styled.h3`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
  padding: 0 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ active: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${({ active }) => (active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EmptyMenuMessage = styled.div`
  padding: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentModuleId, getModuleById } = useCoreContext();
  
  const currentModule = currentModuleId ? getModuleById(currentModuleId) : undefined;
  const menuItems = currentModule?.menuItems || [];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarContainer>
      {currentModule ? (
        <>
          <SidebarTitle>{currentModule.name}</SidebarTitle>
          {menuItems.length > 0 ? (
            <MenuList>
              {menuItems.map((item: ModuleMenuItem) => (
                <MenuItem 
                  key={item.id} 
                  active={location.pathname === item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  <MenuItemContent>
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </MenuItemContent>
                </MenuItem>
              ))}
            </MenuList>
          ) : (
            <EmptyMenuMessage>No menu items available</EmptyMenuMessage>
          )}
        </>
      ) : (
        <EmptyMenuMessage>No module selected</EmptyMenuMessage>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;