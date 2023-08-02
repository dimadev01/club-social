import { IsNotEmpty, IsString } from 'class-validator';
import { Random } from 'meteor/random';

export class Entity {
  // #region Properties (1)

  @IsString()
  @IsNotEmpty()
  public _id: string;

  // #endregion Properties (1)

  // #region Constructors (1)

  protected constructor() {
    this._id = Random.id();
  }

  // #endregion Constructors (1)
}
