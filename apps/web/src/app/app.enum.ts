export const appRoutes = {
  auth: {
    login: '/auth/login' as const,
    logout: '/auth/logout' as const,
  },
  dues: {
    edit: (id?: string) => `/dues/${id}/edit` as const,
    list: '/dues' as const,
    new: '/dues/new' as const,
    view: (id?: string) => `/dues/${id}` as const,
  },
  generic: {
    edit: ':id/edit' as const,
    new: 'new' as const,
    view: ':id' as const,
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
