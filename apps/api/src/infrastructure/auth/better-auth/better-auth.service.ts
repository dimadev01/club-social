import { roleStatements, statements } from '@club-social/shared/roles';
import { Injectable } from '@nestjs/common';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal';
import {
  admin as adminPlugin,
  createAccessControl,
  magicLink,
} from 'better-auth/plugins';
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';

import { ConfigService } from '@/infrastructure/config/config.service';
import { prisma } from '@/infrastructure/database/prisma/prisma.client';
import { EmailQueueService } from '@/infrastructure/email/email-queue.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

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

export const defaultConfig = {
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
      status: {
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

export const createBetterAuth = (config?: BetterAuthOptions) =>
  betterAuth({
    ...defaultConfig,
    ...config,
  });

/**
 * This needs to be named `auth` because the `@better-auth/cli` expects
 * this variable name. See https://www.better-auth.com/docs/concepts/cli
 */
export const auth = createBetterAuth({
  plugins: [
    ...(defaultConfig.plugins ?? []),
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        console.log({ email, url });
      },
    }),
  ],
});

@Injectable()
export class BetterAuthService {
  public get auth() {
    return this._auth;
  }

  private readonly _auth: typeof auth;

  public constructor(
    private readonly configService: ConfigService,
    private readonly emailQueueService: EmailQueueService,
  ) {
    this._auth = createBetterAuth({
      plugins: [
        ...(defaultConfig.plugins ?? []),
        magicLink({
          disableSignUp: true,
          sendMagicLink: ({ email, url }) =>
            this.emailQueueService.magicLink({ email, url }),
        }),
      ],
      trustedOrigins: this.configService.trustedOrigins,
    });
  }
}
