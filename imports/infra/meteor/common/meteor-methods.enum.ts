export enum MethodsEnum {
  CategoriesGetAll = 'categories/getAll',
  CategoriesGetAllByType = 'categories/getAllByType',
  CategoriesGetGrid = 'categories/getGrid',
  CategoriesGetOne = 'categories/getOne',
  CategoriesUpdate = 'categories/update',

  DuesCreate = 'dues/create',
  DuesDelete = 'dues/delete',
  DuesGet = 'dues/get',
  DuesGetGrid = 'dues/getGrid',
  DuesGetPaid = 'dues/getPaid',
  DuesGetPending = 'dues/getPending',
  DuesRestore = 'dues/restore',
  DuesUpdate = 'dues/update',

  EmployeesGetAll = 'employees/getAll',

  MembersCreate = 'members/create',
  MembersDelete = 'members/delete',
  MembersGet = 'members/get',
  MembersGetAll = 'members/getAll',
  MembersGetForCsv = 'members/getForCsv',
  MembersGetGrid = 'members/getGrid',
  MembersGetMovementsGrid = 'movements/getMovementsGrid',
  MembersUpdate = 'members/update',

  MovementsCreate = 'movements/create',
  MovementsDelete = 'movements/delete',
  MovementsGet = 'movements/get',
  MovementsGetGrid = 'movements/getGrid',
  MovementsMigrate = 'movements/migrate',
  MovementsRestore = 'movements/restore',
  MovementsUpdate = 'movements/update',

  PaymentsCreate = 'payments/create',
  PaymentsDelete = 'payments/delete',
  PaymentsGet = 'payments/get',
  PaymentsGetGrid = 'payments/getGrid',
  PaymentsGetPaid = 'payments/getPaid',
  PaymentsRestore = 'payments/restore',
  PaymentsUpdate = 'payment/update',

  ProfessorsGetAll = 'professors/getAll',

  ServicesGetAll = 'services/getAll',

  UsersCreate = 'users/create',
  UsersGet = 'users/get',
  UsersGetByToken = 'users/getByToken',
  UsersGetGrid = 'users/getGrid',
  UsersRemove = 'users/remove',
  UsersUpdate = 'users/update',
}
