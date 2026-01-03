import { appRoutes } from '@/app/app.enum';

import { NavigateToEntityProps } from './NavigateToEntity';

export function NavigateToMemberLedgerEntry({
  ...props
}: Omit<NavigateToEntityProps, 'view'>) {
  return (
    <NavigateToEntityProps view={appRoutes.memberLedger.view} {...props} />
  );
}
