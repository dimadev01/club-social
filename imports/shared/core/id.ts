import { randomUUID } from 'crypto';

import { UID, UUIDv4 } from '@shared/core/types';

export class ID implements UID<UUIDv4> {
  private readonly _value: UUIDv4;

  protected constructor(id?: UUIDv4) {
    if (id === undefined) {
      this._value = randomUUID();
    } else {
      this._value = id;
    }
  }

  public static create(id?: UUIDv4): ID {
    return new ID(id);
  }

  public get value(): UUIDv4 {
    return this._value;
  }
}
