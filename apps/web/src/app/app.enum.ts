export const APP_ROUTES = {
  DUES_DETAIL: '/dues/:id',
  DUES_LIST: '/dues',
  DUES_NEW: '/dues/new',
  EDIT: ':id/edit',
  HOME: '/',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  MEMBERS_DETAIL: '/members/:id',
  MEMBERS_LIST: '/members',
  MEMBERS_NEW: '/members/new',
  MOVEMENTS_LIST: '/movements',
  MOVEMENTS_NEW: '/movements/new',
  NEW: 'new',
  PAYMENTS: '/payments',
  PAYMENTS_NEW: '/payments/new',
  PROFILE: '/profile',
  USERS_DETAIL: '/users/:id',
  USERS_LIST: '/users',
  USERS_NEW: '/users/new',
  VIEW: ':id',
} as const;

export type AppRoutes = typeof APP_ROUTES;

export const appRoutes = {
  payments: {
    edit: (id?: string) => `/payments/${id}/edit` as const,
    list: '/payments' as const,
    new: '/payments/new' as const,
    view: (id?: string) => `/payments/${id}` as const,
  },
};
