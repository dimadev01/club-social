import { isEmail } from 'class-validator';
import { Result, err, ok } from 'neverthrow';

import { DomainError } from '@domain/common/errors/domain.error';
import { ValueObject } from '@domain/common/value-objects/value-object';

export interface IEmailVo {
  address: string;
}

export class EmailVo extends ValueObject<IEmailVo> {
  private constructor(props: IEmailVo) {
    super(props);
  }

  public get address(): string {
    return this.value.address;
  }

  public static create(props: IEmailVo): Result<EmailVo, Error> {
    if (!EmailVo.isValid(props.address)) {
      return err(new DomainError('Invalid email'));
    }

    return ok(new EmailVo(props));
  }

  public static from(props: IEmailVo): EmailVo {
    return new EmailVo(props);
  }

  private static isValid(email: string) {
    return isEmail(email);
  }
}
