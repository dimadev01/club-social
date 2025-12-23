import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { DateFormat } from '@/shared/lib/date-format';

interface Props {
  date: string;
  id: string;
}

export function NavigateDue({ date, id }: Props) {
  return <Link to={appRoutes.dues.view(id)}>{DateFormat.date(date)}</Link>;
}
