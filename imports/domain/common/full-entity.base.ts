import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Entity } from '@domain/common/entity.base';

export class FullEntity extends Entity {
  // #region Properties (7)

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

  // #endregion Properties (7)

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

  // #region Public Methods (3)

  public create(createdBy: string): void {
    this.createdAt = new Date();

    this.createdBy = createdBy;

    this.update(createdBy);
  }

  public delete(deletedBy: string): void {
    this.isDeleted = true;

    this.deletedAt = new Date();

    this.deletedBy = deletedBy;
  }

  public update(updatedBy: string): void {
    this.updatedAt = new Date();

    this.updatedBy = updatedBy;
  }

  // #endregion Public Methods (3)
}
