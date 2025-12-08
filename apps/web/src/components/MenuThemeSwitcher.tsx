import {
  InteractionOutlined,
  MoonOutlined,
  SunOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import {
  APP_THEME_MODE,
  type AppThemeMode,
  useAppContext,
} from '@/app/app.context';

const THEME_ICONS: Record<AppThemeMode, React.ReactNode> = {
  [APP_THEME_MODE.AUTO]: <InteractionOutlined />,
  [APP_THEME_MODE.DARK]: <MoonOutlined />,
  [APP_THEME_MODE.LIGHT]: <SunOutlined />,
} as const;

export function MenuThemeSwitcher() {
  const { setThemeMode, themeMode } = useAppContext();

  return (
    <Dropdown
      menu={{
        items: [
          {
            icon: <SunOutlined />,
            key: APP_THEME_MODE.LIGHT,
            label: 'Claro',
          },
          {
            icon: <MoonOutlined />,
            key: APP_THEME_MODE.DARK,
            label: 'Oscuro',
          },
          {
            icon: <SyncOutlined />,
            key: APP_THEME_MODE.AUTO,
            label: 'Automático',
          },
        ],
        onClick: ({ key }) => {
          setThemeMode(key as AppThemeMode);
        },
      }}
    >
      <Button icon={THEME_ICONS[themeMode]} size="small" type="text" />
    </Dropdown>
  );
}
