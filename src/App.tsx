import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { theme } from './theme';
import Routes from './routes';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingDashboard from './components/LoadingDashboard';
import { usePostMessage } from './hooks/usePostMessage';
import { useDynamicTitle } from './hooks/useDynamicTitle';
import { useScrollDirection } from './hooks/useScrollDirection';
import { useAppSelector } from './hooks/useRedux';

const AppContent: React.FC = () => {
  const { isInitialized } = usePostMessage();
  useDynamicTitle();
  useScrollDirection();

  const userData = useAppSelector((state) => state.user.userData);

  if (!userData && !isInitialized) {
    return <LoadingDashboard />;
  }

  return (
    <DashboardLayout>
      <Routes />
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AppContent />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
