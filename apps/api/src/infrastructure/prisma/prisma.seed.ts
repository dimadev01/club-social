import { Role } from '@club-social/shared/roles';

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

  await Promise.all([
    auth.api.createUser({
      body: {
        data: {
          createdBy: 'System',
          deletedAt: null,
          deletedBy: null,
          firstName: 'Club Social',
          lastName: 'Admin',
          updatedBy: 'System',
        },
        email: adminUserEmail,
        name: 'Club Social Admin',
        password: adminPassword,
        role: Role.ADMIN,
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
          updatedBy: 'System',
        },
        email: 'member@clubsocialmontegrande.ar',
        name: 'Member',
        password: adminPassword,
        role: Role.MEMBER,
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
          updatedBy: 'System',
        },
        email: 'staff@clubsocialmontegrande.ar',
        name: 'Staff',
        password: adminPassword,
        role: Role.STAFF,
      },
    }),
  ]);
}

main();
