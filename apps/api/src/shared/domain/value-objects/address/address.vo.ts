import { Guard } from '../../guards';
import { ValueObject } from '../value-object.base';

interface Props {
  cityName: null | string;
  stateName: null | string;
  street: null | string;
  zipCode: null | string;
}

export class Address extends ValueObject<Props> {
  public get cityName(): null | string {
    return this.props.cityName;
  }

  public get stateName(): null | string {
    return this.props.stateName;
  }

  public get street(): null | string {
    return this.props.street;
  }

  public get zipCode(): null | string {
    return this.props.zipCode;
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(props: Props): Address {
    if (props.cityName !== null) {
      Guard.string(props.cityName);
    }

    if (props.stateName !== null) {
      Guard.string(props.stateName);
    }

    if (props.street !== null) {
      Guard.string(props.street);
    }

    if (props.zipCode !== null) {
      Guard.string(props.zipCode);
    }

    return new Address({
      cityName: props.cityName !== null ? props.cityName.trim() : null,
      stateName: props.stateName !== null ? props.stateName.trim() : null,
      street: props.street !== null ? props.street.trim() : null,
      zipCode: props.zipCode !== null ? props.zipCode.trim() : null,
    });
  }

  public static raw(props: Props): Address {
    return new Address(props);
  }

  public toString(): string {
    const parts = [
      this.street,
      this.cityName,
      this.stateName,
      this.zipCode,
    ].filter((part) => part !== null && part !== '');

    return parts.join(', ');
  }
}
