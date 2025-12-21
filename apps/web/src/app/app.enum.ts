export const APP_ROUTES = {
  DUES_DETAIL: '/dues/:id',
  DUES_LIST: '/dues',
  DUES_NEW: '/dues/new',
  HOME: '/',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  MEMBERS_DETAIL: '/members/:id',
  MEMBERS_LIST: '/members',
  MEMBERS_NEW: '/members/new',
  MOVEMENTS_LIST: '/movements',
  MOVEMENTS_NEW: '/movements/new',
  PAYMENTS_DETAIL: '/payments/:id',
  PAYMENTS_LIST: '/payments',
  PAYMENTS_NEW: '/payments/new',
  PROFILE: '/profile',
  USERS_DETAIL: '/users/:id',
  USERS_LIST: '/users',
  USERS_NEW: '/users/new',
} as const;

export type AppRoutes = typeof APP_ROUTES;
