import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeAlgorithm, ThemeVariant } from '@club-social/shared/users';
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

  const modeAlgorithm =
    selectedTheme === AntThemeMode.DARK
      ? antTheme.darkAlgorithm
      : antTheme.defaultAlgorithm;

  const variant =
    preferences.themeVariant === ThemeVariant.DEFAULT
      ? ThemeVariant.OUTLINED
      : preferences.themeVariant;

  const algorithms = useMemo(() => {
    const algorithms = [modeAlgorithm];

    if (preferences.themeAlgorithm === ThemeAlgorithm.COMPACT) {
      algorithms.push(antTheme.compactAlgorithm);
    }

    return algorithms;
  }, [modeAlgorithm, preferences.themeAlgorithm]);

  const themeConfig: ThemeConfig = useMemo(
    () => ({
      algorithm: algorithms,
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
    [algorithms],
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
