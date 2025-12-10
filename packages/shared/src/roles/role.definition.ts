import { Role } from './role.enum';
import {
  Action,
  Resource,
  type RoleStatements,
  type Statement,
} from './role.types';

export const statements = {
  [Resource.DUES]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ],
  [Resource.MEMBERS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ],
  [Resource.MOVEMENTS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ],
  [Resource.PAYMENTS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ],
  [Resource.USERS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ],
} satisfies Statement;

export const roleStatements = {
  [Role.ADMIN]: {
    [Resource.DUES]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ],
    [Resource.MEMBERS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ],
    [Resource.MOVEMENTS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
    ],
    [Resource.PAYMENTS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ],
    [Resource.USERS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.DELETE,
    ],
  },
  [Role.MEMBER]: {
    [Resource.DUES]: [Action.GET, Action.LIST],
    [Resource.MEMBERS]: [],
    [Resource.MOVEMENTS]: [],
    [Resource.PAYMENTS]: [Action.GET, Action.LIST],
    [Resource.USERS]: [],
  },
  [Role.STAFF]: {
    [Resource.DUES]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ],
    [Resource.MEMBERS]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ],
    [Resource.MOVEMENTS]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ],
    [Resource.PAYMENTS]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.LIST,
    ],
    [Resource.USERS]: [Action.GET, Action.UPDATE, Action.LIST],
  },
} satisfies RoleStatements;
