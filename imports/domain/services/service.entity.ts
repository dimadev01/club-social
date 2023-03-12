import { IsDate, IsOptional, IsString, validateSync } from 'class-validator';
import { Entity } from '@kernel/entity.base';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Service extends Entity {
  // #region Properties (2)

  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string | null;

  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public createdBy: string;

  @IsString()
  public updatedBy: string;

  // #endregion Properties (2)

  // #region Constructors (1)

  public constructor() {
    super();

    this.createdAt = new Date();

    this.createdBy = 'System';

    this.updatedAt = this.createdAt;

    this.updatedBy = 'System';
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  // #endregion Public Accessors (1)

  // #region Public Static Methods (1)

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

  // #endregion Public Static Methods (1)
}
