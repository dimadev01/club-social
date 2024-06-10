import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useUserContext } from '@ui/providers/UserContext';

export function useIsInRole(permission: PermissionEnum, scope: ScopeEnum) {
  const { user } = useUserContext();

  if (!user) {
    return false;
  }

  return Roles.userIsInRole(user, permission, scope);
}

export function useIsInRoleFn() {
  const { user } = useUserContext();

  if (!user) {
    return () => false;
  }

  return (permission: PermissionEnum, scope: ScopeEnum) =>
    Roles.userIsInRole(user, permission, scope);
}
