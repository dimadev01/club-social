import { UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';

import { SoftDeletablePersistenceMeta } from '@/shared/domain/persistence-meta';
import { ok, Result } from '@/shared/domain/result';
import { SoftDeletableAggregateRoot } from '@/shared/domain/soft-deletable-aggregate-root';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';

interface UserProps {
  banExpires: Date | null;
  banned: boolean | null;
  banReason: null | string;
  email: Email;
  firstName: string;
  lastName: string;
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

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get name(): string {
    return `${this._lastName} ${this._firstName}`;
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
  private _firstName: string;
  private _lastName: string;
  private _role: UserRole;
  private _status: UserStatus;

  private constructor(props: UserProps, meta?: SoftDeletablePersistenceMeta) {
    super(meta?.id, meta?.audit, meta?.deleted);

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._role = props.role;
    this._banned = props.banned;
    this._banReason = props.banReason;
    this._banExpires = props.banExpires;
    this._status = props.status;
  }

  public static create(
    props: UserProps,
    createdBy: string,
  ): Result<UserEntity> {
    const user = new UserEntity(props, {
      audit: { createdBy },
      id: UniqueId.generate(),
    });

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
        firstName: this._firstName,
        lastName: this._lastName,
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

  public updateName(firstName: string, lastName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
  }

  public updateProfile(props: {
    email: Email;
    firstName: string;
    lastName: string;
    status: UserStatus;
    updatedBy: string;
  }) {
    const oldUser = this.clone();

    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._status = props.status;

    this.markAsUpdated(props.updatedBy);
    this.addEvent(new UserUpdatedEvent(oldUser, this));
  }

  public updateStatus(status: UserStatus) {
    this._status = status;
  }
}
