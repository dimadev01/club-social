/* eslint-disable typescript-sort-keys/string-enum */
export enum AppUrl {
  Home = '/',

  Dues = '/dues',
  DuesDetail = '/dues/:id',
  DuesNew = '/dues/new',

  Enroll = '/enroll-account/:token',
  Login = '/login',
  LoginPasswordless = '/login/passwordless/:email',
  Logout = '/logout',
  VerifyEmail = '/verify-email/:token',

  Members = '/members',
  MembersDetail = '/members/:id',
  MembersNew = '/members/new',

  Movements = '/movements',
  MovementsDetail = '/movements/:id',
  MovementsMigrate = '/movements/:id/migrate',
  MovementsNew = '/movements/new',

  Payments = '/payments',
  PaymentsDetail = '/payments/:id',
  PaymentsNew = '/payments/new',

  Professors = '/professors',

  Employees = '/employees',

  Services = '/services',

  Users = '/users',
  UsersDetail = '/users/:id',
  UsersNew = '/users/new',

  Categories = '/categories',
  CategoriesDetail = '/categories/:id',
}

export enum AppConstants {
  EmailFrom = 'Club Social <info@clubsocialmontegrande.ar>',
}
