import type { BaseEntityProps } from '@/domain/shared/entity';

import { Entity } from '@/domain/shared/entity';

import type { Result } from '../shared/result';
import type { Email } from '../shared/value-objects/email/email.vo';

import { InternalServerError } from '../shared/errors/internal-server.error';
import { Guard } from '../shared/guards';
import { ok } from '../shared/result';
import { UserRole } from '../users/user.enum';
import { UserCreatedEvent } from './events/user-created.event';
import { UserEmailUpdatedEvent } from './events/user-email-updated.event';

interface UserProps {
  authId: null | string;
  email: Email;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export class UserEntity extends Entity<UserEntity> {
  public get authId(): null | string {
    return this._authId;
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

  public get role(): UserRole {
    return this._role;
  }

  private _authId: null | string;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _role: UserRole;

  private constructor(props: UserProps, base?: BaseEntityProps) {
    super(base);

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._authId = props.authId;
    this._role = props.role;
  }

  public static create(props: UserProps): Result<UserEntity> {
    Guard.string(props.firstName);
    Guard.string(props.lastName);

    if (props.role === UserRole.ADMIN) {
      throw new InternalServerError('Admin role is not allowed');
    }

    const user = new UserEntity({
      authId: props.authId,
      email: props.email,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      role: props.role,
    });

    user.addEvent(new UserCreatedEvent(user));

    return ok(user);
  }

  public static raw(props: UserProps, base: BaseEntityProps): UserEntity {
    return new UserEntity(props, base);
  }

  public updateAuthId(id: string) {
    this._authId = id;
  }

  public updateEmail(email: Email) {
    this._email = email;
    this.addEvent(new UserEmailUpdatedEvent(this));
  }

  public updateName(firstName: string, lastName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
  }
}
