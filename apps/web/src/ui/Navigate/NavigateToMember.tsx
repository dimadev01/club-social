import { UserRole } from '@club-social/shared/users';
import { Link, type LinkProps } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useSessionUser } from '@/auth/useUser';

interface Props extends Omit<LinkProps, 'to'> {
  id: string;
}

export function NavigateToMember({ id, ...props }: Props) {
  const user = useSessionUser();

  if (user.role === UserRole.MEMBER) {
    return props.children;
  }

  return <Link to={appRoutes.members.view(id)} {...props} />;
}
