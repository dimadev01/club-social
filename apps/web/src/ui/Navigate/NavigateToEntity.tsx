import { DateFormat, DateFormats } from '@club-social/shared/lib';
import { Link, type LinkProps } from 'react-router';

export interface NavigateToEntityProps extends Omit<LinkProps, 'to'> {
  dateFormat?: DateFormats;
  formatDate?: boolean;
  id: string;
  view: (id: string) => string;
}

export function NavigateToEntityProps({
  children,
  dateFormat = DateFormats.date,
  formatDate = true,
  id,
  view,
  ...props
}: NavigateToEntityProps) {
  return (
    <Link to={view(id)} {...props}>
      {formatDate
        ? DateFormat.format(children as string, dateFormat)
        : children}
    </Link>
  );
}
