import { App as AntApp } from 'antd';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { AppThemeEnum } from './app.enum';

import { useThemeContext } from '@ui/providers/ThemeContext';

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <AntApp
      rootClassName={clsx('cs-ant-app', { dark: theme === AppThemeEnum.DARK })}
    >
      {children}
    </AntApp>
  );
};
