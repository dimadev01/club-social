import { roleStatements, statements } from '@club-social/shared/roles';
import {
  adminClient,
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins';
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
    inferAdditionalFields({
      user: {
        createdBy: {
          type: 'string',
        },
        deletedAt: {
          type: 'date',
        },
        deletedBy: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        role: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        updatedAt: {
          type: 'date',
        },
        updatedBy: {
          type: 'string',
        },
      },
    }),
  ],
});
