import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';

interface Props {
  id: string;
  name: string;
}

export function NavigateMember({ id, name }: Props) {
  return <Link to={appRoutes.members.view(id)}>{name}</Link>;
}
