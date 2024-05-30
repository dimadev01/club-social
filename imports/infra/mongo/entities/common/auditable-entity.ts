import { IsNotEmpty, IsString } from 'class-validator';

import { Entity } from '@infra/mongo/entities/common/entity';

export class AuditableEntity extends Entity {
  @IsNotEmpty()
  @IsString()
  public parentId: string;

  protected constructor(props: AuditableEntity) {
    super(props);

    this.parentId = props.parentId;
  }
}
