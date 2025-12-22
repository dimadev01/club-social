export const appRoutes = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  dues: {
    edit: (id?: string) => `/dues/${id}/edit`,
    list: '/dues',
    new: '/dues/new',
    view: (id?: string) => `/dues/${id}`,
  } as const,
  generic: {
    edit: ':id/edit',
    new: 'new',
    view: ':id',
  } as const,
  home: '/',
  login: '/auth/login',
  logout: '/auth/logout',
  members: {
    edit: (id?: string) => `/members/${id}/edit`,
    list: '/members',
    new: '/members/new',
    view: (id?: string) => `/members/${id}`,
  } as const,
  movements: {
    list: '/movements',
    new: '/movements/new',
  } as const,
  notFound: '*',
  payments: {
    edit: (id?: string) => `/payments/${id}/edit`,
    list: '/payments',
    new: '/payments/new',
    view: (id?: string) => `/payments/${id}`,
  } as const,
  profile: '/profile',
  users: {
    edit: (id?: string) => `/users/${id}/edit`,
    list: '/users',
    new: '/users/new',
    view: (id?: string) => `/users/${id}`,
  } as const,
} as const;
