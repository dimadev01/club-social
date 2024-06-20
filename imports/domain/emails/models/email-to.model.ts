import { Result, err, ok } from 'neverthrow';

import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { IEmailTo } from '@domain/emails/email.interface';

export class EmailTo implements IEmailTo {
  private _email: EmailVo;

  private _name: string;

  public constructor(props?: IEmailTo) {
    this._email = props?.email ?? EmailVo.from({ address: '' });

    this._name = props?.name ?? '';
  }

  public get email(): EmailVo {
    return this._email;
  }

  public get name(): string {
    return this._name;
  }

  public static create(props: IEmailTo): Result<EmailTo, Error> {
    const emailTo = new EmailTo();

    const result = Result.combine([
      emailTo.setEmail(props.email),
      emailTo.setName(props.name),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(emailTo);
  }

  private setEmail(email: EmailVo): Result<null, Error> {
    this._email = email;

    return ok(null);
  }

  private setName(name: string): Result<null, Error> {
    this._name = name;

    return ok(null);
  }
}
