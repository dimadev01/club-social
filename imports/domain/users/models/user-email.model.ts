import { Result, err, ok } from 'neverthrow';

import { CreateUserEmail, IUserEmail } from '@domain/users/user.interface';

export class UserEmail implements IUserEmail {
  private _address: string;

  private _verified: boolean;

  public constructor(props?: IUserEmail) {
    this._address = props?.address ?? '';

    this._verified = props?.verified ?? false;
  }

  public get address(): string {
    return this._address;
  }

  public get verified(): boolean {
    return this._verified;
  }

  public static createOne(props: CreateUserEmail): Result<UserEmail, Error> {
    const email = new UserEmail();

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
