import { UserRole } from '@club-social/shared/users';
import { Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router';

import { useSessionUser } from '@/auth/useUser';
import { Page } from '@/ui';

import { AccessTab } from './AccessTab';
import { InterfaceTab } from './InterfaceTab';
import { NotificationsTab } from './NotificationsTab';
import { PasskeysTab } from './PasskeysTab';
import { ProfileTab } from './ProfileTab';

export function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSessionUser();
  const isMember = user.role === UserRole.MEMBER;

  const activeTab = location.hash.slice(1) || 'profile';

  const handleTabChange = (key: string) => {
    navigate(`#${key}`, { replace: true });
  };

  return (
    <Page>
      <Tabs
        activeKey={activeTab}
        items={[
          {
            children: <ProfileTab />,
            key: 'profile',
            label: 'Mis datos',
          },
          {
            children: <AccessTab />,
            key: 'access',
            label: 'Acceso',
          },
          {
            children: <PasskeysTab />,
            key: 'passkeys',
            label: 'Passkeys',
          },
          {
            children: <InterfaceTab />,
            key: 'interface',
            label: 'Interfaz',
          },
          ...(isMember
            ? [
                {
                  children: <NotificationsTab />,
                  key: 'notifications',
                  label: 'Notificaciones',
                },
              ]
            : []),
        ]}
        onChange={handleTabChange}
      />
    </Page>
  );
}
