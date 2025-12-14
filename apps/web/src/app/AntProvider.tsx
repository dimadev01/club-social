import { StyleProvider } from '@ant-design/cssinjs';
import { Alert, App, ConfigProvider, theme, type ThemeConfig } from 'antd';
import esEs from 'antd/locale/es_ES';
import { useMemo } from 'react';
import { useMedia } from 'react-use';

import {
  APP_THEME_MODE,
  type AppAlgorithm,
  type AppThemeMode,
  useAppContext,
} from './AppContext';

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

export function AntProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMedia('(prefers-color-scheme: dark)');

  const { themeMode } = useAppContext();

  const themeConfig: ThemeConfig = useMemo(() => {
    const algorithm = getAlgorithm({ prefersDark, themeMode });

    return getThemeConfig({ algorithm });
  }, [themeMode, prefersDark]);

  return (
    <StyleProvider layer>
      <ConfigProvider
        locale={esEs}
        select={{
          showSearch: {
            optionFilterProp: 'label',
          },
        }}
        table={{
          rowKey: 'id',
        }}
        theme={themeConfig}
      >
        <App>
          <Alert.ErrorBoundary>{children}</Alert.ErrorBoundary>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
