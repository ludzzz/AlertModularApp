import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
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
  const { setCurrentModuleId } = useCoreContext();
  
  const handleTabChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
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