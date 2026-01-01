import { passkey, type PasskeyOptions } from '@better-auth/passkey';
import { roleStatements, statements } from '@club-social/shared/roles';
import { UserStatus } from '@club-social/shared/users';
import { Inject, Injectable } from '@nestjs/common';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal';
import {
  admin as adminPlugin,
  createAccessControl,
  magicLink,
  type MagicLinkOptions,
} from 'better-auth/plugins';
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access';

import { ConfigService } from '@/infrastructure/config/config.service';
import { prisma } from '@/infrastructure/database/prisma/prisma.client';
import { EmailQueueService } from '@/infrastructure/email/email-queue.service';
import { SendMagicLinkParams } from '@/infrastructure/email/email.types';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_READABLE_REPOSITORY_PROVIDER,
  type UserReadableRepository,
} from '@/users/domain/user.repository';

interface BuildPluginsOptions {
  passkey?: PasskeyOptions;
  sendMagicLink?: MagicLinkOptions['sendMagicLink'];
}

const ac = createAccessControl({ ...defaultStatements, ...statements });

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

const buildPasskeyPlugin = (config?: PasskeyOptions) =>
  config ? passkey(config) : passkey();

const buildPlugins = (options?: BuildPluginsOptions) => [
  adminPlugin({
    ac,
    roles: {
      admin: adminRole,
      member: memberRole,
      staff: staffRole,
    },
  }),
  magicLink({
    disableSignUp: true,
    sendMagicLink: async (data) => {
      if (options?.sendMagicLink) {
        return options.sendMagicLink(data);
      }

      console.log(data);
    },
  }),
  buildPasskeyPlugin(options?.passkey),
];

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
  plugins: buildPlugins(),
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
      updatedAt: {
        required: true,
        type: 'date',
      },
      updatedBy: {
        required: true,
        type: 'string',
      },
    },
  },
} satisfies BetterAuthOptions;

export const createBetterAuth = (config?: BetterAuthOptions) =>
  betterAuth({ ...defaultConfig, ...config });

/**
 * This needs to be named `auth` because the `@better-auth/cli` expects
 * this variable name. See https://www.better-auth.com/docs/concepts/cli
 */
export const auth = createBetterAuth();

@Injectable()
export class BetterAuthService {
  public get auth() {
    return this._auth;
  }

  private readonly _auth;

  public constructor(
    private readonly configService: ConfigService,
    private readonly emailQueueService: EmailQueueService,
    @Inject(USER_READABLE_REPOSITORY_PROVIDER)
    private readonly userRepository: UserReadableRepository,
  ) {
    this._auth = createBetterAuth({
      emailVerification: {
        sendVerificationEmail: async (data) => {
          console.log(data);
        },
      },
      hooks: {
        before: createAuthMiddleware(async (ctx) => {
          if (ctx.path === '/sign-in/magic-link') {
            await this.verifySignIn(ctx.body.email);
          }
        }),
      },
      plugins: buildPlugins({
        passkey: {
          rpID: this.configService.appDomain,
          rpName: this.configService.appDisplayName,
        },
        sendMagicLink: (data) =>
          this.sendMagicLink({ email: data.email, url: data.url }),
      }),
      trustedOrigins: this.configService.trustedOrigins,
      user: {
        ...defaultConfig.user,
        changeEmail: {
          enabled: true,
        },
      },
    });
  }

  private async sendMagicLink(data: SendMagicLinkParams) {
    return this.emailQueueService.magicLink({
      email: data.email,
      url: data.url,
    });
  }

  private async verifySignIn(email: string) {
    const emailResult = Email.create(email);

    if (emailResult.isErr()) {
      throw new APIError('BAD_REQUEST', { message: emailResult.error.message });
    }

    const user = await this.userRepository.findUniqueByEmail(emailResult.value);

    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'Usuario no encontrado' });
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new APIError('NOT_FOUND', { message: 'Usuario inactivo' });
    }

    if (user.banned) {
      throw new APIError('NOT_FOUND', { message: 'Usuario inactivo' });
    }
  }
}
