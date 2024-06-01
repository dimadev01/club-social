export enum MeteorMethodEnum {
  DuesCreate = 'dues/create',
  DuesDelete = 'dues/delete',
  DuesGet = 'dues/get',
  DuesGetGrid = 'dues/getGrid',
  DuesGetPaid = 'dues/getPaid',
  DuesGetPendingByMember = 'dues/getPendingByMember',
  DuesRestore = 'dues/restore',

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
  PaymentsDelete = 'payments/delete',
  PaymentsGet = 'payments/get',
  PaymentsGetGrid = 'payments/getGrid',
  PaymentsGetPaid = 'payments/getPaid',

  UsersGetByToken = 'users/getByToken',
  UsersUpdateTheme = 'users/updateTheme',
}
