import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

import { IEntity } from '@infra/mongo/entities/common/entity.interface';
import { UniqueIDEntityNewV } from '@infra/mongo/entities/common/unique-id.entity';

export class EntityNewV extends UniqueIDEntityNewV implements IEntity {
  @IsDate()
  public createdAt: Date;

  @IsString()
  public createdBy: string;

  @IsDate()
  @IsOptional()
  public deletedAt: Date | null;

  @IsString()
  @IsOptional()
  public deletedBy: string | null;

  @IsBoolean()
  public isDeleted: boolean;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  protected constructor(props: IEntity) {
    super(props);

    this.createdAt = props.createdAt;

    this.createdBy = props.createdBy;

    this.deletedAt = props.deletedAt;

    this.deletedBy = props.deletedBy;

    this.isDeleted = props.isDeleted;

    this.updatedAt = props.updatedAt;

    this.updatedBy = props.updatedBy;
  }
}
