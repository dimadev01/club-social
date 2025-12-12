import { UserRole, UserStatus } from '@club-social/shared/users';

import { Guard } from '@/domain/shared/guards';
import { auth } from '@/infrastructure/auth/better-auth.service';

import { prisma } from './prisma.client';

async function main() {
  const adminUserEmail = process.env.ADMIN_USER_EMAIL;
  const adminPassword = 'BgW5wWo0ObMmGw2';

  Guard.string(adminUserEmail);
  Guard.string(adminPassword);

  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    return;
  }

  await Promise.all([
    auth.api.createUser({
      body: {
        data: {
          createdBy: 'System',
          deletedAt: null,
          deletedBy: null,
          firstName: 'Club Social',
          lastName: 'Admin',
          status: UserStatus.ACTIVE,
          updatedBy: 'System',
        },
        email: adminUserEmail,
        name: 'Club Social Admin',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    }),
    auth.api.createUser({
      body: {
        data: {
          createdBy: 'System',
          deletedAt: null,
          deletedBy: null,
          firstName: 'Club Social',
          lastName: 'Member',
          status: UserStatus.ACTIVE,
          updatedBy: 'System',
        },
        email: 'member@clubsocialmontegrande.ar',
        name: 'Member',
        password: adminPassword,
        role: UserRole.MEMBER,
      },
    }),
    auth.api.createUser({
      body: {
        data: {
          createdBy: 'System',
          deletedAt: null,
          deletedBy: null,
          firstName: 'Club Social',
          lastName: 'Staff',
          status: UserStatus.ACTIVE,
          updatedBy: 'System',
        },
        email: 'staff@clubsocialmontegrande.ar',
        name: 'Staff',
        password: adminPassword,
        role: UserRole.STAFF,
      },
    }),
  ]);
}

main();
