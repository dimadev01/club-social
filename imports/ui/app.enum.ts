export enum AppThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum AppUrl {
  AUTH = '/auth',
  AUTH_LOGIN = 'login',
  AUTH_LOGIN_PASSWORDLESS = 'passwordless/:email',
  AUTH_LOGOUT = 'logout',

  CATEGORIES = 'categories',
  CATEGORIES_DETAIL = 'categories/:id',

  DUES = 'dues',
  DUES_NEW = 'new',

  EMPLOYEES = 'employees',

  ENROLL = 'enroll-account/:token',

  EVENTS = 'events',

  HOME = '/',

  MEMBERS = 'members',

  MOVEMENTS = 'movements',

  PAYMENTS = 'payments',

  PROFESSORS = 'professors',

  SERVICES = 'services',

  USERS = 'users',
  USERS_DETAIL = 'users/:id',
  USERS_NEW = 'users/new',

  VERIFY_EMAIL = 'verify-email/:token',
}

export enum AppUrlGenericEnum {
  EDIT = 'edit',
  ID = ':id',
  NEW = 'new',
}
