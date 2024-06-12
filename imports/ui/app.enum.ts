export enum AppThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

/* eslint-disable typescript-sort-keys/string-enum */
export enum AppUrl {
  Home = '/',

  DUES = '/dues',
  DUES_DETAIL = '/dues/:id',
  DUES_NEW = '/dues/new',
  DUES_EDIT = '/dues/:id/edit',

  ENROLL = '/enroll-account/:token',
  LOGIN = '/login',
  LOGIN_PASSWORDLESS = '/login/passwordless/:email',
  LOGOUT = '/logout',
  VERIFY_EMAIL = '/verify-email/:token',

  MEMBERS = '/members',
  MEMBERS_DETAIL = '/members/:id',
  MEMBERS_NEW = '/members/new',

  MOVEMENTS = '/movements',
  MOVEMENTS_DETAIL = '/movements/:id',
  MOVEMENTS_NEW = '/movements/new',
  MOVEMENTS_EDIT = '/movements/:id/edit',

  PAYMENTS = '/payments',
  PAYMENTS_DETAIL = '/payments/:id',
  PAYMENTS_NEW = '/payments/new',

  PROFESSORS = '/professors',

  EMPLOYEES = '/employees',

  SERVICES = '/services',

  USERS = '/users',
  USERS_DETAIL = '/users/:id',
  USERS_NEW = '/users/new',

  CATEGORIES = '/categories',
  CATEGORIES_DETAIL = '/categories/:id',
}
