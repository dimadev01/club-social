import { Random } from 'meteor/random';

import { IUniqueID } from '@domain/common/models/unique-id-model.interface';

export class UniqueIDModel implements IUniqueID {
  public _id: string;

  protected constructor(props?: IUniqueID) {
    this._id = props?._id ?? Random.id();
  }
}
