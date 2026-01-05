import { UserRole } from '../users';
import { Resource, type RoleStatements, type Statement } from './role.types';

export const statements = {
  [Resource.AUDIT_LOGS]: ['list'],
  [Resource.DUES]: ['create', 'list', 'get', 'update', 'void'],
  [Resource.MEMBER_LEDGER]: ['create', 'list', 'get'],
  [Resource.MEMBERS]: ['create', 'list', 'get', 'update', 'void'],
  [Resource.MOVEMENTS]: ['create', 'list', 'get', 'void'],
  [Resource.PAYMENTS]: ['create', 'list', 'get', 'void'],
  [Resource.PRICING]: ['create', 'list', 'get', 'update'],
  [Resource.USERS]: ['create', 'list', 'get', 'update', 'void'],
} satisfies Statement;

export const roleStatements = {
  [UserRole.ADMIN]: {
    [Resource.AUDIT_LOGS]: ['list'],
    [Resource.DUES]: ['create', 'list', 'get', 'update', 'void'],
    [Resource.MEMBER_LEDGER]: ['create', 'list', 'get'],
    [Resource.MEMBERS]: ['create', 'list', 'get', 'update'],
    [Resource.MOVEMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.PAYMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.PRICING]: ['create', 'list', 'get', 'update'],
    [Resource.USERS]: ['create', 'list', 'get', 'update'],
  },
  [UserRole.MEMBER]: {
    [Resource.AUDIT_LOGS]: [],
    [Resource.DUES]: ['get', 'list'],
    [Resource.MEMBER_LEDGER]: ['get', 'list'],
    [Resource.MEMBERS]: [],
    [Resource.MOVEMENTS]: [],
    [Resource.PAYMENTS]: ['get', 'list'],
    [Resource.PRICING]: [],
    [Resource.USERS]: [],
  },
  [UserRole.STAFF]: {
    [Resource.AUDIT_LOGS]: ['list'],
    [Resource.DUES]: ['create', 'list', 'get', 'update', 'void'],
    [Resource.MEMBER_LEDGER]: ['create', 'list', 'get'],
    [Resource.MEMBERS]: ['create', 'list', 'get', 'update'],
    [Resource.MOVEMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.PAYMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.PRICING]: ['create', 'list', 'get', 'update'],
    [Resource.USERS]: [],
  },
} satisfies RoleStatements;
