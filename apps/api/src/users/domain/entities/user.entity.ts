import { UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { InternalServerError } from '@/shared/domain/errors/internal-server.error';
import { Guard } from '@/shared/domain/guards';
import { ok, Result } from '@/shared/domain/result';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { UpdateUserProfileProps } from '../interfaces/user.interface';

interface UserProps {
  banExpires: Date | null;
  banned: boolean | null;
  banReason: null | string;
  createdBy: string;
  email: Email;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
}

export class UserEntity extends Entity<UserEntity> {
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
    return `${this._firstName} ${this._lastName}`;
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

  private constructor(props: UserProps, base?: BaseEntityProps) {
    super(base);

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._role = props.role;
    this._banned = props.banned;
    this._banReason = props.banReason;
    this._banExpires = props.banExpires;
    this._status = props.status;
  }

  public static create(props: UserProps): Result<UserEntity> {
    Guard.string(props.firstName);
    Guard.string(props.lastName);

    if (props.role === UserRole.ADMIN) {
      throw new InternalServerError('Admin role is not allowed');
    }

    const user = new UserEntity({
      banExpires: props.banExpires,
      banned: props.banned,
      banReason: props.banReason,
      createdBy: props.createdBy,
      email: props.email,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      role: props.role,
      status: props.status,
    });

    user.addEvent(new UserCreatedEvent(user));

    return ok(user);
  }

  public static fromPersistence(
    props: UserProps,
    base: BaseEntityProps,
  ): UserEntity {
    return new UserEntity(props, base);
  }

  public updateEmail(email: Email) {
    this._email = email;
  }

  public updateName(firstName: string, lastName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
  }

  public updateProfile(props: UpdateUserProfileProps) {
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._status = props.status;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new UserUpdatedEvent(this.id, props));
  }

  public updateStatus(status: UserStatus) {
    this._status = status;
  }
}
