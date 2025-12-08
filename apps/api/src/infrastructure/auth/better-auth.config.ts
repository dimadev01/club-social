import { UserRole } from '@club-social/types/users';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth/minimal';
import { admin as adminPlugin, magicLink } from 'better-auth/plugins';

import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';

import { prisma } from '../prisma/prisma.client';

/**
 * This needs to be named `auth` because the `@better-auth/cli` expects
 * this variable name. See https://www.better-auth.com/docs/concepts/cli
 */
export const auth = betterAuth({
  advanced: {
    cookiePrefix: 'cs',
    database: {
      generateId: () => UniqueId.generate().value,
    },
  },
  basePath: '/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: false,
  },
  experimental: {
    joins: true,
  },
  plugins: [
    adminPlugin({
      adminRoles: [UserRole.ADMIN],
    }),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, token, url }) => {
        console.log({ email, token, url });
      },
    }),
  ],
  trustedOrigins: ['http://localhost:5173'],
  user: {
    additionalFields: {
      firstName: {
        required: true,
        type: 'string',
      },
      lastName: {
        required: true,
        type: 'string',
      },
      role: {
        required: true,
        type: 'string',
      },
    },
  },
});
