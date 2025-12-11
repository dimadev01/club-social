import { UserRole } from '../users';

export const Action = {
  CREATE: 'create',
  DELETE: 'delete',
  GET: 'get',
  LIST: 'list',
  UPDATE: 'update',
} as const;

export type Action = (typeof Action)[keyof typeof Action];

export const Resource = {
  DUES: 'dues',
  MEMBERS: 'members',
  MOVEMENTS: 'movements',
  PAYMENTS: 'payments',
  USERS: 'users',
} as const;

export type Resource = (typeof Resource)[keyof typeof Resource];

export type RoleStatements = Record<UserRole, Statement>;

export type Statement = Record<Resource, Action[]>;
