import type { Action, Resource } from '@club-social/shared/roles';

import { useEffect, useState } from 'react';

import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function useHasPermission(resource: Resource, action: Action) {
  const { data: session } = betterAuthClient.useSession();

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const hasPermission = async () => {
      const { data } = await betterAuthClient.admin.hasPermission({
        permission: { [resource]: [action] },
        userId: session?.user.id,
      });

      console.log({ data });

      setHasPermission(data?.success ?? false);
    };

    hasPermission();
  }, [session, resource, action]);

  return hasPermission;
}
