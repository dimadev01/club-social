export enum DueStatusEnum {
  Canceled = 'canceled',
  Paid = 'paid',
  Pending = 'pending',
}

export const DueStatusLabel = {
  [DueStatusEnum.Canceled]: 'Cancelado',
  [DueStatusEnum.Paid]: 'Pagado',
  [DueStatusEnum.Pending]: 'Pendiente',
};

export const getDueStatusColumnFilters = () =>
  Object.values(DueStatusEnum)
    .map((category) => ({
      text: DueStatusLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

export enum DueCategoryEnum {
  Electricity = 'electricity',
  Guest = 'guest',
  Membership = 'membership',
}

export const DueCategoryLabel = {
  [DueCategoryEnum.Electricity]: 'Luz',
  [DueCategoryEnum.Guest]: 'Invitado',
  [DueCategoryEnum.Membership]: 'Cuota',
};

export const getDueCategoryOptions = () =>
  Object.values(DueCategoryEnum)
    .map((category) => ({
      label: DueCategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
