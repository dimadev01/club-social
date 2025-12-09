import { Role } from '@club-social/types/roles';

import { Guard } from '@/domain/shared/guards';

import { auth } from '../auth/better-auth.config';
import { prisma } from './prisma.client';

async function main() {
  const adminUserEmail = process.env.ADMIN_USER_EMAIL;
  const adminPassword = process.env.ADMIN_USER_PASSWORD;

  Guard.string(adminUserEmail);
  Guard.string(adminPassword);

  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    return;
  }

  await auth.api.createUser({
    body: {
      data: {
        createdBy: 'System',
        deletedAt: null,
        deletedBy: null,
        firstName: 'Club Social',
        lastName: 'Monte Grande',
        updatedBy: 'System',
      },
      email: adminUserEmail,
      name: 'Club Social',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
}

main();
