import type { Result } from '../../result';

import { ApplicationError } from '../../errors/application.error';
import { Guard } from '../../guards';
import { err, ok } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  value: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObject<Props> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(value: string): Result<Email> {
    Guard.string(value.trim().toLowerCase());

    if (!EMAIL_REGEX.test(value)) {
      return err(new ApplicationError('Invalid email format'));
    }

    return ok(new Email({ value: value.trim().toLowerCase() }));
  }

  public static raw(props: Props): Email {
    return new Email(props);
  }

  public domain(): string {
    return this.value.split('@')[1];
  }

  public local(): string {
    return this.value.split('@')[0];
  }

  public toString(): string {
    return this.value;
  }
}
