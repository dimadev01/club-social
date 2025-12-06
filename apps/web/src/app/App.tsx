import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, theme, type ThemeConfig } from 'antd';
import esEs from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router';
import { useDarkMode } from 'usehooks-ts';
import 'dayjs/locale/es';

dayjs.locale('es');

import { useMemo } from 'react';
import { useLocalStorage } from 'react-use';

import { useSupabaseSession } from '@/auth/useSupabaseSession';
import { usePrefersDarkSchema } from '@/shared/hooks/use-prefers-dark-schema';

import { APP_THEME_MODE, AppContext, type AppThemeMode } from './app.context';
import { AppRoutes } from './AppRoutes';

const queryClient = new QueryClient();

export function App() {
  const { isLoading, session } = useSupabaseSession();
  const { isDarkMode, set: setDarkModeValue } = useDarkMode();
  const [themeMode, setThemeMode] = useLocalStorage<AppThemeMode>(
    'theme',
    APP_THEME_MODE.AUTO,
  );
  const userPrefersDarkSchema = usePrefersDarkSchema();

  const handleSetThemeMode = (value: AppThemeMode) => {
    setThemeMode(value);

    if (value === APP_THEME_MODE.AUTO) {
      setDarkModeValue(userPrefersDarkSchema);
    } else {
      setDarkModeValue(value === APP_THEME_MODE.DARK);
    }
  };

  const themeConfig: ThemeConfig = useMemo(
    () => ({
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      components: {
        Button: {
          primaryShadow: 'none',
        },
        Layout: {
          footerPadding: 0,
        },
      },
      token: {
        colorInfo: '#22883e',
        colorPrimary: '#22883e',
      },
      zeroRuntime: true,
    }),
    [isDarkMode],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyleProvider layer>
      <ConfigProvider locale={esEs} theme={themeConfig}>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <BrowserRouter>
              <AppContext.Provider
                value={{
                  session,
                  setThemeMode: handleSetThemeMode,
                  themeMode,
                }}
              >
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
