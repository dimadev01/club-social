import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const useDuesPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.DUES);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.DUES);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.DUES);

  const canVoid = useIsInRole(PermissionEnum.VOID, ScopeEnum.PAYMENTS);

  return { create, read, update, void: canVoid };
};
