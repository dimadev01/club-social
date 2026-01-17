import { Action, Resource } from '@club-social/shared/roles';
import { UserRole } from '@club-social/shared/users';

import { useSessionUser } from '@/auth/useUser';

import { useHasPermission } from './use-has-permission';

export const usePermissions = () => {
  const { role } = useSessionUser();

  const isAdmin = role === UserRole.ADMIN;
  const isStaff = role === UserRole.STAFF;
  // const isMember = role === UserRole.MEMBER;

  const canListAll = isAdmin || isStaff;

  return {
    auditLogs: {
      list: useHasPermission(Resource.AUDIT_LOGS, Action.LIST),
    } as const,
    dues: {
      create: useHasPermission(Resource.DUES, Action.CREATE),
      get: useHasPermission(Resource.DUES, Action.GET),
      list: useHasPermission(Resource.DUES, Action.LIST),
      listAll: useHasPermission(Resource.DUES, Action.LIST) && canListAll,
      update: useHasPermission(Resource.DUES, Action.UPDATE),
      void: useHasPermission(Resource.DUES, Action.VOID),
    } as const,
    groups: {
      create: useHasPermission(Resource.GROUPS, Action.CREATE),
      delete: useHasPermission(Resource.GROUPS, Action.DELETE),
      get: useHasPermission(Resource.GROUPS, Action.GET),
      list: useHasPermission(Resource.GROUPS, Action.LIST),
      update: useHasPermission(Resource.GROUPS, Action.UPDATE),
    } as const,
    memberLedger: {
      create: useHasPermission(Resource.MEMBER_LEDGER, Action.CREATE),
      get: useHasPermission(Resource.MEMBER_LEDGER, Action.GET),
      list: useHasPermission(Resource.MEMBER_LEDGER, Action.LIST),
      listAll:
        useHasPermission(Resource.MEMBER_LEDGER, Action.LIST) && canListAll,
    } as const,
    members: {
      create: useHasPermission(Resource.MEMBERS, Action.CREATE),
      get: useHasPermission(Resource.MEMBERS, Action.GET),
      list: useHasPermission(Resource.MEMBERS, Action.LIST),
      listAll: useHasPermission(Resource.MEMBERS, Action.LIST) && canListAll,
      update: useHasPermission(Resource.MEMBERS, Action.UPDATE),
      void: useHasPermission(Resource.MEMBERS, Action.VOID),
    } as const,
    movements: {
      create: useHasPermission(Resource.MOVEMENTS, Action.CREATE),
      get: useHasPermission(Resource.MOVEMENTS, Action.GET),
      list: useHasPermission(Resource.MOVEMENTS, Action.LIST),
      update: useHasPermission(Resource.MOVEMENTS, Action.UPDATE),
      void: useHasPermission(Resource.MOVEMENTS, Action.VOID),
    },
    notifications: {
      get: useHasPermission(Resource.NOTIFICATIONS, Action.GET),
      list: useHasPermission(Resource.NOTIFICATIONS, Action.LIST),
    } as const,
    payments: {
      create: useHasPermission(Resource.PAYMENTS, Action.CREATE),
      get: useHasPermission(Resource.PAYMENTS, Action.GET),
      list: useHasPermission(Resource.PAYMENTS, Action.LIST),
      listAll: useHasPermission(Resource.PAYMENTS, Action.LIST) && canListAll,
      update: useHasPermission(Resource.PAYMENTS, Action.UPDATE),
      void: useHasPermission(Resource.PAYMENTS, Action.VOID),
    },
    pricing: {
      create: useHasPermission(Resource.PRICING, Action.CREATE),
      get: useHasPermission(Resource.PRICING, Action.GET),
      list: useHasPermission(Resource.PRICING, Action.LIST),
      update: useHasPermission(Resource.PRICING, Action.UPDATE),
    } as const,
    users: {
      create: useHasPermission(Resource.USERS, Action.CREATE),
      delete: useHasPermission(Resource.USERS, Action.DELETE),
      get: useHasPermission(Resource.USERS, Action.GET),
      list: useHasPermission(Resource.USERS, Action.LIST),
      update: useHasPermission(Resource.USERS, Action.UPDATE),
    } as const,
  } as const;
};
