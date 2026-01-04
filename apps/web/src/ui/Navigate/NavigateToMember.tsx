import { UserRole } from '@club-social/shared/users';

import { appRoutes } from '@/app/app.enum';
import { useSessionUser } from '@/auth/useUser';

import { NavigateToEntityProps } from './NavigateToEntity';

export function NavigateToMember({
  ...props
}: Omit<NavigateToEntityProps, 'view'>) {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return props.children;
  }

  return (
    <NavigateToEntityProps
      formatDate={false}
      view={appRoutes.members.view}
      {...props}
    />
  );
}
