import { Meteor } from 'meteor/meteor';

import { RoleEnum } from '@domain/roles/role.enum';
import { RolePermissionAssignment } from '@domain/roles/roles';

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
    await Promise.all(
      Object.entries(RolePermissionAssignment).map(
        async ([roleKey, roleAssignment]) => {
          await Promise.all(
            Object.entries(roleAssignment).map(
              async ([scopeKey, permissions]) => {
                const users = await Meteor.users
                  .find({ 'profile.role': roleKey })
                  .fetchAsync();

                // @ts-expect-error
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
