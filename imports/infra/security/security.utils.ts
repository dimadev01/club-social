import invariant from 'tiny-invariant';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';

export abstract class SecurityUtils {
  public static isInRole(
    permission: PermissionEnum,
    scope: ScopeEnum,
  ): boolean {
    const user = Meteor.user();

    invariant(user);

    return Roles.userIsInRole(user, permission, scope);
  }
}
