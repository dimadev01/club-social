/* eslint-disable typescript-sort-keys/string-enum */
export enum MovementCategoryEnum {
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
  MemberIncome = 'member-income',
  Service = 'service',
}

export const MovementCategoryEnumLabel: {
  [key in MovementCategoryEnum]: string;
} = {
  [MovementCategoryEnum.MembershipIncome]: 'Pago de Cuota',
  [MovementCategoryEnum.MembershipDebt]: 'Cobro de Cuota',
  [MovementCategoryEnum.CourtRental]: 'Alquiler de cancha',
  [MovementCategoryEnum.Expense]: 'Gastos',
  [MovementCategoryEnum.Fair]: 'Ferias',
  [MovementCategoryEnum.Buffet]: 'Buffet',
  [MovementCategoryEnum.Saloon]: 'Salón',
  [MovementCategoryEnum.GuestIncome]: 'Pago de Invitado',
  [MovementCategoryEnum.GuestDebt]: 'Cobro de Invitado',
  [MovementCategoryEnum.ElectricityIncome]: 'Pago de Luz',
  [MovementCategoryEnum.ElectricityDebt]: 'Cobro de Luz',
  [MovementCategoryEnum.Maintenance]: 'Mantenimiento',
  [MovementCategoryEnum.MemberIncome]: 'Pago de socio',
  [MovementCategoryEnum.OtherIncome]: 'Otros ingresos',
  [MovementCategoryEnum.OtherExpense]: 'Otros egresos',
  [MovementCategoryEnum.Parking]: 'Estacionamiento',
  [MovementCategoryEnum.Professor]: 'Profesores',
  [MovementCategoryEnum.Salary]: 'Honorarios',
  [MovementCategoryEnum.Employee]: 'Empleados',
  [MovementCategoryEnum.Saving]: 'Atesoramiento',
  [MovementCategoryEnum.Service]: 'Servicios',
};

export const getCategoryFilters = () =>
  Object.values(MovementCategoryEnum)
    .map((category) => ({
      text: MovementCategoryEnumLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

export enum MovementTypeEnum {
  Debt = 'debt',
  Income = 'income',
  Expense = 'expense',
}

export const CategoryTypeLabel = {
  [MovementTypeEnum.Debt]: 'Deuda',
  [MovementTypeEnum.Income]: 'Ingreso',
  [MovementTypeEnum.Expense]: 'Egreso',
};

export const getCategoryTypeOptions = () =>
  Object.values(MovementTypeEnum)
    .filter((category) =>
      [MovementTypeEnum.Expense, MovementTypeEnum.Income].includes(category),
    )
    .map((category) => ({
      label: CategoryTypeLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypeFilters = {
  [MovementTypeEnum.Debt]: [
    MovementCategoryEnum.ElectricityDebt,
    MovementCategoryEnum.MembershipDebt,
    MovementCategoryEnum.GuestDebt,
  ],
  [MovementTypeEnum.Income]: [
    MovementCategoryEnum.ElectricityIncome,
    MovementCategoryEnum.MembershipIncome,
    MovementCategoryEnum.GuestIncome,
    MovementCategoryEnum.CourtRental,
    MovementCategoryEnum.Fair,
    MovementCategoryEnum.Buffet,
    MovementCategoryEnum.Saloon,
    MovementCategoryEnum.Parking,
    MovementCategoryEnum.Professor,
    MovementCategoryEnum.OtherIncome,
  ],
  [MovementTypeEnum.Expense]: [
    MovementCategoryEnum.Expense,
    MovementCategoryEnum.Salary,
    MovementCategoryEnum.Saving,
    MovementCategoryEnum.Service,
    MovementCategoryEnum.Maintenance,
    MovementCategoryEnum.OtherExpense,
    MovementCategoryEnum.Employee,
  ],
};

export const getCategoryOptions = (categoryType: MovementTypeEnum) =>
  CategoryTypeFilters[categoryType]
    .filter(
      (category) =>
        ![
          MovementCategoryEnum.MembershipIncome,
          MovementCategoryEnum.GuestIncome,
          MovementCategoryEnum.ElectricityIncome,
        ].includes(category),
    )
    .map((category) => ({
      label: MovementCategoryEnumLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const CategoryTypes = {
  [MovementCategoryEnum.MembershipIncome]: MovementTypeEnum.Income,
  [MovementCategoryEnum.MembershipDebt]: MovementTypeEnum.Debt,
  [MovementCategoryEnum.CourtRental]: MovementTypeEnum.Income,
  [MovementCategoryEnum.Expense]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.Fair]: MovementTypeEnum.Income,
  [MovementCategoryEnum.Saloon]: MovementTypeEnum.Income,
  [MovementCategoryEnum.Buffet]: MovementTypeEnum.Income,
  [MovementCategoryEnum.GuestIncome]: MovementTypeEnum.Income,
  [MovementCategoryEnum.GuestDebt]: MovementTypeEnum.Debt,
  [MovementCategoryEnum.ElectricityIncome]: MovementTypeEnum.Income,
  [MovementCategoryEnum.ElectricityDebt]: MovementTypeEnum.Debt,
  [MovementCategoryEnum.Maintenance]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.Employee]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.OtherIncome]: MovementTypeEnum.Income,
  [MovementCategoryEnum.OtherExpense]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.Parking]: MovementTypeEnum.Income,
  [MovementCategoryEnum.Professor]: MovementTypeEnum.Income,
  [MovementCategoryEnum.Salary]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.Saving]: MovementTypeEnum.Expense,
  [MovementCategoryEnum.Service]: MovementTypeEnum.Expense,
};

export const MemberCategories = [
  MovementCategoryEnum.MembershipDebt,
  MovementCategoryEnum.MembershipIncome,
  MovementCategoryEnum.ElectricityDebt,
  MovementCategoryEnum.ElectricityIncome,
  MovementCategoryEnum.GuestDebt,
  MovementCategoryEnum.GuestIncome,
];

export const getMemberCategoryFilters = () =>
  Object.values(MemberCategories)
    .map((category) => ({
      text: MovementCategoryEnumLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
