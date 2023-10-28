import { IsDate, IsOptional, IsString, validateSync } from 'class-validator';
import { FullEntity } from '@domain/common/full-entity.base';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Service extends FullEntity {
  @IsDate()
  public createdAt: Date;

  @IsString()
  public createdBy: string;

  @IsString()
  @IsOptional()
  public description: string | null;

  @IsString()
  public name: string;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  public constructor() {
    super();

    this.createdAt = new Date();

    this.createdBy = 'System';

    this.updatedAt = this.createdAt;

    this.updatedBy = 'System';
  }

  public static create(name: string, description: string | null): Service {
    const service = new Service();

    service.name = name;

    service.description = description;

    const errors = validateSync(service);

    if (errors.length > 0) {
      throw new Error(ValidationUtils.getErrorMessage(errors));
    }

    return service;
  }
}
