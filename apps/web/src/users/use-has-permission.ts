import type { Action, Resource } from '@club-social/shared/roles';
import type { UserRole } from '@club-social/shared/users';

import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function useHasPermission(resource: Resource, action: Action): boolean {
  const { data: session } = betterAuthClient.useSession();

  if (!session?.user.role) {
    return false;
  }

  return betterAuthClient.admin.checkRolePermission({
    permission: { [resource]: [action] },
    role: session.user.role as UserRole,
  });
}
