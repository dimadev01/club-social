export enum MeteorMethodEnum {
  DuesCreate = 'dues/create',
  DuesGet = 'dues/get',
  DuesGetGrid = 'dues/getGrid',
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
  MovementsGet = 'movements/get',
  MovementsGetGrid = 'movements/getGrid',
  MovementsRestore = 'movements/restore',

  PaymentsCreate = 'payments/create',
  PaymentsGet = 'payments/get',
  PaymentsGetGrid = 'payments/getGrid',
  PaymentsVoid = 'payments/void',

  UsersGetByToken = 'users/getByToken',
  UsersUpdateTheme = 'users/updateTheme',
}
