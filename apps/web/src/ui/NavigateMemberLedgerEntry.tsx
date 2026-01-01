import { DateFormat, DateFormats } from '@club-social/shared/lib';
import { Link, type LinkProps } from 'react-router';

import { appRoutes } from '@/app/app.enum';

interface Props extends Omit<LinkProps, 'to'> {
  dateFormat?: DateFormats;
  formatDate?: boolean;
  id: string;
}

export function NavigateMemberLedgerEntry({
  children,
  dateFormat = DateFormats.date,
  formatDate = true,
  id,
  ...props
}: Props) {
  return (
    <Link to={appRoutes.memberLedger.view(id)} {...props}>
      {formatDate
        ? DateFormat.format(children as string, dateFormat)
        : children}
    </Link>
  );
}
