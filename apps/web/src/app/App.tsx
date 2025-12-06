import { StyleProvider } from '@ant-design/cssinjs';
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { useLocalStorage } from 'react-use';

import { useSupabaseSession } from '@/auth/useSupabaseSession';
import { usePrefersDarkSchema } from '@/shared/hooks/use-prefers-dark-schema';

import {
  APP_THEME_MODE,
  type AppAlgorithm,
  AppContext,
  type AppThemeMode,
} from './app.context';
import 'dayjs/locale/es';

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
  const { session } = useSupabaseSession();
  const prefersDark = usePrefersDarkSchema();
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
              <Auth0Provider
                authorizationParams={{
                  redirect_uri: window.location.origin,
                }}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                domain={import.meta.env.VITE_AUTH0_DOMAIN}
              >
                <AppContext.Provider
                  value={{ session, setThemeMode, themeMode }}
                >
                  <AppRoutes />
                </AppContext.Provider>
              </Auth0Provider>
              {/* <ReactQueryDevtools
              buttonPosition="top-right"
              initialIsOpen={false}
              /> */}
            </Alert.ErrorBoundary>
          </AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
