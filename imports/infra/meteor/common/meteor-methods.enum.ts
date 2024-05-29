export enum MeteorMethodEnum {
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
  DuesGetPendingByMember = 'dues/getPendingByMember',
  DuesRestore = 'dues/restore',

  EmployeesGetAll = 'employees/getAll',

  MembersCreate = 'members/createNew',
  MembersGet = 'members/get',
  MembersGetDuesGrid = 'members/getDuesGrid',
  MembersGetForCsv = 'members/getForCsv',
  MembersGetGrid = 'members/getGrid',
  MembersGetMovementsGrid = 'movements/getMovementsGrid',
  MembersGetNew = 'members/getNew',
  MembersGetPaymentsGrid = 'members/getPaymentsGrid',
  MembersUpdate = 'members/updateNew',

  MovementsCreate = 'movements/create',
  MovementsDelete = 'movements/delete',
  MovementsGet = 'movements/get',
  MovementsGetGrid = 'movements/getGrid',
  MovementsGetNextToMigrate = 'movements/getNextToMigrate',
  MovementsMigrate = 'movements/migrate',
  MovementsRestore = 'movements/restore',
  MovementsUpdate = 'movements/update',

  PaymentsCreate = 'payments/create',
  PaymentsDelete = 'payments/delete',
  PaymentsGet = 'payments/get',
  PaymentsGetGrid = 'payments/getGrid',
  PaymentsGetNextReceiptNumber = 'payments/getNextReceiptNumber',
  PaymentsGetPaid = 'payments/getPaid',

  ProfessorsGetAll = 'professors/getAll',

  ServicesGetAll = 'services/getAll',

  UsersCreate = 'users/create',
  UsersGet = 'users/get',
  UsersGetByToken = 'users/getByToken',
  UsersGetGrid = 'users/getGrid',
  UsersRemove = 'users/remove',
  UsersUpdate = 'users/update',
  UsersUpdateTheme = 'users/updateTheme',
}
