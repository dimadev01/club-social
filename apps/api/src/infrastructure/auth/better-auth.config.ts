import { adminRole, memberRole, staffRole } from '@club-social/types/roles';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal';
import { admin as adminPlugin, magicLink } from 'better-auth/plugins';

import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';

import { prisma } from '../prisma/prisma.client';

export const betterAuthOptions = {
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
      roles: {
        admin: adminRole,
        member: memberRole,
        staff: staffRole,
      },
    }),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, token, url }) => {
        console.log({ email, token, url });
      },
    }),
  ],
  user: {
    additionalFields: {
      createdBy: {
        required: true,
        type: 'string',
      },
      deletedAt: {
        required: false,
        type: 'date',
      },
      deletedBy: {
        required: false,
        type: 'string',
      },
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
      updatedBy: {
        required: true,
        type: 'string',
      },
    },
  },
} satisfies BetterAuthOptions;

export const createBetterAuth = (options?: BetterAuthOptions) =>
  betterAuth({
    ...betterAuthOptions,
    ...options,
  });

/**
 * This needs to be named `auth` because the `@better-auth/cli` expects
 * this variable name. See https://www.better-auth.com/docs/concepts/cli
 */
export const auth = createBetterAuth();
