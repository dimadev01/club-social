import { Meteor } from 'meteor/meteor';

import { RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { RolePermissionAssignment } from '@domain/roles/roles';
import { Roles } from 'types/meteor-roles';

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

  public static async update2(): Promise<void> {
    Object.values(RoleEnum).forEach((role) => {
      Roles.createRole(role, { unlessExists: true });
    });

    Object.values(ScopeEnum).forEach((role) => {
      Roles.createRole(role, { unlessExists: true });
    });
  }

  public static async update(): Promise<void> {
    // await Promise.all(Object.values(PermissionEnum).map(async (role) => {}));

    await Promise.all(
      Object.entries(RolePermissionAssignment).map(
        async ([roleKey, roleAssignment]) => {
          await Promise.all(
            Object.entries(roleAssignment).map(
              async ([scopeKey, permissions]) => {
                const users = await Meteor.users
                  .find({ 'profile.role': roleKey })
                  .fetchAsync();

                Roles.removeUsersFromRoles(users, permissions, {
                  anyScope: true,
                });

                Roles.addUsersToRoles(users, permissions, scopeKey);
              },
            ),
          );
        },
      ),
    );
  }
}
