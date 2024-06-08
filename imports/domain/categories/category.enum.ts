/* eslint-disable typescript-sort-keys/string-enum */
export enum CategoryEnum {
  MembershipIncome = 'membership-income',
  MembershipDebt = 'membership-debt',
  Employee = 'employee',
  CourtRental = 'court-rental',
  Saving = 'saving',
  Parking = 'parking',
  Fair = 'fair',
  Buffet = 'buffet',
  Saloon = 'saloon',
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
  [CategoryEnum.Buffet]: 'Buffet',
  [CategoryEnum.Saloon]: 'Salón',
  [CategoryEnum.GuestIncome]: 'Pago de Invitado',
  [CategoryEnum.GuestDebt]: 'Cobro de Invitado',
  [CategoryEnum.ElectricityIncome]: 'Pago de Luz',
  [CategoryEnum.ElectricityDebt]: 'Cobro de Luz',
  [CategoryEnum.Maintenance]: 'Mantenimiento',
  [CategoryEnum.OtherIncome]: 'Otros ingresos',
  [CategoryEnum.OtherExpense]: 'Otros egresos',
  [CategoryEnum.Parking]: 'Estacionamiento',
  [CategoryEnum.Professor]: 'Profesores',
  [CategoryEnum.Salary]: 'Honorarios',
  [CategoryEnum.Employee]: 'Empleados',
  [CategoryEnum.Saving]: 'Atesoramiento',
  [CategoryEnum.Service]: 'Servicios',
};

export const getCategoryFilters = () =>
  Object.values(CategoryEnum)
    .map((category) => ({
      text: CategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

export enum CategoryTypeEnum {
  Debt = 'debt',
  Income = 'income',
  Expense = 'expense',
}

export const CategoryTypeLabel = {
  [CategoryTypeEnum.Debt]: 'Deuda',
  [CategoryTypeEnum.Income]: 'Ingreso',
  [CategoryTypeEnum.Expense]: 'Egreso',
};

export const getCategoryTypeOptions = () =>
  Object.values(CategoryTypeEnum)
    .filter((category) =>
      [CategoryTypeEnum.Expense, CategoryTypeEnum.Income].includes(category),
    )
    .map((category) => ({
      label: CategoryTypeLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypeFilters = {
  [CategoryTypeEnum.Debt]: [
    CategoryEnum.ElectricityDebt,
    CategoryEnum.MembershipDebt,
    CategoryEnum.GuestDebt,
  ],
  [CategoryTypeEnum.Income]: [
    CategoryEnum.ElectricityIncome,
    CategoryEnum.MembershipIncome,
    CategoryEnum.GuestIncome,
    CategoryEnum.CourtRental,
    CategoryEnum.Fair,
    CategoryEnum.Buffet,
    CategoryEnum.Saloon,
    CategoryEnum.Parking,
    CategoryEnum.Professor,
    CategoryEnum.OtherIncome,
  ],
  [CategoryTypeEnum.Expense]: [
    CategoryEnum.Expense,
    CategoryEnum.Salary,
    CategoryEnum.Saving,
    CategoryEnum.Service,
    CategoryEnum.Maintenance,
    CategoryEnum.OtherExpense,
    CategoryEnum.Employee,
  ],
};

export const getCategoryOptions = (categoryType: CategoryTypeEnum) =>
  CategoryTypeFilters[categoryType]
    .filter(
      (category) =>
        ![
          CategoryEnum.MembershipIncome,
          CategoryEnum.GuestIncome,
          CategoryEnum.ElectricityIncome,
        ].includes(category),
    )
    .map((category) => ({
      label: CategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypes = {
  [CategoryEnum.MembershipIncome]: CategoryTypeEnum.Income,
  [CategoryEnum.MembershipDebt]: CategoryTypeEnum.Debt,
  [CategoryEnum.CourtRental]: CategoryTypeEnum.Income,
  [CategoryEnum.Expense]: CategoryTypeEnum.Expense,
  [CategoryEnum.Fair]: CategoryTypeEnum.Income,
  [CategoryEnum.Saloon]: CategoryTypeEnum.Income,
  [CategoryEnum.Buffet]: CategoryTypeEnum.Income,
  [CategoryEnum.GuestIncome]: CategoryTypeEnum.Income,
  [CategoryEnum.GuestDebt]: CategoryTypeEnum.Debt,
  [CategoryEnum.ElectricityIncome]: CategoryTypeEnum.Income,
  [CategoryEnum.ElectricityDebt]: CategoryTypeEnum.Debt,
  [CategoryEnum.Maintenance]: CategoryTypeEnum.Expense,
  [CategoryEnum.Employee]: CategoryTypeEnum.Expense,
  [CategoryEnum.OtherIncome]: CategoryTypeEnum.Income,
  [CategoryEnum.OtherExpense]: CategoryTypeEnum.Expense,
  [CategoryEnum.Parking]: CategoryTypeEnum.Income,
  [CategoryEnum.Professor]: CategoryTypeEnum.Income,
  [CategoryEnum.Salary]: CategoryTypeEnum.Expense,
  [CategoryEnum.Saving]: CategoryTypeEnum.Expense,
  [CategoryEnum.Service]: CategoryTypeEnum.Expense,
};

export const MemberCategories = [
  CategoryEnum.MembershipDebt,
  CategoryEnum.MembershipIncome,
  CategoryEnum.ElectricityDebt,
  CategoryEnum.ElectricityIncome,
  CategoryEnum.GuestDebt,
  CategoryEnum.GuestIncome,
];

export const getMemberCategoryFilters = () =>
  Object.values(MemberCategories)
    .map((category) => ({
      text: CategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
