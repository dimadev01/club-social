import type { BaseEntityProps } from '@/domain/shared/entity';

import { Entity } from '@/domain/shared/entity';

import type { Result } from '../shared/result';
import type { Email } from '../shared/value-objects/email/email.vo';

import { Guard } from '../shared/guards';
import { ok } from '../shared/result';

interface UserProps {
  email: Email;
  firstName: string;
  lastName: string;
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

  private _email: Email;
  private _firstName: string;
  private _lastName: string;

  private constructor(props: UserProps, base?: BaseEntityProps) {
    super(base);

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
  }

  public static create(props: UserProps): Result<UserEntity> {
    Guard.string(props.firstName);
    Guard.string(props.lastName);

    const user = new UserEntity({
      email: props.email,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
    });

    return ok(user);
  }

  public static fromPersistence(
    props: UserProps,
    base: BaseEntityProps,
  ): UserEntity {
    return new UserEntity(props, base);
  }
}
