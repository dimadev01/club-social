/* eslint-disable typescript-sort-keys/string-enum */
export enum CategoryEnum {
  MembershipIncome = 'membership-income',
  MembershipDebt = 'membership-debt',
  CourtRental = 'court-rental',
  Rental = 'rental',
  Saving = 'saving',
  Parking = 'parking',
  Fair = 'fair',
  Expense = 'expense',
  Salary = 'salary',
  InviteeIncome = 'invitee-income',
  InviteeDebt = 'invitee-debt',
  LightIncome = 'light-income',
  LightDebt = 'light-debt',
  Maintenance = 'maintenance',
  OtherOutcome = 'other-outcome',
  OtherIncome = 'other-income',
  Professor = 'professor',
  Service = 'service',
}

export const CategoryLabel = {
  [CategoryEnum.MembershipIncome]: 'Pago de Cuota',
  [CategoryEnum.MembershipDebt]: 'Cobro de Cuota',
  [CategoryEnum.CourtRental]: 'Alquiler de cancha',
  [CategoryEnum.Expense]: 'Gastos',
  [CategoryEnum.Fair]: 'Ferias',
  [CategoryEnum.InviteeIncome]: 'Pago de Invitado',
  [CategoryEnum.InviteeDebt]: 'Cobro de Invitado',
  [CategoryEnum.LightIncome]: 'Pago de Luz',
  [CategoryEnum.LightDebt]: 'Cobro de Luz',
  [CategoryEnum.Maintenance]: 'Mantenimiento',
  [CategoryEnum.OtherIncome]: 'Otros ingresos',
  [CategoryEnum.OtherOutcome]: 'Otros egresos',
  [CategoryEnum.Parking]: 'Estacionamiento',
  [CategoryEnum.Professor]: 'Profesores',
  [CategoryEnum.Rental]: 'Alquileres',
  [CategoryEnum.Salary]: 'Honorarios',
  [CategoryEnum.Saving]: 'Atesoramiento',
  [CategoryEnum.Service]: 'Servicios',
};

export const CategoryPrices = {
  [CategoryEnum.MembershipIncome]: 4600,
  [CategoryEnum.MembershipDebt]: -4600,
  [CategoryEnum.CourtRental]: 1500,
  [CategoryEnum.Expense]: null,
  [CategoryEnum.Fair]: 46000,
  [CategoryEnum.InviteeDebt]: -2000,
  [CategoryEnum.InviteeIncome]: 2000,
  [CategoryEnum.LightIncome]: 500,
  [CategoryEnum.LightDebt]: 500,
  [CategoryEnum.Maintenance]: null,
  [CategoryEnum.OtherIncome]: null,
  [CategoryEnum.OtherOutcome]: null,
  [CategoryEnum.Parking]: 4000,
  [CategoryEnum.Professor]: null,
  [CategoryEnum.Rental]: null,
  [CategoryEnum.Salary]: null,
  [CategoryEnum.Saving]: null,
  [CategoryEnum.Service]: null,
};

export const getCategoryOptions = () =>
  Object.values(CategoryEnum).map((category) => ({
    label: CategoryLabel[category],
    value: category,
  }));

export const getCategoryFilters = () =>
  Object.values(CategoryEnum)
    .map((category) => ({
      text: CategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

export enum CategoryType {
  Debt = 'debt',
  Income = 'income',
  Expense = 'expense',
}

export const CategoryTypeLabel = {
  [CategoryType.Debt]: 'Deuda',
  [CategoryType.Income]: 'Ingreso',
  [CategoryType.Expense]: 'Egreso',
};

export const getCategoryTypeOptions = () =>
  Object.values(CategoryType)
    .map((category) => ({
      label: CategoryTypeLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypeFilters = {
  [CategoryType.Debt]: [
    CategoryEnum.LightDebt,
    CategoryEnum.MembershipDebt,
    CategoryEnum.InviteeDebt,
  ],
  [CategoryType.Income]: [
    CategoryEnum.LightIncome,
    CategoryEnum.MembershipIncome,
    CategoryEnum.InviteeIncome,
    CategoryEnum.CourtRental,
    CategoryEnum.Fair,
    CategoryEnum.Parking,
    CategoryEnum.Professor,
    CategoryEnum.Rental,
    CategoryEnum.OtherIncome,
  ],
  [CategoryType.Expense]: [
    CategoryEnum.Expense,
    CategoryEnum.Salary,
    CategoryEnum.Saving,
    CategoryEnum.Service,
    CategoryEnum.Maintenance,
    CategoryEnum.OtherOutcome,
  ],
};

export const getCategoryOptions2 = (categoryType: CategoryType) =>
  CategoryTypeFilters[categoryType]
    .map((category) => ({
      label: CategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypes = {
  [CategoryEnum.MembershipIncome]: CategoryType.Income,
  [CategoryEnum.MembershipDebt]: CategoryType.Debt,
  [CategoryEnum.CourtRental]: CategoryType.Income,
  [CategoryEnum.Expense]: CategoryType.Expense,
  [CategoryEnum.Fair]: CategoryType.Income,
  [CategoryEnum.InviteeIncome]: CategoryType.Income,
  [CategoryEnum.InviteeDebt]: CategoryType.Debt,
  [CategoryEnum.LightIncome]: CategoryType.Income,
  [CategoryEnum.LightDebt]: CategoryType.Debt,
  [CategoryEnum.Maintenance]: CategoryType.Expense,
  [CategoryEnum.OtherIncome]: CategoryType.Income,
  [CategoryEnum.OtherOutcome]: CategoryType.Expense,
  [CategoryEnum.Parking]: CategoryType.Income,
  [CategoryEnum.Professor]: CategoryType.Income,
  [CategoryEnum.Rental]: CategoryType.Income,
  [CategoryEnum.Salary]: CategoryType.Expense,
  [CategoryEnum.Saving]: CategoryType.Expense,
  [CategoryEnum.Service]: CategoryType.Expense,
};
