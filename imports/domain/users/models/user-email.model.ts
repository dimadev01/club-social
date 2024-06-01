import { Result, err, ok } from 'neverthrow';

import {
  CreateUserEmail,
  IUserEmailModel,
} from '@domain/users/models/user-model.interface';

export class UserEmailModel implements IUserEmailModel {
  private _address: string;

  private _verified: boolean;

  public constructor(props?: IUserEmailModel) {
    this._address = props?.address ?? '';

    this._verified = props?.verified ?? false;
  }

  public get address(): string {
    return this._address;
  }

  public get verified(): boolean {
    return this._verified;
  }

  public static createOne(
    props: CreateUserEmail,
  ): Result<UserEmailModel, Error> {
    const email = new UserEmailModel();

    const result = Result.combine([
      email.setAddress(props.address),
      email.setVerified(props.verified),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(email);
  }

  public setAddress(value: string): Result<null, Error> {
    this._address = value;

    return ok(null);
  }

  public setVerified(value: boolean): Result<null, Error> {
    this._verified = value;

    return ok(null);
  }
}
