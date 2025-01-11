import { ConfigProvider, theme as antTheme } from 'antd';
import esEs from 'antd/es/locale/es_ES';
import React, { PropsWithChildren } from 'react';
import { GiTennisBall } from 'react-icons/gi';

import { AppThemeEnum } from './app.enum';

import { useThemeContext } from '@ui/providers/ThemeContext';

export const AntProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <ConfigProvider
      locale={esEs}
      select={{ showSearch: true }}
      popupMatchSelectWidth={false}
      form={{ requiredMark: 'optional' }}
      input={{ autoComplete: 'on' }}
      spin={{
        className: '!max-h-none',
        indicator: <GiTennisBall className="icon-bounce" />,
      }}
      theme={{
        algorithm:
          theme === AppThemeEnum.LIGHT
            ? antTheme.defaultAlgorithm
            : antTheme.darkAlgorithm,
        components: {
          Button: {
            primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
          },
          Layout: {
            lightSiderBg: '#f8f9fd',
            lightTriggerBg: '#f8f9fd',
            siderBg: '#111111',
            triggerBg: '#111111',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: 'transparent',
          },
        },
        token: {
          borderRadius: 0,
          colorPrimary: '#22883e',
          fontFamily: 'Rubik',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
