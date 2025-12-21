export const APP_ROUTES = {
  DUES: '/dues',
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
  dues: {
    edit: (id?: string) => `/dues/${id}/edit` as const,
    list: '/dues' as const,
    new: '/dues/new' as const,
    view: (id?: string) => `/dues/${id}` as const,
  },
  home: '/' as const,
  login: '/auth/login' as const,
  logout: '/auth/logout' as const,
  members: {
    edit: (id?: string) => `/members/${id}/edit` as const,
    list: '/members' as const,
    new: '/members/new' as const,
    view: (id?: string) => `/members/${id}` as const,
  },
  movements: {
    list: '/movements' as const,
    new: '/movements/new' as const,
  },
  notFound: '*' as const,
  payments: {
    edit: (id?: string) => `/payments/${id}/edit` as const,
    list: '/payments' as const,
    new: '/payments/new' as const,
    view: (id?: string) => `/payments/${id}` as const,
  },
  profile: '/profile' as const,
  users: {
    edit: (id?: string) => `/users/${id}/edit` as const,
    list: '/users' as const,
    new: '/users/new' as const,
    view: (id?: string) => `/users/${id}` as const,
  },
};
