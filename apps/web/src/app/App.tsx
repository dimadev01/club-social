import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Alert,
  App as AntdApp,
  ConfigProvider,
  theme,
  type ThemeConfig,
} from 'antd';
import esEs from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useLocalStorage, useMedia } from 'react-use';
import 'dayjs/locale/es';

import {
  APP_THEME_MODE,
  type AppAlgorithm,
  AppContext,
  type AppThemeMode,
} from './app.context';
import { AppRoutes } from './AppRoutes';

dayjs.locale('es');

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface GetAlgorithmParams {
  prefersDark: boolean;
  themeMode: AppThemeMode;
}

const getAlgorithm = ({
  prefersDark,
  themeMode,
}: GetAlgorithmParams): AppAlgorithm => {
  if (themeMode === APP_THEME_MODE.AUTO) {
    return prefersDark ? theme.darkAlgorithm : theme.defaultAlgorithm;
  }

  if (themeMode === APP_THEME_MODE.DARK) {
    return theme.darkAlgorithm;
  }

  if (themeMode === APP_THEME_MODE.LIGHT) {
    return theme.defaultAlgorithm;
  }

  throw new Error(`Invalid theme mode: ${themeMode}`);
};

const getThemeConfig = ({
  algorithm,
}: {
  algorithm: AppAlgorithm;
}): ThemeConfig => ({
  algorithm,
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
});

export function App() {
  const prefersDark = useMedia('(prefers-color-scheme: dark)');
  const [themeMode = APP_THEME_MODE.AUTO, setThemeMode] =
    useLocalStorage<AppThemeMode>('theme', APP_THEME_MODE.AUTO);

  const themeConfig: ThemeConfig = useMemo(() => {
    const algorithm = getAlgorithm({ prefersDark, themeMode });

    return getThemeConfig({ algorithm });
  }, [themeMode, prefersDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider locale={esEs} theme={themeConfig}>
          <AntdApp>
            <Alert.ErrorBoundary>
              <AppContext.Provider value={{ setThemeMode, themeMode }}>
                <AppRoutes />
              </AppContext.Provider>
              <ReactQueryDevtools
                buttonPosition="top-right"
                initialIsOpen={false}
              />
            </Alert.ErrorBoundary>
          </AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
