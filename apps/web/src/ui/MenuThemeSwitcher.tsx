import type { Theme } from '@club-social/shared/users';

import {
  InteractionOutlined,
  MoonOutlined,
  SunOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { AppThemeMode, useAppContext } from '@/app/AppContext';

const THEME_ICONS: Record<AppThemeMode, React.ReactNode> = {
  [AppThemeMode.AUTO]: <InteractionOutlined />,
  [AppThemeMode.DARK]: <MoonOutlined />,
  [AppThemeMode.LIGHT]: <SunOutlined />,
} as const;

export function MenuThemeSwitcher() {
  const { preferences, updatePreferences } = useAppContext();

  return (
    <Dropdown
      menu={{
        items: [
          {
            icon: <SunOutlined />,
            key: AppThemeMode.LIGHT,
            label: 'Claro',
          },
          {
            icon: <MoonOutlined />,
            key: AppThemeMode.DARK,
            label: 'Oscuro',
          },
          {
            icon: <SyncOutlined />,
            key: AppThemeMode.AUTO,
            label: 'Automático',
          },
        ],
        onClick: ({ key }) => {
          updatePreferences({ theme: key as Theme });
        },
        selectable: true,
        selectedKeys: [preferences.theme],
      }}
    >
      <Button icon={THEME_ICONS[preferences.theme]} size="small" type="text" />
    </Dropdown>
  );
}
