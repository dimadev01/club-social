import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const useMovementsPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.MOVEMENTS);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.MOVEMENTS);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.MOVEMENTS);

  const canVoid = useIsInRole(PermissionEnum.VOID, ScopeEnum.PAYMENTS);

  return { create, read, update, void: canVoid };
};
