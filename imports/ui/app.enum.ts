/* eslint-disable typescript-sort-keys/string-enum */
export enum AppUrl {
  Home = '/',

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
  MovementsNew = '/movements/new',

  Professors = '/professors',

  Employees = '/employees',

  Services = '/services',

  Rentals = '/rentals',

  Users = '/users',
  UsersDetail = '/users/:id',
  UsersNew = '/users/new',

  Categories = '/categories',
}
