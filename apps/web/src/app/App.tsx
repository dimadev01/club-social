import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, type ThemeConfig } from 'antd';
import { BrowserRouter } from 'react-router';

import { useSupabaseSession } from '@/auth/useSupabaseSession';

import { AppContext } from './app.context';
import { AppRoutes } from './AppRoutes';

const queryClient = new QueryClient();

const theme: ThemeConfig = {
  components: {
    Button: {
      primaryShadow: 'none',
    },
  },
  token: {
    colorInfo: '#22883e',
    colorPrimary: '#22883e',
  },
  zeroRuntime: true,
};

export function App() {
  const { isLoading, session } = useSupabaseSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyleProvider layer>
      <ConfigProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <BrowserRouter>
              <AppContext.Provider value={{ session }}>
                <AppRoutes />
              </AppContext.Provider>
            </BrowserRouter>
          </AntdApp>
          {/* <ReactQueryDevtools
              buttonPosition="top-right"
              initialIsOpen={false}
            /> */}
        </QueryClientProvider>
      </ConfigProvider>
    </StyleProvider>
  );
}
