/* eslint-disable typescript-sort-keys/string-enum */
export enum CategoryEnum {
  MembershipIncome = 'membership-income',
  MembershipDebt = 'membership-debt',
  Employee = 'employee',
  CourtRental = 'court-rental',
  Rental = 'rental',
  Saving = 'saving',
  Parking = 'parking',
  Fair = 'fair',
  Expense = 'expense',
  Salary = 'salary',
  GuestIncome = 'guest-income',
  GuestDebt = 'guest-debt',
  ElectricityIncome = 'electricity-income',
  ElectricityDebt = 'electricity-debt',
  Maintenance = 'maintenance',
  OtherExpense = 'other-expense',
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
  [CategoryEnum.GuestIncome]: 'Pago de Invitado',
  [CategoryEnum.GuestDebt]: 'Cobro de Invitado',
  [CategoryEnum.ElectricityIncome]: 'Pago de Luz',
  [CategoryEnum.ElectricityDebt]: 'Cobro de Luz',
  [CategoryEnum.Maintenance]: 'Mantenimiento',
  [CategoryEnum.OtherIncome]: 'Otros ingresos',
  [CategoryEnum.OtherExpense]: 'Otros egresos',
  [CategoryEnum.Parking]: 'Estacionamiento',
  [CategoryEnum.Professor]: 'Profesores',
  [CategoryEnum.Rental]: 'Alquileres',
  [CategoryEnum.Salary]: 'Honorarios',
  [CategoryEnum.Employee]: 'Empleados',
  [CategoryEnum.Saving]: 'Atesoramiento',
  [CategoryEnum.Service]: 'Servicios',
};

export const CategoryPrices = {
  [CategoryEnum.MembershipIncome]: 4600,
  [CategoryEnum.MembershipDebt]: 4600,
  [CategoryEnum.CourtRental]: 1500,
  [CategoryEnum.Expense]: null,
  [CategoryEnum.Fair]: 46000,
  [CategoryEnum.GuestDebt]: 2000,
  [CategoryEnum.GuestIncome]: 2000,
  [CategoryEnum.ElectricityIncome]: 500,
  [CategoryEnum.ElectricityDebt]: 500,
  [CategoryEnum.Maintenance]: null,
  [CategoryEnum.OtherIncome]: null,
  [CategoryEnum.OtherExpense]: null,
  [CategoryEnum.Parking]: 4000,
  [CategoryEnum.Professor]: null,
  [CategoryEnum.Rental]: null,
  [CategoryEnum.Salary]: null,
  [CategoryEnum.Saving]: null,
  [CategoryEnum.Service]: null,
};

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
    CategoryEnum.ElectricityDebt,
    CategoryEnum.MembershipDebt,
    CategoryEnum.GuestDebt,
  ],
  [CategoryType.Income]: [
    CategoryEnum.ElectricityIncome,
    CategoryEnum.MembershipIncome,
    CategoryEnum.GuestIncome,
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
    CategoryEnum.OtherExpense,
    CategoryEnum.Employee,
  ],
};

export const getCategoryOptions = (categoryType: CategoryType) =>
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
  [CategoryEnum.GuestIncome]: CategoryType.Income,
  [CategoryEnum.GuestDebt]: CategoryType.Debt,
  [CategoryEnum.ElectricityIncome]: CategoryType.Income,
  [CategoryEnum.ElectricityDebt]: CategoryType.Debt,
  [CategoryEnum.Maintenance]: CategoryType.Expense,
  [CategoryEnum.Employee]: CategoryType.Expense,
  [CategoryEnum.OtherIncome]: CategoryType.Income,
  [CategoryEnum.OtherExpense]: CategoryType.Expense,
  [CategoryEnum.Parking]: CategoryType.Income,
  [CategoryEnum.Professor]: CategoryType.Income,
  [CategoryEnum.Rental]: CategoryType.Income,
  [CategoryEnum.Salary]: CategoryType.Expense,
  [CategoryEnum.Saving]: CategoryType.Expense,
  [CategoryEnum.Service]: CategoryType.Expense,
};

export const MemberCategories = [
  CategoryEnum.MembershipDebt,
  CategoryEnum.MembershipIncome,
  CategoryEnum.ElectricityDebt,
  CategoryEnum.ElectricityIncome,
  CategoryEnum.GuestDebt,
  CategoryEnum.GuestIncome,
];
