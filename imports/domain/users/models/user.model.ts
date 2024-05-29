import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { RoleEnum } from '@domain/roles/role.enum';
import { UserEmailModel } from '@domain/users/models/user-email.model';
import {
  CreateUser,
  IUserModel,
} from '@domain/users/models/user-model.interface';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';

export class UserModel extends Model implements IUserModel {
  private _emails: UserEmailModel[] | null;

  private _firstName: string;

  private _heartbeat: Date | null;

  private _lastName: string;

  private _role: RoleEnum;

  private _services: Record<string, unknown>;

  private _state: UserStateEnum;

  private _theme: UserThemeEnum;

  public constructor(props?: IUserModel) {
    super(props);

    this._firstName = props?.firstName ?? '';

    this._lastName = props?.lastName ?? '';

    this._role = props?.role ?? RoleEnum.ADMIN;

    this._theme = props?.theme ?? UserThemeEnum.AUTO;

    this._emails =
      props?.emails?.map((email) => new UserEmailModel(email)) ?? null;

    this._state = props?.state ?? UserStateEnum.ACTIVE;

    this._heartbeat = props?.heartbeat ?? null;

    this._services = props?.services ?? {};
  }

  public get emails(): UserEmailModel[] | null {
    return this._emails;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get heartbeat(): Date | null {
    return this._heartbeat;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get role(): RoleEnum {
    return this._role;
  }

  public get services(): Record<string, unknown> {
    return this._services;
  }

  public get state(): UserStateEnum {
    return this._state;
  }

  public get theme(): UserThemeEnum {
    return this._theme;
  }

  public static createOne(props: CreateUser): Result<UserModel, Error> {
    const user = new UserModel();

    const emails =
      props.emails?.map((email) =>
        UserEmailModel.createOne({
          address: email.address,
          verified: email.verified,
        }),
      ) ?? null;

    const combined = Result.combine(emails ?? []);

    if (combined.isErr()) {
      return err(combined.error);
    }

    const result = Result.combine([
      user.setFirstName(props.firstName),
      user.setLastName(props.lastName),
      user.setRole(props.role),
      user.setTheme(UserThemeEnum.AUTO),
      user.setEmails(combined.value.length > 0 ? combined.value : null),
      user.setState(UserStateEnum.ACTIVE),
      user.setHeartbeat(null),
      user.setServices({}),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(user);
  }

  public setEmails(value: UserEmailModel[] | null): Result<null, Error> {
    this._emails = value;

    return ok(null);
  }

  public setFirstName(value: string): Result<null, Error> {
    this._firstName = value;

    return ok(null);
  }

  public setHeartbeat(value: Date | null): Result<null, Error> {
    this._heartbeat = value;

    return ok(null);
  }

  public setLastName(value: string): Result<null, Error> {
    this._lastName = value;

    return ok(null);
  }

  public setRole(value: RoleEnum): Result<null, Error> {
    this._role = value;

    return ok(null);
  }

  public setServices(value: Record<string, unknown>): Result<null, Error> {
    this._services = value;

    return ok(null);
  }

  public setState(value: UserStateEnum): Result<null, Error> {
    this._state = value;

    return ok(null);
  }

  public setTheme(value: UserThemeEnum): Result<null, Error> {
    this._theme = value;

    return ok(null);
  }
}
