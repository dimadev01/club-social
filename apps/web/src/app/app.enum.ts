export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER_DETAIL: '/users/:id',
  USER_LIST: '/users',
  USER_NEW: '/users/new',
} as const;

export type AppRoutes = typeof APP_ROUTES;
