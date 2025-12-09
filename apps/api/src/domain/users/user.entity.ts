import { Role } from '@club-social/types/roles';

import type { BaseEntityProps } from '@/domain/shared/entity';

import { Entity } from '@/domain/shared/entity';

import type { Result } from '../shared/result';
import type { Email } from '../shared/value-objects/email/email.vo';

import { InternalServerError } from '../shared/errors/internal-server.error';
import { Guard } from '../shared/guards';
import { ok } from '../shared/result';
import { UserCreatedEvent } from './events/user-created.event';
import { UserEmailUpdatedEvent } from './events/user-email-updated.event';

interface UserProps {
  email: Email;
  firstName: string;
  lastName: string;
  role: Role;
}

export class UserEntity extends Entity<UserEntity> {
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

  public get role(): Role {
    return this._role;
  }

  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _role: Role;

  private constructor(props: UserProps, base?: BaseEntityProps) {
    super(base);

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._role = props.role;
  }

  public static create(props: UserProps): Result<UserEntity> {
    Guard.string(props.firstName);
    Guard.string(props.lastName);

    if (props.role === Role.ADMIN) {
      throw new InternalServerError('Admin role is not allowed');
    }

    const user = new UserEntity({
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

  public updateEmail(email: Email) {
    this._email = email;
    this.addEvent(new UserEmailUpdatedEvent(this));
  }

  public updateName(firstName: string, lastName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
  }
}
