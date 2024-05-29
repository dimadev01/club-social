export enum DueStatusEnum {
  PAID = 'paid',
  PARTIALLY_PAID = 'partially-paid',
  PENDING = 'pending',
}

export const DueStatusLabel = {
  [DueStatusEnum.PAID]: 'Pagado',
  [DueStatusEnum.PARTIALLY_PAID]: 'Parcialmente pago',
  [DueStatusEnum.PENDING]: 'Pendiente',
};

export const DueStatusColor = {
  [DueStatusEnum.PAID]: 'green',
  [DueStatusEnum.PARTIALLY_PAID]: '',
  [DueStatusEnum.PENDING]: '',
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
