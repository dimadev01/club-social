import { Role } from './role.enum';

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
  MEMBER: 'member',
  MOVEMENT: 'movement',
  PAYMENT: 'payment',
  USER: 'user',
} as const;

export type Resource = (typeof Resource)[keyof typeof Resource];

export type RoleStatements = Record<Role, Statement>;

export type Statement = Record<Resource, Action[]>;
