import { UserRole } from '../users';

export const Action = {
  CREATE: 'create',
  DELETE: 'delete',
  GET: 'get',
  LIST: 'list',
  UPDATE: 'update',
  VOID: 'void',
} as const;

export type Action = (typeof Action)[keyof typeof Action];

export const Resource = {
  AUDIT_LOGS: 'audit-logs',
  DUES: 'dues',
  MEMBER_LEDGER: 'member-ledger',
  MEMBERS: 'members',
  MOVEMENTS: 'movements',
  PAYMENTS: 'payments',
  PRICING: 'pricing',
  USERS: 'users',
} as const;

export type Resource = (typeof Resource)[keyof typeof Resource];

export type RoleStatements = Record<UserRole, Statement>;

export type Statement = Record<Resource, Action[]>;
