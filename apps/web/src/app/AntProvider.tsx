import type { PropsWithChildren } from 'react';

import { StyleProvider } from '@ant-design/cssinjs';
import {
  Alert,
  theme as antTheme,
  App,
  ConfigProvider,
  type ThemeConfig,
} from 'antd';
import esEs from 'antd/locale/es_ES';
import { GiTennisBall } from 'react-icons/gi';

import { AntThemeMode, useAppContext } from './AppContext';

export function AntProvider({ children }: PropsWithChildren) {
  const { selectedTheme } = useAppContext();

  const algorithm =
    selectedTheme === AntThemeMode.DARK
      ? antTheme.darkAlgorithm
      : antTheme.defaultAlgorithm;

  const themeConfig: ThemeConfig = {
    algorithm: [algorithm],
    components: {
      Button: {
        primaryShadow: 'none',
      },
      Layout: {
        footerPadding: 0,
      },
    },
    // hashed: false,
    token: {
      colorInfo: '#22883e',
      colorPrimary: 'black',
      motion: false,
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
      >
        <App>
          <Alert.ErrorBoundary>{children}</Alert.ErrorBoundary>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
