import { randomUUID } from 'crypto';

import { ValueObject } from '../value-object.base';

interface Props {
  readonly value: string;
}

export class UniqueId extends ValueObject<Props> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: Props) {
    super(props);
  }

  public static generate(): UniqueId {
    return new UniqueId({ value: randomUUID() });
  }

  public static raw(props: Props): UniqueId {
    return new UniqueId(props);
  }

  public toString(): string {
    return this.value;
  }
}
