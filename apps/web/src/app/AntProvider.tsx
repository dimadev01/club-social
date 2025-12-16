import { StyleProvider } from '@ant-design/cssinjs';
import {
  Alert,
  theme as antTheme,
  App,
  ConfigProvider,
  theme,
  type ThemeConfig,
} from 'antd';
import esEs from 'antd/locale/es_ES';
import { useMedia } from 'react-use';

import {
  type AppAlgorithm,
  AppTheme,
  AppThemeMode,
  useAppContext,
} from './AppContext';

export function AntProvider({ children }: { children: React.ReactNode }) {
  const { appThemeMode, setThemeMode } = useAppContext();
  const prefersDark = useMedia('(prefers-color-scheme: dark)');
  const { token } = theme.useToken();

  let algorithm: AppAlgorithm;

  if (appThemeMode === AppThemeMode.AUTO) {
    algorithm = prefersDark
      ? antTheme.darkAlgorithm
      : antTheme.defaultAlgorithm;
    setThemeMode(prefersDark ? AppTheme.DARK : AppTheme.LIGHT);
  } else if (appThemeMode === AppThemeMode.DARK) {
    algorithm = antTheme.darkAlgorithm;
    setThemeMode(AppTheme.DARK);
  } else if (appThemeMode === AppThemeMode.LIGHT) {
    algorithm = antTheme.defaultAlgorithm;
    setThemeMode(AppTheme.LIGHT);
  } else {
    throw new Error(`Invalid theme mode: ${appThemeMode}`);
  }

  const themeConfig: ThemeConfig = {
    algorithm,
    components: {
      Button: {
        primaryShadow: 'none',
      },
      Layout: {
        footerPadding: 0,
        lightSiderBg: token.Layout?.bodyBg,
        lightTriggerBg: token.Layout?.bodyBg,
        siderBg: token.Layout?.bodyBg,
        triggerBg: token.Layout?.bodyBg,
      },
    },
    token: {
      colorInfo: '#22883e',
      colorPrimary: '#22883e',
    },
    zeroRuntime: true,
  };

  return (
    <StyleProvider layer>
      <ConfigProvider
        locale={esEs}
        select={{
          showSearch: {
            filterOption: true,
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
