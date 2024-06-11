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

export const getDueStatusColumnFilters = () =>
  Object.values(DueStatusEnum)
    .map((category) => ({
      text: DueStatusLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

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

export const getDueCategoryOptions = () =>
  Object.values(DueCategoryEnum)
    .map((category) => ({
      label: DueCategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const getDueCategoryFilters = () =>
  Object.values(DueCategoryEnum)
    .map((category) => ({
      text: DueCategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
