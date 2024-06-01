import { IsNotEmpty, IsString } from 'class-validator';

import { IUniqueIdEntity } from '@infra/mongo/entities/common/unique-id-entity.interface';

export class UniqueIDEntityNewV implements IUniqueIdEntity {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  protected constructor(props: IUniqueIdEntity) {
    this._id = props._id;
  }
}
