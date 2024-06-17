import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';

export enum DueStatusEnum {
  PAID = 'paid',
  PARTIALLY_PAID = 'partially-paid',
  PENDING = 'pending',
  VOIDED = 'voided',
}

export const DueStatusLabel: {
  [key in DueStatusEnum]: string;
} = {
  [DueStatusEnum.PAID]: 'Pagado',
  [DueStatusEnum.PARTIALLY_PAID]: 'Parcialmente pago',
  [DueStatusEnum.PENDING]: 'Pendiente',
  [DueStatusEnum.VOIDED]: 'Anulado',
};

export enum DueCategoryEnum {
  ELECTRICITY = 'electricity',
  GUEST = 'guest',
  MEMBERSHIP = 'membership',
}

export const DueCategoryLabel = {
  [DueCategoryEnum.ELECTRICITY]: 'Luz',
  [DueCategoryEnum.GUEST]: 'Invitado',
  [DueCategoryEnum.MEMBERSHIP]: 'Cuota',
};

export function formatDueCategoryLabel(
  category: DueCategoryEnum,
  date: string,
) {
  if (category === DueCategoryEnum.MEMBERSHIP) {
    return `${DueCategoryLabel[category]} (${new DateUtcVo(date).monthName()})`;
  }

  return DueCategoryLabel[category];
}
