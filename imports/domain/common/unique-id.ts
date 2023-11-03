import { IsNotEmpty, IsString } from 'class-validator';
import { Random } from 'meteor/random';

export class UniqueID {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  protected constructor() {
    this._id = Random.id();
  }
}
