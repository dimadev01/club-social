import { Link, type LinkProps } from 'react-router';

import { appRoutes } from '@/app/app.enum';

interface Props extends Omit<LinkProps, 'to'> {
  id: string;
}

export function NavigateToMember({ id, ...props }: Props) {
  return <Link to={appRoutes.members.view(id)} {...props} />;
}
