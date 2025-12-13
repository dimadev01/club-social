import type { Action, Resource } from '@club-social/shared/roles';
import type { UserRole } from '@club-social/shared/users';

import { useUser } from '@/auth/useUser';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function useHasPermission(resource: Resource, action: Action): boolean {
  const user = useUser();

  return betterAuthClient.admin.checkRolePermission({
    permission: { [resource]: [action] },
    role: user.role as UserRole,
  });
}
