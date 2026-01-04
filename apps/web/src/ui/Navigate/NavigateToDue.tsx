import { appRoutes } from '@/app/app.enum';

import { NavigateToEntityProps } from './NavigateToEntity';

export function NavigateToDue({
  ...props
}: Omit<NavigateToEntityProps, 'view'>) {
  return <NavigateToEntityProps view={appRoutes.dues.view} {...props} />;
}
