import { roleStatements, statements } from '@club-social/shared/roles';
import { adminClient, magicLinkClient } from 'better-auth/client/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';
import { createAuthClient } from 'better-auth/react';

import { AppConfig } from './app.config';

const ac = createAccessControl({
  ...defaultStatements,
  ...statements,
});

const adminRole = ac.newRole({
  ...adminAc.statements,
  ...roleStatements.admin,
});

const memberRole = ac.newRole({
  ...userAc.statements,
  ...roleStatements.member,
});

const staffRole = ac.newRole({
  ...userAc.statements,
  ...roleStatements.staff,
});

export const betterAuthClient = createAuthClient({
  basePath: '/auth',
  baseURL: AppConfig.apiUrl,

  plugins: [
    magicLinkClient(),
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        member: memberRole,
        staff: staffRole,
      },
    }),
  ],
});
