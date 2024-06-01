import { Random } from 'meteor/random';

import { IUniqueIDProps } from '@domain/common/models/unique-id-model.interface';

export class UniqueIDModel implements IUniqueIDProps {
  public _id: string;

  protected constructor(props?: IUniqueIDProps) {
    this._id = props?._id ?? Random.id();
  }
}
