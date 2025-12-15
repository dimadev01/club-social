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
  const { appThemeMode: themeMode, setAppThemeMode: setThemeMode } =
    useAppContext();

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
          setThemeMode(key as AppThemeMode);
        },
        selectable: true,
        selectedKeys: [themeMode],
      }}
    >
      <Button icon={THEME_ICONS[themeMode]} size="small" type="text" />
    </Dropdown>
  );
}
