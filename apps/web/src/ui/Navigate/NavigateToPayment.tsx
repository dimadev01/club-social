import { appRoutes } from '@/app/app.enum';

import { NavigateToEntityProps } from './NavigateToEntity';

export function NavigateToPayment({
  ...props
}: Omit<NavigateToEntityProps, 'view'>) {
  return <NavigateToEntityProps view={appRoutes.payments.view} {...props} />;
}
