import { UserRole } from '../users';
import { Resource, type RoleStatements, type Statement } from './role.types';

export const statements = {
  [Resource.AUDIT_LOGS]: ['list'],
  [Resource.DUES]: ['create', 'list', 'get', 'update', 'void'],
  [Resource.MEMBERS]: ['create', 'list', 'get', 'update', 'void'],
  [Resource.MOVEMENTS]: ['create', 'list', 'get', 'void'],
  [Resource.PAYMENTS]: ['create', 'list', 'get', 'void'],
  [Resource.USERS]: ['create', 'list', 'get', 'update', 'void'],
} satisfies Statement;

export const roleStatements = {
  [UserRole.ADMIN]: {
    [Resource.AUDIT_LOGS]: ['list'],
    [Resource.DUES]: ['create', 'list', 'get', 'update', 'void'],
    [Resource.MEMBERS]: ['create', 'list', 'get', 'update', 'void'],
    [Resource.MOVEMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.PAYMENTS]: ['create', 'list', 'get', 'void'],
    [Resource.USERS]: ['create', 'list', 'get', 'update', 'void'],
  },
  [UserRole.MEMBER]: {
    [Resource.AUDIT_LOGS]: [],
    [Resource.DUES]: ['get', 'list'],
    [Resource.MEMBERS]: [],
    [Resource.MOVEMENTS]: [],
    [Resource.PAYMENTS]: ['get', 'list'],
    [Resource.USERS]: [],
  },
  [UserRole.STAFF]: {
    [Resource.AUDIT_LOGS]: [],
    [Resource.DUES]: ['get', 'create', 'update', 'void', 'list'],
    [Resource.MEMBERS]: ['get', 'create', 'update', 'list'],
    [Resource.MOVEMENTS]: ['get', 'create', 'void', 'list'],
    [Resource.PAYMENTS]: ['get', 'create', 'void', 'list'],
    [Resource.USERS]: ['get', 'update', 'list'],
  },
} satisfies RoleStatements;
