import { Action } from '@club-social/shared/roles';
import { Resource } from '@club-social/shared/roles';

import { useHasPermission } from './use-has-permission';

export const usePermissions = () => {
  return {
    dues: useHasPermission(Resource.DUES, Action.LIST),
    members: {
      create: useHasPermission(Resource.MEMBERS, Action.CREATE),
      delete: useHasPermission(Resource.MEMBERS, Action.DELETE),
      get: useHasPermission(Resource.MEMBERS, Action.GET),
      list: useHasPermission(Resource.MEMBERS, Action.LIST),
      update: useHasPermission(Resource.MEMBERS, Action.UPDATE),
    } as const,
    movements: useHasPermission(Resource.MOVEMENTS, Action.LIST),
    payments: useHasPermission(Resource.PAYMENTS, Action.LIST),
    users: {
      create: useHasPermission(Resource.USERS, Action.CREATE),
      delete: useHasPermission(Resource.USERS, Action.DELETE),
      get: useHasPermission(Resource.USERS, Action.GET),
      list: useHasPermission(Resource.USERS, Action.LIST),
      update: useHasPermission(Resource.USERS, Action.UPDATE),
    } as const,
  } as const;
};
