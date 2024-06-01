import { IsNotEmpty, IsString } from 'class-validator';

import { EntityNewV } from '@infra/mongo/entities/entity';

export abstract class AuditableEntity<
  TEntity extends EntityNewV,
> extends EntityNewV {
  @IsNotEmpty()
  @IsString()
  public parentId: string;

  public constructor(props: AuditableEntity<TEntity>) {
    super(props);

    this.parentId = props.parentId;
  }
}
