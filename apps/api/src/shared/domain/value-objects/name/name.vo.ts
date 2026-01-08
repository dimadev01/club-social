import { Guard } from '../../guards';
import { ok, Result } from '../../result';
import { ValueObject } from '../value-object.base';

interface Props {
  firstName: string;
  lastName: string;
}

export class Name extends ValueObject<Props> {
  public get firstName(): string {
    return this.props.firstName;
  }

  public get fullName(): string {
    return this.fullNameLastNameFirst;
  }

  public get fullNameFirstNameFirst(): string {
    return this.toString();
  }

  public get fullNameLastNameFirst(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  public get lastName(): string {
    return this.props.lastName;
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(props: Props): Result<Name> {
    Guard.string(props.firstName);
    Guard.string(props.lastName);

    return ok(new Name(props));
  }

  public static raw(props: Props): Name {
    return new Name(props);
  }

  public toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
