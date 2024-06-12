import {
  InteractionOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import invariant from 'tiny-invariant';

import { UserThemeEnum, UserThemeLabel } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppThemeEnum } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { useUpdateUserTheme } from '@ui/hooks/users/useUpdateUserTheme';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const ThemeSelector = () => {
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

  invariant(user.profile);

  const renderIcon = (value: UserThemeEnum) => {
    if (value === UserThemeEnum.AUTO) {
      return <InteractionOutlined />;
    }

    if (value === UserThemeEnum.LIGHT) {
      return <SunOutlined />;
    }

    if (value === UserThemeEnum.DARK) {
      return <MoonOutlined />;
    }

    return null;
  };

  const renderItem = (value: UserThemeEnum) => {
    if (value === UserThemeEnum.AUTO) {
      return (
        <Space>
          {renderIcon(value)}
          {UserThemeLabel[UserThemeEnum.AUTO]}
        </Space>
      );
    }

    if (value === UserThemeEnum.LIGHT) {
      return (
        <Space>
          {renderIcon(value)}
          {UserThemeLabel[UserThemeEnum.LIGHT]}
        </Space>
      );
    }

    if (value === UserThemeEnum.DARK) {
      return (
        <Space>
          {renderIcon(value)}
          {UserThemeLabel[UserThemeEnum.DARK]}
        </Space>
      );
    }

    return null;
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: UserThemeEnum.LIGHT,
            label: renderItem(UserThemeEnum.LIGHT),
          },
          {
            key: UserThemeEnum.DARK,
            label: renderItem(UserThemeEnum.DARK),
          },
          {
            key: UserThemeEnum.AUTO,
            label: renderItem(UserThemeEnum.AUTO),
          },
        ],
        onClick: ({ key }) =>
          updateUserTheme.mutate({ theme: key as UserThemeEnum }),
        selectable: true,
        selectedKeys: [user.profile.theme],
      }}
    >
      <Button icon={renderIcon(user.profile.theme)} type="text" />
    </Dropdown>
  );
};
