import { UserRole, UserStatus } from '@club-social/shared/users';

import { SoftDeletablePersistenceMeta } from '@/shared/domain/persistence-meta';
import { ok, Result } from '@/shared/domain/result';
import { SoftDeletableAggregateRoot } from '@/shared/domain/soft-deletable-aggregate-root';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { StrictOmit } from '@/shared/types/type-utils';

import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import {
  DEFAULT_USER_PREFERENCES,
  UserPreferencesProps,
  UserPreferencesVO,
} from '../value-objects/user-preferences.vo';

export type CreateUserProps = StrictOmit<
  UserProps,
  'banExpires' | 'banned' | 'banReason' | 'preferences' | 'status'
>;

export interface UserProps {
  banExpires: Date | null;
  banned: boolean | null;
  banReason: null | string;
  email: Email;
  name: Name;
  preferences: UserPreferencesVO;
  role: UserRole;
  status: UserStatus;
}

export class UserEntity extends SoftDeletableAggregateRoot {
  public get banExpires(): Date | null {
    return this._banExpires;
  }

  public get banned(): boolean | null {
    return this._banned;
  }

  public get banReason(): null | string {
    return this._banReason;
  }

  public get email(): Email {
    return this._email;
  }

  public get name(): Name {
    return this._name;
  }

  public get preferences(): UserPreferencesVO {
    return this._preferences;
  }

  public get role(): UserRole {
    return this._role;
  }

  public get status(): UserStatus {
    return this._status;
  }

  private _banExpires: Date | null;
  private _banned: boolean | null;
  private _banReason: null | string;
  private _email: Email;
  private _name: Name;
  private _preferences: UserPreferencesVO;
  private _role: UserRole;
  private _status: UserStatus;

  private constructor(props: UserProps, meta?: SoftDeletablePersistenceMeta) {
    super(meta?.id, meta?.audit, meta?.deleted);

    this._name = props.name;
    this._email = props.email;
    this._role = props.role;
    this._banned = props.banned;
    this._banReason = props.banReason;
    this._banExpires = props.banExpires;
    this._status = props.status;
    this._preferences = props.preferences;
  }

  public static create(
    props: CreateUserProps,
    createdBy: string,
  ): Result<UserEntity> {
    const user = new UserEntity(
      {
        banExpires: null,
        banned: false,
        banReason: null,
        email: props.email,
        name: props.name,
        preferences: UserPreferencesVO.raw(DEFAULT_USER_PREFERENCES),
        role: props.role,
        status: UserStatus.ACTIVE,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    user.addEvent(new UserCreatedEvent(user));

    return ok(user);
  }

  public static fromPersistence(
    props: UserProps,
    meta: SoftDeletablePersistenceMeta,
  ): UserEntity {
    return new UserEntity(props, meta);
  }

  public clone(): UserEntity {
    return UserEntity.fromPersistence(
      {
        banExpires: this._banExpires,
        banned: this._banned,
        banReason: this._banReason,
        email: this._email,
        name: this._name,
        preferences: this._preferences,
        role: this._role,
        status: this._status,
      },
      {
        audit: { ...this._audit },
        deleted: { ...this._deleted },
        id: this.id,
      },
    );
  }

  public updateEmail(email: Email) {
    this._email = email;
  }

  public updateName(name: Name) {
    this._name = name;
  }

  public updatePreferences(
    preferences: Partial<UserPreferencesProps>,
    updatedBy: string,
  ): void {
    this._preferences = this._preferences.update(preferences);
    this.markAsUpdated(updatedBy);

    const oldUser = this.clone();

    this.addEvent(new UserUpdatedEvent(oldUser, this));
  }

  public updateProfile(props: {
    email: Email;
    name: Name;
    status: UserStatus;
    updatedBy: string;
  }) {
    const oldUser = this.clone();

    this._email = props.email;
    this._name = props.name;
    this._status = props.status;

    this.markAsUpdated(props.updatedBy);
    this.addEvent(new UserUpdatedEvent(oldUser, this));
  }

  public updateStatus(status: UserStatus) {
    this._status = status;
  }
}
