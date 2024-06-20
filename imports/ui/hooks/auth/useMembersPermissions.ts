import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const useMembersPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.MEMBERS);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.MEMBERS);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.MEMBERS);

  return { create, read, update };
};
