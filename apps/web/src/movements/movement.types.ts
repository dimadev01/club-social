import { MovementStatus } from '@club-social/shared/movements';

export const MovementStatusColor: Record<MovementStatus, string> = {
  [MovementStatus.REGISTERED]: 'green',
  [MovementStatus.VOIDED]: 'red',
};
