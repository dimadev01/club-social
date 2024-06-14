import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const usePaymentsPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.PAYMENTS);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.PAYMENTS);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.PAYMENTS);

  const canVoid = useIsInRole(PermissionEnum.VOID, ScopeEnum.PAYMENTS);

  return { create, read, update, void: canVoid };
};
