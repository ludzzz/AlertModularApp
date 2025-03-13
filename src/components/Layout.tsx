import React from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import AlertPanel from './AlertPanel';
import { useCoreContext } from '../core/CoreContext';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setCurrentModuleId, getModuleById } = useCoreContext();
  const navigate = useNavigate();
  
  const handleTabChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    
    // Get the default route for this module and navigate to it
    const module = getModuleById(moduleId);
    
    if (module && module.menuItems && module.menuItems.length > 0) {
      // Get the first menu item's path
      const defaultPath = module.menuItems[0].path;
      navigate(defaultPath);
    }
  };
  
  return (
    <AppContainer>
      <Header />
      <MainContainer>
        <Sidebar />
        <ContentContainer>
          <TabBar onTabChange={handleTabChange} />
          <MainContent>
            {children || <Outlet />}
          </MainContent>
        </ContentContainer>
      </MainContainer>
      <AlertPanel />
    </AppContainer>
  );
};

export default Layout;