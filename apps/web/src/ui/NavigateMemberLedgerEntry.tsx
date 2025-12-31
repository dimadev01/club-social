import { DateFormat } from '@club-social/shared/lib';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';

interface Props {
  date: string;
  id: string;
}

export function NavigateMemberLedgerEntry({ date, id }: Props) {
  return (
    <Link to={appRoutes.memberLedger.view(id)}>{DateFormat.date(date)}</Link>
  );
}
