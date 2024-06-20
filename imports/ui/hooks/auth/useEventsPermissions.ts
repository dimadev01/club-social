import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export const useEventsPermissions = () => {
  const read = useIsInRole(PermissionEnum.READ, ScopeEnum.EVENTS);

  const create = useIsInRole(PermissionEnum.CREATE, ScopeEnum.EVENTS);

  const update = useIsInRole(PermissionEnum.UPDATE, ScopeEnum.EVENTS);

  return { create, read, update };
};
