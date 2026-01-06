import {
  InteractionOutlined,
  MoonOutlined,
  SunOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Theme } from '@club-social/shared/users';
import { Button, Dropdown } from 'antd';

import { useAppContext } from '@/app/AppContext';

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  [Theme.AUTO]: <InteractionOutlined />,
  [Theme.DARK]: <MoonOutlined />,
  [Theme.LIGHT]: <SunOutlined />,
} as const;

export function MenuThemeSwitcher() {
  const { preferences, updatePreferences } = useAppContext();

  return (
    <Dropdown
      menu={{
        items: [
          {
            icon: <SunOutlined />,
            key: Theme.LIGHT,
            label: 'Claro',
          },
          {
            icon: <MoonOutlined />,
            key: Theme.DARK,
            label: 'Oscuro',
          },
          {
            icon: <SyncOutlined />,
            key: Theme.AUTO,
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
