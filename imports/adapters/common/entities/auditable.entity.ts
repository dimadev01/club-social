import { IsNotEmpty, IsString } from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';

export abstract class AuditableEntity<TEntity extends Entity> extends Entity {
  @IsNotEmpty()
  @IsString()
  public parentId: string;

  public constructor(props: AuditableEntity<TEntity>) {
    super(props);

    this.parentId = props.parentId;
  }
}
