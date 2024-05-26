import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

import { UniqueID } from '@domain/common/unique-id';

export class Entity extends UniqueID {
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

  protected constructor() {
    super();

    this.createdAt = new Date();

    this.createdBy = 'System';

    this.updatedAt = new Date();

    this.createdBy = 'System';

    this.isDeleted = false;

    this.deletedAt = null;

    this.deletedBy = null;
  }

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

  public restore(): void {
    this.isDeleted = false;
  }

  public update(updatedBy: string): void {
    this.updatedAt = new Date();

    this.updatedBy = updatedBy;
  }
}
