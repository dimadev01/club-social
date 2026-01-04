import { appRoutes } from '@/app/app.enum';

import { NavigateToEntityProps } from './NavigateToEntity';

export function NavigateToMovement({
  ...props
}: Omit<NavigateToEntityProps, 'view'>) {
  return <NavigateToEntityProps view={appRoutes.movements.view} {...props} />;
}
