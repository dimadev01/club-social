import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useUserContext } from '@ui/providers/UserContext';

export function useIsInRole() {
  const { user } = useUserContext();

  if (!user) {
    return () => false;
  }

  return (permission: PermissionEnum, scope: ScopeEnum) =>
    Roles.userIsInRole(user, permission, scope);
}
