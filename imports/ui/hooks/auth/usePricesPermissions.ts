import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const usePricesPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.PRICES);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.PRICES);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.PRICES);

  return { create, read, update };
};
