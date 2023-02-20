import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Random } from 'meteor/random';

export class Entity {
  // #region Properties (6)

  @IsString()
  @IsNotEmpty()
  public _id: string;

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

  // #endregion Properties (6)

  // #region Constructors (1)

  protected constructor() {
    this._id = Random.id();

    this.createdAt = new Date();

    this.updatedAt = new Date();

    this.isDeleted = false;

    this.createdBy = 'System';

    this.updatedBy = 'System';
  }

  // #endregion Constructors (1)
}
