import { IsNotEmpty, IsString } from 'class-validator';

import { Entity } from '@infra/mongo/entities/common/entity';

export class UserEntity extends Entity {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  public constructor(props?: UserEntity) {
    super(props);

    if (props) {
      this.firstName = props.firstName;
    }
  }
}
