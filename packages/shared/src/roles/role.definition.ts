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
  [Resource.USERS]: [
    Action.CREATE,
    Action.LIST,
    Action.GET,
    Action.UPDATE,
    Action.DELETE,
  ] as const,
} satisfies Statement;

export const roleStatements = {
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
    [Resource.USERS]: [
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
    [Resource.USERS]: [],
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
    [Resource.USERS]: [Action.GET, Action.UPDATE, Action.LIST] as const,
  },
} satisfies RoleStatements;
