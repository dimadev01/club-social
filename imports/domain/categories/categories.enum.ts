/* eslint-disable typescript-sort-keys/string-enum */
export enum CategoryEnum {
  Membership = 'membership',
  CourtRental = 'court-rental',
  Rental = 'rental',
  Saving = 'saving',
  Parking = 'parking',
  Fair = 'fair',
  Expense = 'expense',
  Salary = 'salary',
  Invitee = 'invitee',
  Light = 'light',
  Maintenance = 'maintenance',
  OtherOutcome = 'other-outcome',
  OtherIncome = 'other-income',
  Professor = 'professor',
  Service = 'service',
}

export const CategoryLabel = {
  [CategoryEnum.Membership]: 'Cuota',
  [CategoryEnum.CourtRental]: 'Alquiler de cancha',
  [CategoryEnum.Expense]: 'Gastos',
  [CategoryEnum.Fair]: 'Ferias',
  [CategoryEnum.Invitee]: 'Invitado',
  [CategoryEnum.Light]: 'Luz',
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
  [CategoryEnum.Membership]: 3800,
  [CategoryEnum.CourtRental]: 1500,
  [CategoryEnum.Expense]: null,
  [CategoryEnum.Fair]: 37000,
  [CategoryEnum.Invitee]: 1200,
  [CategoryEnum.Light]: 500,
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
