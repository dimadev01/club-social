import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const useUsersPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.USERS);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.USERS);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.USERS);

  return { create, read, update };
};
