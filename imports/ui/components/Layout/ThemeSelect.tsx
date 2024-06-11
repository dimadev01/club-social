import {
  InteractionOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserThemeEnum } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppThemeEnum } from '@ui/app.enum';
import { Select } from '@ui/components/Select';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { useUpdateUserTheme } from '@ui/hooks/users/useUpdateUserTheme';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const ThemeSelect = () => {
  const user = useLoggedInUser();

  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const { setTheme, theme } = useThemeContext();

  const updateUserTheme = useUpdateUserTheme();

  useEffect(() => {
    LocalStorageUtils.set('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      if (user.profile?.theme === UserThemeEnum.AUTO) {
        setTheme(systemPrefersDark ? AppThemeEnum.DARK : AppThemeEnum.LIGHT);
      } else if (user.profile?.theme === UserThemeEnum.LIGHT) {
        setTheme(AppThemeEnum.LIGHT);
      } else if (user.profile?.theme === UserThemeEnum.DARK) {
        setTheme(AppThemeEnum.DARK);
      }
    }
  }, [user, setTheme, systemPrefersDark]);

  return (
    <Select
      allowClear={false}
      value={user.profile?.theme}
      showSearch={false}
      disabled={updateUserTheme.isLoading}
      onChange={(value) => {
        updateUserTheme.mutate({ theme: value });
      }}
      options={[
        {
          label: (
            <>
              <SunOutlined /> Claro
            </>
          ),
          value: UserThemeEnum.LIGHT,
        },
        {
          label: (
            <>
              <MoonOutlined /> Oscuro
            </>
          ),
          value: UserThemeEnum.DARK,
        },
        {
          label: (
            <>
              <InteractionOutlined /> Automático
            </>
          ),
          value: UserThemeEnum.AUTO,
        },
      ]}
    />
  );
};
