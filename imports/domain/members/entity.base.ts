import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Random } from 'meteor/random';

export class Entity {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  protected constructor() {
    this._id = Random.id();

    this.createdAt = new Date();

    this.updatedAt = new Date();
  }
}
