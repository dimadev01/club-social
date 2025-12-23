import { Action } from '@club-social/shared/roles';
import { Resource } from '@club-social/shared/roles';

import { useHasPermission } from './use-has-permission';

export const usePermissions = () => {
  return {
    auditLogs: {
      list: useHasPermission(Resource.AUDIT_LOGS, Action.LIST),
    } as const,
    dues: {
      create: useHasPermission(Resource.DUES, Action.CREATE),
      get: useHasPermission(Resource.DUES, Action.GET),
      list: useHasPermission(Resource.DUES, Action.LIST),
      update: useHasPermission(Resource.DUES, Action.UPDATE),
      void: useHasPermission(Resource.DUES, Action.VOID),
    } as const,
    members: {
      create: useHasPermission(Resource.MEMBERS, Action.CREATE),
      get: useHasPermission(Resource.MEMBERS, Action.GET),
      list: useHasPermission(Resource.MEMBERS, Action.LIST),
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
    payments: {
      create: useHasPermission(Resource.PAYMENTS, Action.CREATE),
      get: useHasPermission(Resource.PAYMENTS, Action.GET),
      list: useHasPermission(Resource.PAYMENTS, Action.LIST),
      update: useHasPermission(Resource.PAYMENTS, Action.UPDATE),
      void: useHasPermission(Resource.PAYMENTS, Action.VOID),
    },
    users: {
      create: useHasPermission(Resource.USERS, Action.CREATE),
      delete: useHasPermission(Resource.USERS, Action.DELETE),
      get: useHasPermission(Resource.USERS, Action.GET),
      list: useHasPermission(Resource.USERS, Action.LIST),
      update: useHasPermission(Resource.USERS, Action.UPDATE),
    } as const,
  } as const;
};
