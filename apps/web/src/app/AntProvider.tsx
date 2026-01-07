import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeVariant } from '@club-social/shared/users';
import {
  Alert,
  theme as antTheme,
  App,
  ConfigProvider,
  type ThemeConfig,
} from 'antd';
import esEs from 'antd/locale/es_ES';
import { type PropsWithChildren, useMemo } from 'react';
import { GiTennisBall } from 'react-icons/gi';

import { AntThemeMode } from './app.enum';
import { useAppContext } from './AppContext';

export function AntProvider({ children }: PropsWithChildren) {
  const { preferences, selectedTheme } = useAppContext();

  const algorithm =
    selectedTheme === AntThemeMode.DARK
      ? antTheme.darkAlgorithm
      : antTheme.defaultAlgorithm;

  const variant =
    preferences.themeVariant === ThemeVariant.DEFAULT
      ? ThemeVariant.OUTLINED
      : preferences.themeVariant;

  const themeConfig: ThemeConfig = useMemo(
    () => ({
      algorithm: [algorithm],
      components: {
        Button: {
          primaryShadow: 'none',
        },
        Layout: {
          footerPadding: 0,
        },
      },
      hashed: false,
      token: {
        colorInfo: '#22883e',
        colorPrimary: '#22883e',
        motion: false,
      },
      zeroRuntime: true,
    }),
    [algorithm],
  );

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
        space={{
          size: 'middle',
        }}
        spin={{
          className: 'max-h-none',
          indicator: <GiTennisBall className="icon-bounce" />,
        }}
        table={{
          rowKey: 'id',
        }}
        theme={themeConfig}
        variant={variant}
      >
        <App>
          <Alert.ErrorBoundary>{children}</Alert.ErrorBoundary>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
