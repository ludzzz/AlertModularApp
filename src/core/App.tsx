import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CoreContextProvider } from './CoreContext';
import { AlertContextProvider } from './AlertContext';
import Layout from '../components/Layout';
import ModuleLoader from './ModuleLoader';
import '../index.css';

const App: React.FC = () => {
  return (
    <Router>
      <CoreContextProvider>
        <AlertContextProvider>
          <Layout>
            <ModuleLoader />
          </Layout>
        </AlertContextProvider>
      </CoreContextProvider>
    </Router>
  );
};

export default App;