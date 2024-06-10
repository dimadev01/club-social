export enum MeteorMethodEnum {
  DuesCreate = 'dues/create',
  DuesGetGrid = 'dues/getGrid',
  DuesGetOne = 'dues/get',
  DuesGetPending = 'dues/getPending',
  DuesVoid = 'dues/void',

  MembersCreate = 'members/create',
  MembersGet = 'members/get',
  MembersGetGrid = 'members/getGrid',
  MembersGetOne = 'members/getOne',
  MembersGetToExport = 'members/getToExport',
  MembersUpdate = 'members/updateNew',

  MovementsCreate = 'movements/create',
  MovementsDelete = 'movements/delete',
  MovementsGetGrid = 'movements/getGrid',
  MovementsGetOne = 'movements/get',
  MovementsGetToExport = 'movements/getToExport',
  MovementsRestore = 'movements/restore',
  MovementsUpdate = 'movements/update',
  MovementsVoid = 'movements/void',

  PaymentsCreate = 'payments/create',
  PaymentsGetGrid = 'payments/getGrid',
  PaymentsGetOne = 'payments/get',
  PaymentsGetTotals = 'payments/getTotals',
  PaymentsVoid = 'payments/void',

  UsersGetByToken = 'users/getByToken',
  UsersUpdateTheme = 'users/updateTheme',
}
