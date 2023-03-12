import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Entity } from '@kernel/entity.base';

export class FullEntity extends Entity {
  // #region Properties (5)

  @IsDate()
  public createdAt: Date;

  @IsString()
  public createdBy: string;

  @IsBoolean()
  public isDeleted: boolean;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  // #endregion Properties (5)

  // #region Constructors (1)

  protected constructor() {
    super();

    this.createdAt = new Date();

    this.updatedAt = new Date();

    this.isDeleted = false;

    this.createdBy = 'System';

    this.updatedBy = 'System';
  }

  // #endregion Constructors (1)
}
