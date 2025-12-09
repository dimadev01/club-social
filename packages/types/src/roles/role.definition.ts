import { createAccessControl } from 'better-auth/plugins';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

import { Role } from './role.enum';
import { Action, Resource, RoleStatements, Statement } from './role.types';

const statements = {
  [Resource.DUES]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
  [Resource.MEMBER]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
  [Resource.MOVEMENT]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
  [Resource.PAYMENT]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
  [Resource.USER]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
} satisfies Statement;

const roleStatements = {
  [Role.ADMIN]: {
    [Resource.DUES]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ] as const,
    [Resource.MEMBER]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ] as const,
    [Resource.MOVEMENT]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
    ] as const,
    [Resource.PAYMENT]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ] as const,
    [Resource.USER]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ] as const,
  },
  [Role.MEMBER]: {
    [Resource.DUES]: [Action.GET, Action.LIST] as const,
    [Resource.MEMBER]: [],
    [Resource.MOVEMENT]: [],
    [Resource.PAYMENT]: [Action.GET, Action.LIST] as const,
    [Resource.USER]: [],
  },
  [Role.STAFF]: {
    [Resource.DUES]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ] as const,
    [Resource.MEMBER]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ] as const,
    [Resource.MOVEMENT]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ] as const,
    [Resource.PAYMENT]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ] as const,
    [Resource.USER]: [Action.GET, Action.UPDATE, Action.LIST] as const,
  },
} satisfies RoleStatements;

const ac = createAccessControl({
  ...defaultStatements,
  ...statements,
});

export const adminRole = ac.newRole({
  ...adminAc.statements,
  ...roleStatements.admin,
});

export const staffRole = ac.newRole({
  ...roleStatements.staff,
});

export const memberRole = ac.newRole({
  ...roleStatements.member,
});
