import { randomUUID } from 'crypto';

import { IId, UUIDv4 } from '@shared/core/types';

export class Id implements IId<UUIDv4> {
  private readonly _value: UUIDv4;

  protected constructor(id?: UUIDv4) {
    if (id === undefined) {
      this._value = randomUUID();
    } else {
      this._value = id;
    }
  }

  public static create(id?: UUIDv4): Id {
    return new Id(id);
  }

  public get value(): UUIDv4 {
    return this._value;
  }
}
