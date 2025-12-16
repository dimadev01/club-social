import { UserRole } from '../users';
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
    Action.VOID,
  ],
  [Resource.MEMBERS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.VOID,
  ],
  [Resource.MOVEMENTS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.VOID,
  ],
  [Resource.PAYMENTS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.VOID,
  ],
  [Resource.USERS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.VOID,
  ],
} satisfies Statement;

export const roleStatements = {
  [UserRole.ADMIN]: {
    [Resource.DUES]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.VOID,
    ],
    [Resource.MEMBERS]: [Action.CREATE, Action.LIST, Action.GET, Action.UPDATE],
    [Resource.MOVEMENTS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.VOID,
    ],
    [Resource.PAYMENTS]: [
      Action.CREATE,
      Action.LIST,
      Action.GET,
      Action.UPDATE,
      Action.VOID,
    ],
    [Resource.USERS]: [Action.CREATE, Action.LIST, Action.GET, Action.UPDATE],
  },
  [UserRole.MEMBER]: {
    [Resource.DUES]: [Action.GET, Action.LIST],
    [Resource.MEMBERS]: [],
    [Resource.MOVEMENTS]: [],
    [Resource.PAYMENTS]: [Action.GET, Action.LIST],
    [Resource.USERS]: [],
  },
  [UserRole.STAFF]: {
    [Resource.DUES]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.VOID,
      Action.LIST,
    ],
    [Resource.MEMBERS]: [Action.GET, Action.CREATE, Action.UPDATE, Action.LIST],
    [Resource.MOVEMENTS]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.VOID,
      Action.LIST,
    ],
    [Resource.PAYMENTS]: [
      Action.GET,
      Action.CREATE,
      Action.UPDATE,
      Action.VOID,
      Action.LIST,
    ],
    [Resource.USERS]: [Action.GET, Action.UPDATE, Action.LIST],
  },
} satisfies RoleStatements;
