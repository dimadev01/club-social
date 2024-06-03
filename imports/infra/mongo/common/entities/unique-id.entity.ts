import { IsNotEmpty, IsString } from 'class-validator';

import { IUniqueIdEntity } from '@infra/mongo/common/entities/unique-id-entity.interface';

export class UniqueIDEntity implements IUniqueIdEntity {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  protected constructor(props: UniqueIDEntity) {
    this._id = props._id;
  }
}
