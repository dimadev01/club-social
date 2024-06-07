import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import invariant from 'tiny-invariant';

import {
  PermissionEnum,
  RoleAssignment,
  RoleEnum,
} from '@domain/roles/role.enum';

export abstract class RoleService {
  public static findAll(): Array<{ _id: string; value: RoleEnum }> {
    return Object.values(RoleEnum).map((role) => ({
      _id: role,
      value: role,
    }));
  }

  public static findForSelect() {
    return Object.values(RoleEnum).map((role) => ({
      text: role,
      value: role,
    }));
  }

  public static async update(): Promise<void> {
    // @ts-expect-error
    await Meteor.roleAssignment.removeAsync({});

    // @ts-expect-error
    await Meteor.roles.removeAsync({});

    await Promise.all(
      Object.values(RoleEnum).map(async (role) => {
        await Roles.createRoleAsync(role, { unlessExists: true });
      }),
    );

    await Promise.all(
      Object.values(PermissionEnum).map(async (permission) => {
        await Roles.createRoleAsync(permission, { unlessExists: true });
      }),
    );

    const users = await Meteor.users.find({}).fetchAsync();

    await Promise.all(
      users.map(async (user) => {
        invariant(user.profile);

        const role = RoleAssignment[user.profile.role];

        await Promise.all(
          Object.entries(role).map(async ([scope, permissions]) => {
            await Roles.addUsersToRolesAsync(user, permissions, scope);
          }),
        );
      }),
    );
  }
}
