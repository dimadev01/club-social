/* eslint-disable typescript-sort-keys/string-enum */
export enum MovementStatusEnum {
  REGISTERED = 'registered',
  VOIDED = 'voided',
}

export const MovementStatusLabel: {
  [key in MovementStatusEnum]: string;
} = {
  [MovementStatusEnum.REGISTERED]: 'Registrado',
  [MovementStatusEnum.VOIDED]: 'Anulado',
};

export const getMovementStatusColumnFilters = () =>
  Object.values(MovementStatusEnum).map((status) => ({
    text: MovementStatusLabel[status],
    value: status,
  }));

export enum MovementCategoryEnum {
  EMPLOYEE = 'employee',
  COURT_RENTAL = 'court-rental',
  SAVING = 'saving',
  PARKING = 'parking',
  FAIR = 'fair',
  BUFFET = 'buffet',
  SALOON = 'saloon',
  EXPENSE = 'expense',
  SALARY = 'salary',
  MAINTENANCE = 'maintenance',
  OTHER_EXPENSE = 'other-expense',
  OTHER_INCOME = 'other-income',
  PROFESSOR = 'professor',
  MEMBER_PAYMENT = 'member-payment',
  SERVICE = 'service',
}

export const MovementCategoryLabel: {
  [key in MovementCategoryEnum]: string;
} = {
  [MovementCategoryEnum.COURT_RENTAL]: 'Alquiler de cancha',
  [MovementCategoryEnum.EXPENSE]: 'Gastos',
  [MovementCategoryEnum.FAIR]: 'Ferias',
  [MovementCategoryEnum.BUFFET]: 'Buffet',
  [MovementCategoryEnum.SALOON]: 'Salón',
  [MovementCategoryEnum.MAINTENANCE]: 'Mantenimiento',
  [MovementCategoryEnum.MEMBER_PAYMENT]: 'Pago de socio',
  [MovementCategoryEnum.OTHER_INCOME]: 'Otros ingresos',
  [MovementCategoryEnum.OTHER_EXPENSE]: 'Otros egresos',
  [MovementCategoryEnum.PARKING]: 'Estacionamiento',
  [MovementCategoryEnum.PROFESSOR]: 'Profesores',
  [MovementCategoryEnum.SALARY]: 'Honorarios',
  [MovementCategoryEnum.EMPLOYEE]: 'Empleados',
  [MovementCategoryEnum.SAVING]: 'Atesoramiento',
  [MovementCategoryEnum.SERVICE]: 'Servicios',
};

export const getCategoryFilters = () =>
  Object.values(MovementCategoryEnum)
    .map((category) => ({
      text: MovementCategoryLabel[category],
      value: category,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

export enum MovementTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export const MovementTypeLabel = {
  [MovementTypeEnum.INCOME]: 'Ingreso',
  [MovementTypeEnum.EXPENSE]: 'Egreso',
};

export const getMovementTypeOptions = () =>
  Object.values(MovementTypeEnum).map((type) => ({
    text: MovementTypeLabel[type],
    value: type,
  }));

export const getMovementCategoryTypeOptions = () =>
  Object.values(MovementTypeEnum)
    .filter((category) =>
      [MovementTypeEnum.EXPENSE, MovementTypeEnum.INCOME].includes(category),
    )
    .map((category) => ({
      label: MovementTypeLabel[category],
      value: category,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const MovementCategoryTypeFilters = {
  [MovementTypeEnum.INCOME]: [
    MovementCategoryEnum.COURT_RENTAL,
    MovementCategoryEnum.FAIR,
    MovementCategoryEnum.BUFFET,
    MovementCategoryEnum.SALOON,
    MovementCategoryEnum.PARKING,
    MovementCategoryEnum.PROFESSOR,
    MovementCategoryEnum.OTHER_INCOME,
    MovementCategoryEnum.MEMBER_PAYMENT,
  ],
  [MovementTypeEnum.EXPENSE]: [
    MovementCategoryEnum.EXPENSE,
    MovementCategoryEnum.SALARY,
    MovementCategoryEnum.SAVING,
    MovementCategoryEnum.SERVICE,
    MovementCategoryEnum.MAINTENANCE,
    MovementCategoryEnum.OTHER_EXPENSE,
    MovementCategoryEnum.EMPLOYEE,
  ],
};
